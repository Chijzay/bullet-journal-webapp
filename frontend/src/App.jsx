import { useEffect, useState } from 'react';
import axios from 'axios';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import AuthScreen from './components/AuthScreen';

const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api/todos';

const FILTERS = {
  OPEN: 'OPEN',
  TODAY: 'TODAY',
  THIS_WEEK: 'THIS_WEEK',
  DONE: 'DONE',
  ALL: 'ALL',
};

const SORTS = {
  CREATED_DESC: 'CREATED_DESC',
  CREATED_ASC: 'CREATED_ASC',
  DUE_ASC: 'DUE_ASC',
  DUE_DESC: 'DUE_DESC',
  STATUS: 'STATUS',
  TEXT_ASC: 'TEXT_ASC',
  TEXT_DESC: 'TEXT_DESC',
  CATEGORY_ASC: 'CATEGORY_ASC',
};

const PAGE_SIZE = 8;

function App() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState(FILTERS.ALL);
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState(SORTS.CREATED_DESC);
  const [loading, setLoading] = useState(true);

  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  const [page, setPage] = useState(1);

  const [darkMode, setDarkMode] = useState(false);

  // Theme aus localStorage laden
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
    }
  }, []);

  // Dark Mode Klasse auf <html> setzen
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // UI-Filter- und Sortierungszustand aus localStorage laden
  useEffect(() => {
    const savedFilter = localStorage.getItem('todo_filter');
    const savedCategoryFilter = localStorage.getItem('todo_category_filter');
    const savedSortBy = localStorage.getItem('todo_sortBy');
    const savedPage = localStorage.getItem('todo_page');

    if (savedFilter && Object.values(FILTERS).includes(savedFilter)) {
      setFilter(savedFilter);
    }
    if (savedCategoryFilter) {
      setCategoryFilter(savedCategoryFilter);
    }
    if (savedSortBy && Object.values(SORTS).includes(savedSortBy)) {
      setSortBy(savedSortBy);
    }
    if (savedPage) {
      const p = Number(savedPage);
      if (!Number.isNaN(p) && p >= 1) {
        setPage(p);
      }
    }
  }, []);

  // UI-Status in localStorage schreiben
  useEffect(() => {
    localStorage.setItem('todo_filter', filter);
  }, [filter]);

  useEffect(() => {
    localStorage.setItem('todo_category_filter', categoryFilter);
  }, [categoryFilter]);

  useEffect(() => {
    localStorage.setItem('todo_sortBy', sortBy);
  }, [sortBy]);

  useEffect(() => {
    localStorage.setItem('todo_page', String(page));
  }, [page]);

  // Token aus localStorage laden
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
    }
    setAuthChecked(true);
  }, []);

  const fetchTodos = async () => {
    if (!token) return;
    setLoading(true);
    const res = await axios.get(API_URL);
    setTodos(res.data);
    setLoading(false);
  };

  useEffect(() => {
    if (token) {
      fetchTodos();
    } else {
      setLoading(false);
    }
  }, [token]);

  const handleAuthSuccess = ({ user, token }) => {
    setUser(user);
    setToken(token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    fetchTodos();
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    setTodos([]);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    // Filter/Sortierung bleiben bewusst erhalten
  };

  const addTodo = async ({ text, dueDate, category }) => {
    const res = await axios.post(API_URL, { text, dueDate, category });
    setTodos((prev) => [res.data, ...prev]);
    setPage(1);
  };

  const deleteTodo = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    setTodos((prev) => prev.filter((t) => t._id !== id));
  };

  const updateTodo = async (id, updates) => {
    const res = await axios.patch(`${API_URL}/${id}`, updates);
    setTodos((prev) => prev.map((t) => (t._id === id ? res.data : t)));
  };

  const toggleTodo = async (id) => {
    const todo = todos.find((t) => t._id === id);
    if (!todo) return;
    await updateTodo(id, { done: !todo.done });
  };

  const applyFilter = (items) => {
    const now = new Date();

    const isSameDay = (d1, d2) =>
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();

    const isSameWeek = (d1, d2) => {
      const oneDay = 24 * 60 * 60 * 1000;
      const diff = Math.abs(
        Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate()) -
          Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate())
      );
      const dayDiff = Math.floor(diff / oneDay);
      return dayDiff < 7;
    };

    return items.filter((todo) => {
      const created = new Date(todo.createdAt);
      const due = todo.dueDate ? new Date(todo.dueDate) : null;
      const refDate = due || created;

      // Status/Zeit-Filter
      switch (filter) {
        case FILTERS.OPEN:
          if (todo.done) return false;
          break;
        case FILTERS.DONE:
          if (!todo.done) return false;
          break;
        case FILTERS.TODAY:
          if (!isSameDay(refDate, now)) return false;
          break;
        case FILTERS.THIS_WEEK:
          if (!isSameWeek(refDate, now)) return false;
          break;
        case FILTERS.ALL:
        default:
          break;
      }

      // Kategorie-Filter zusätzlich
      if (categoryFilter !== 'ALL') {
        const cat = (todo.category || '').trim();
        if (cat !== categoryFilter) return false;
      }

      return true;
    });
  };

  const applySort = (items) => {
    const sorted = [...items];

    sorted.sort((a, b) => {
      const createdA = new Date(a.createdAt);
      const createdB = new Date(b.createdAt);
      const dueA = a.dueDate ? new Date(a.dueDate) : null;
      const dueB = b.dueDate ? new Date(b.dueDate) : null;

      switch (sortBy) {
        case SORTS.CREATED_ASC:
          return createdA - createdB;
        case SORTS.CREATED_DESC:
          return createdB - createdA;
        case SORTS.DUE_ASC:
          if (!dueA && !dueB) return 0;
          if (!dueA) return 1;
          if (!dueB) return -1;
          return dueA - dueB;
        case SORTS.DUE_DESC:
          if (!dueA && !dueB) return 0;
          if (!dueA) return 1;
          if (!dueB) return -1;
          return dueB - dueA;
        case SORTS.STATUS:
          if (a.done === b.done) return 0;
          return a.done ? 1 : -1;
        case SORTS.TEXT_ASC:
          return a.text.localeCompare(b.text, 'de', { sensitivity: 'base' });
        case SORTS.TEXT_DESC:
          return b.text.localeCompare(a.text, 'de', { sensitivity: 'base' });
        case SORTS.CATEGORY_ASC:
          return (a.category || '').localeCompare(b.category || '', 'de', {
            sensitivity: 'base',
          });
        default:
          return 0;
      }
    });

    return sorted;
  };

  const filtered = applyFilter(todos);
  const sorted = applySort(filtered);

  // Alle vorhandenen Kategorien für Dropdown
  const allCategories = Array.from(
    new Set(
      todos
        .map((t) => (t.category || '').trim())
        .filter((cat) => cat && cat.length > 0)
    )
  );

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const pagedTodos = sorted.slice(startIndex, startIndex + PAGE_SIZE);

  if (!authChecked) {
    return null;
  }

  if (!token || !user) {
    return <AuthScreen onAuthSuccess={handleAuthSuccess} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex items-center justify-center px-2 sm:px-0">
      <div className="bg-white dark:bg-slate-800 shadow-lg rounded-2xl p-6 w-full max-w-3xl space-y-4 border border-slate-200 dark:border-slate-700">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            ToDo Liste
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="text-gray-600 dark:text-gray-300">
              {user.username || user.email}
            </span>
            <button
              onClick={() => setDarkMode((prev) => !prev)}
              className="px-3 py-1 rounded-lg border text-gray-700 dark:text-gray-200 border-gray-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
            <button
              onClick={handleLogout}
              className="px-3 py-1 rounded-lg border text-gray-700 dark:text-gray-200 border-gray-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              Logout
            </button>
          </div>
        </div>

        <TodoForm onAdd={addTodo} />

        {/* Filter & Sortierung */}
        <div className="flex flex-wrap gap-3 items-center justify-between text-sm">
          <div className="flex flex-wrap gap-2">
            {Object.entries(FILTERS).map(([key, value]) => (
              <button
                key={key}
                onClick={() => {
                  setFilter(value);
                  setPage(1);
                }}
                className={`px-3 py-1 rounded-full border ${
                  filter === value
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-slate-600'
                }`}
              >
                {value === FILTERS.OPEN && 'Offen'}
                {value === FILTERS.DONE && 'Erledigt'}
                {value === FILTERS.TODAY && 'Heute'}
                {value === FILTERS.THIS_WEEK && 'Diese Woche'}
                {value === FILTERS.ALL && 'Alle'}
              </button>
            ))}
          </div>

          <div className="flex flex-col items-end gap-2">
            {/* Kategorie-Filter */}
            <div className="flex items-center gap-2">
              <span className="text-gray-600 dark:text-gray-300">
                Kategorie:
              </span>
              <select
                className="border rounded-lg px-2 py-1 bg-white dark:bg-slate-700 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-slate-600"
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setPage(1);
                }}
              >
                <option value="ALL">Alle</option>
                {allCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Sortierung */}
            <div className="flex items-center gap-2">
              <span className="text-gray-600 dark:text-gray-300">
                Sortieren nach:
              </span>
              <select
                className="border rounded-lg px-2 py-1 bg-white dark:bg-slate-700 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-slate-600"
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setPage(1);
                }}
              >
                <option value={SORTS.CREATED_DESC}>
                  Erstellt (neu → alt)
                </option>
                <option value={SORTS.CREATED_ASC}>
                  Erstellt (alt → neu)
                </option>
                <option value={SORTS.DUE_ASC}>
                  Deadline (früh → spät)
                </option>
                <option value={SORTS.DUE_DESC}>
                  Deadline (spät → früh)
                </option>
                <option value={SORTS.STATUS}>
                  Status (offen → erledigt)
                </option>
                <option value={SORTS.TEXT_ASC}>Text (A → Z)</option>
                <option value={SORTS.TEXT_DESC}>Text (Z → A)</option>
                <option value={SORTS.CATEGORY_ASC}>
                  Kategorie (A → Z)
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* Liste */}
        <div className="border rounded-xl p-3 border-slate-200 dark:border-slate-700">
          <TodoList
            todos={pagedTodos}
            onDelete={deleteTodo}
            onToggle={toggleTodo}
            onUpdate={updateTodo}
          />
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-300">
          <span>
            Seite {currentPage} von {totalPages} ({sorted.length} Einträge)
          </span>
          <div className="flex gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className={`px-3 py-1 rounded-lg border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-200 ${
                currentPage === 1
                  ? 'opacity-40 cursor-not-allowed'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              Zurück
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className={`px-3 py-1 rounded-lg border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-200 ${
                currentPage === totalPages
                  ? 'opacity-40 cursor-not-allowed'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              Weiter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
