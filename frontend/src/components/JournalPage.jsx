import { useEffect, useState } from 'react';
import axios from 'axios';

const JOURNAL_API_URL =
  import.meta.env.VITE_JOURNAL_API_URL || 'http://localhost:5000/api/journal';

const getTodayString = () => new Date().toISOString().slice(0, 10);

const MOODS = [
  { value: 1, label: '😢', text: 'Schlecht' },
  { value: 2, label: '😕', text: 'Eher schlecht' },
  { value: 3, label: '🙂', text: 'Neutral' },
  { value: 4, label: '😊', text: 'Gut' },
  { value: 5, label: '😄', text: 'Sehr gut' },
];

const MAX_WATER = 8;
const MAX_GRATITUDE = 3;
const MAX_TASKS = 4;

function createEmptyEntry(date) {
  return {
    date,
    gratitude: ['', '', ''],
    bestTasks: ['', '', '', ''],
    mood: 3,
    water: 0,
    notes: '',
  };
}

function JournalPage() {
  const [selectedDate, setSelectedDate] = useState(getTodayString());
  const [entry, setEntry] = useState(createEmptyEntry(getTodayString()));
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const loadEntry = async (date) => {
    setLoading(true);
    setSaveMessage('');
    try {
      const res = await axios.get(`${JOURNAL_API_URL}/${date}`);
      if (res.data) {
        const data = res.data;
        setEntry({
          date: data.date,
          gratitude: [
            ...(data.gratitude || []),
            ...Array(MAX_GRATITUDE).fill(''),
          ].slice(0, MAX_GRATITUDE),
          bestTasks: [
            ...(data.bestTasks || []),
            ...Array(MAX_TASKS).fill(''),
          ].slice(0, MAX_TASKS),
          mood: data.mood || 3,
          water: data.water || 0,
          notes: data.notes || '',
        });
      } else {
        setEntry(createEmptyEntry(date));
      }
    } catch (err) {
      console.error(err);
      setEntry(createEmptyEntry(date));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEntry(selectedDate);
  }, [selectedDate]);

  const handleGratitudeChange = (index, value) => {
    setEntry((prev) => {
      const next = [...prev.gratitude];
      next[index] = value;
      return { ...prev, gratitude: next };
    });
  };

  const handleTaskChange = (index, value) => {
    setEntry((prev) => {
      const next = [...prev.bestTasks];
      next[index] = value;
      return { ...prev, bestTasks: next };
    });
  };

  const handleMoodChange = (value) => {
    setEntry((prev) => ({ ...prev, mood: value }));
  };

  const handleWaterClick = (value) => {
    setEntry((prev) => ({ ...prev, water: value }));
  };

  const handleNotesChange = (value) => {
    setEntry((prev) => ({ ...prev, notes: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveMessage('');
    try {
      const payload = {
        date: entry.date,
        gratitude: entry.gratitude.filter((g) => g.trim().length > 0),
        bestTasks: entry.bestTasks.filter((t) => t.trim().length > 0),
        mood: entry.mood,
        water: entry.water,
        notes: entry.notes,
      };

      await axios.post(JOURNAL_API_URL, payload);
      setSaveMessage('Journal-Eintrag gespeichert.');
    } catch (err) {
      console.error(err);
      setSaveMessage('Fehler beim Speichern. Bitte erneut versuchen.');
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMessage(''), 4000);
    }
  };

  const today = getTodayString();

  return (
    <div className="space-y-5">
      {/* Datum + Status */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-600 dark:text-slate-300">
            Datum:
          </span>
          <input
            type="date"
            className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-1.5 text-sm text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500/70"
            value={selectedDate}
            max={today}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400">
          {loading
            ? 'Lade Eintrag...'
            : `Journal für ${new Date(selectedDate).toLocaleDateString()}`}
        </div>
      </div>

      {/* Stimmung */}
      <section className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-4 space-y-3">
        <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
          Stimmung des Tages
        </h2>
        <div className="flex flex-wrap gap-3 items-center">
          {MOODS.map((m) => (
            <button
              key={m.value}
              type="button"
              onClick={() => handleMoodChange(m.value)}
              className={`flex flex-col items-center justify-center w-12 h-12 rounded-full border text-lg ${
                entry.mood === m.value
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-600'
              }`}
            >
              <span>{m.label}</span>
            </button>
          ))}
          <span className="text-xs text-slate-500 dark:text-slate-300">
            Wie hast du dich insgesamt gefühlt?
          </span>
        </div>
      </section>

      {/* Wasser-Tracker */}
      <section className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-4 space-y-3">
        <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
          Wasser-Tracker
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-300">
          Tipp: 6–8 Gläser Wasser pro Tag sind ein guter Richtwert.
        </p>
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: MAX_WATER }).map((_, index) => {
            const count = index + 1;
            const active = entry.water >= count;
            return (
              <button
                key={count}
                type="button"
                onClick={() => handleWaterClick(active ? count - 1 : count)}
                className={`w-8 h-8 rounded-md border text-lg flex items-center justify-center ${
                  active
                    ? 'bg-cyan-500 text-white border-cyan-500'
                    : 'bg-white dark:bg-slate-900 text-cyan-500 border-cyan-400 dark:border-cyan-600'
                }`}
              >
                💧
              </button>
            );
          })}
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-300">
          Aktuell: {entry.water} von {MAX_WATER} Gläsern
        </div>
      </section>

      {/* Dankbarkeit */}
      <section className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-4 space-y-3">
        <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
          Dinge, die dich heute glücklich gemacht haben
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-300">
          Schreibe bis zu drei Momente auf, für die du dankbar bist.
        </p>
        <div className="space-y-2">
          {entry.gratitude.map((value, index) => (
            <input
              key={index}
              type="text"
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500/70"
              placeholder={`Glücksmoment #${index + 1}`}
              value={value}
              onChange={(e) => handleGratitudeChange(index, e.target.value)}
            />
          ))}
        </div>
      </section>

      {/* Top-4 Aufgaben */}
      <section className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-4 space-y-3">
        <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
          Die 4 wichtigsten Aufgaben des Tages
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-300">
          Konzentriere dich auf maximal vier wirklich wichtige Aufgaben.
        </p>
        <div className="space-y-2">
          {entry.bestTasks.map((value, index) => (
            <div key={index} className="flex gap-2 items-center">
              <span className="w-5 text-xs text-slate-500 dark:text-slate-300">
                {index + 1}.
              </span>
              <input
                type="text"
                className="flex-1 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500/70"
                placeholder={`Aufgabe #${index + 1}`}
                value={value}
                onChange={(e) => handleTaskChange(index, e.target.value)}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Freitext-Notizen */}
      <section className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-4 space-y-3">
        <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
          Notizen zu deinem Tag
        </h2>
        <textarea
          className="w-full min-h-[120px] rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500/70 resize-y"
          placeholder="Was ist heute passiert? Was möchtest du festhalten?"
          value={entry.notes}
          onChange={(e) => handleNotesChange(e.target.value)}
        />
      </section>

      {/* Speichern */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2 shadow-sm"
        >
          {saving ? 'Speichere...' : 'Journal speichern'}
        </button>
        {saveMessage && (
          <span className="text-xs text-slate-500 dark:text-slate-300">
            {saveMessage}
          </span>
        )}
      </div>
    </div>
  );
}

export default JournalPage;
