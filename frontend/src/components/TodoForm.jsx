import { useState } from 'react';

const PRESET_CATEGORIES = ['Arbeit', 'Privat', 'Haushalt', 'Gesundheit', 'Studium'];

const getTodayString = () => new Date().toISOString().slice(0, 10);

function TodoForm({ onAdd }) {
  const [text, setText] = useState('');
  const [dueDate, setDueDate] = useState(getTodayString());
  const [categoryPreset, setCategoryPreset] = useState('Vorauswahl');
  const [categoryCustom, setCategoryCustom] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;

    const finalCategory =
      categoryCustom.trim() ||
      (categoryPreset !== 'Vorauswahl' ? categoryPreset : '');

    const finalDueDate = dueDate || getTodayString();

    onAdd({
      text: trimmed,
      dueDate: finalDueDate,
      category: finalCategory,
    });

    setText('');
    setCategoryCustom('');
    setCategoryPreset('Vorauswahl');
    setDueDate(getTodayString());
  };

  const today = getTodayString();

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3"
    >
      {/* Eingabe + Button */}
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          className="flex-1 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500/70"
          placeholder="Neues ToDo..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-sm w-full sm:w-auto"
        >
          Add
        </button>
      </div>

      {/* Deadline + Kategorie-Auswahl */}
      <div className="grid gap-2 sm:grid-cols-3">
        {/* Deadline */}
        <div className="flex flex-col text-xs text-slate-700 dark:text-slate-200">
          <span className="mb-1 font-medium">Deadline:</span>
          <input
            type="date"
            className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500/70"
            value={dueDate}
            min={today}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        {/* Kategorie-Vorauswahl */}
        <div className="flex flex-col text-xs text-slate-700 dark:text-slate-200">
          <span className="mb-1 font-medium">Kategorie:</span>
          <select
            className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500/70"
            value={categoryPreset}
            onChange={(e) => setCategoryPreset(e.target.value)}
          >
            <option value="Vorauswahl">Vorauswahl</option>
            {PRESET_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Eigene Kategorie */}
        <div className="flex flex-col text-xs text-slate-700 dark:text-slate-200">
          <span className="mb-1 font-medium">oder eigene Kategorie:</span>
          <input
            className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500/70"
            placeholder="z. B. Lifelab"
            value={categoryCustom}
            onChange={(e) => setCategoryCustom(e.target.value)}
          />
        </div>
      </div>
    </form>
  );
}

export default TodoForm;
