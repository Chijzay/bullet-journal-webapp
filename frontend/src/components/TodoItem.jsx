import { useState } from 'react';

function formatDate(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString();
}

const getTodayString = () => new Date().toISOString().slice(0, 10);

// Farbklassen für Kategorien
const CATEGORY_COLORS = [
  'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/40 dark:text-blue-200 dark:border-blue-700',
  'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-200 dark:border-green-700',
  'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/40 dark:text-purple-200 dark:border-purple-700',
  'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/40 dark:text-amber-200 dark:border-amber-700',
  'bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-900/40 dark:text-pink-200 dark:border-pink-700',
  'bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900/40 dark:text-teal-200 dark:border-teal-700',
];

function getCategoryColorClass(category) {
  const base =
    'inline-flex items-center px-2 py-0.5 rounded-full border text-[0.7rem] font-medium';
  if (!category) {
    return (
      base +
      ' bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-700 dark:text-slate-100 dark:border-slate-500'
    );
  }
  const key = category.toLowerCase();
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash + key.charCodeAt(i)) % 1000;
  }
  const idx = hash % CATEGORY_COLORS.length;
  return base + ' ' + CATEGORY_COLORS[idx];
}

function TodoItem({ todo, onDelete, onToggle, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [editCategory, setEditCategory] = useState(todo.category || '');
  const [editDueDate, setEditDueDate] = useState(
    todo.dueDate ? todo.dueDate.slice(0, 10) : getTodayString()
  );

  const handleSave = async () => {
    if (!editText.trim()) return;

    const finalDueDate = editDueDate || getTodayString();

    await onUpdate(todo._id, {
      text: editText.trim(),
      category: editCategory,
      dueDate: finalDueDate,
    });

    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    }
    if (e.key === 'Escape') {
      setIsEditing(false);
      setEditText(todo.text);
      setEditCategory(todo.category || '');
      setEditDueDate(
        todo.dueDate ? todo.dueDate.slice(0, 10) : getTodayString()
      );
    }
  };

  const today = getTodayString();

  const containerBase =
    'flex flex-col gap-1 bg-slate-50 dark:bg-slate-700 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 transition-opacity';
  const containerDone = todo.done ? 'opacity-60' : '';

  return (
    <li className={`${containerBase} ${containerDone}`}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-1">
          <input
            type="checkbox"
            checked={todo.done}
            onChange={onToggle}
            className="w-4 h-4 accent-blue-500"
          />

          {isEditing ? (
            <input
              className="flex-1 border rounded px-2 py-1 text-sm bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-gray-900 dark:text-gray-100 outline-none focus:ring focus:ring-blue-400/60"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
          ) : (
            <span
              className={`${
                todo.done
                  ? 'line-through text-gray-400 dark:text-gray-500'
                  : 'text-gray-800 dark:text-gray-100'
              }`}
            >
              {todo.text}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="text-xs px-2 py-1 rounded bg-green-500 hover:bg-green-600 text-white"
              >
                Speichern
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="text-xs px-2 py-1 rounded bg-gray-300 hover:bg-gray-400 text-gray-800"
              >
                Abbrechen
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="text-xs px-2 py-1 rounded bg-yellow-400 hover:bg-yellow-500 text-gray-900"
              >
                Bearbeiten
              </button>
              <button
                onClick={onDelete}
                className="text-xs px-2 py-1 rounded bg-red-500 hover:bg-red-600 text-white"
              >
                Löschen
              </button>
            </>
          )}
        </div>
      </div>

      {/* zusätzliche Infos */}
      <div className="flex flex-wrap gap-3 text-xs text-gray-600 dark:text-gray-300 mt-1">
        <div>
          <span className="font-semibold">Status:</span>{' '}
          {todo.done ? 'Erledigt' : 'Offen'}
        </div>

        <div>
          <span className="font-semibold">Erstellt:</span>{' '}
          {formatDate(todo.createdAt)}
        </div>

        <div className="flex items-center gap-1">
          <span className="font-semibold">Deadline:</span>{' '}
          {isEditing ? (
            <input
              type="date"
              className="border rounded px-1 py-0.5 text-xs bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-gray-900 dark:text-gray-100 outline-none focus:ring focus:ring-blue-400/60"
              value={editDueDate}
              min={today}
              onChange={(e) => setEditDueDate(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          ) : (
            formatDate(todo.dueDate)
          )}
        </div>

        <div className="flex items-center gap-1">
          <span className="font-semibold">Kategorie:</span>{' '}
          {isEditing ? (
            <input
              className="border rounded px-1 py-0.5 text-xs bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-gray-900 dark:text-gray-100 outline-none focus:ring focus:ring-blue-400/60"
              value={editCategory}
              onChange={(e) => setEditCategory(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          ) : (
            <span className={getCategoryColorClass(todo.category)}>
              {(todo.category && todo.category.trim()) || '–'}
            </span>
          )}
        </div>
      </div>
    </li>
  );
}

export default TodoItem;
