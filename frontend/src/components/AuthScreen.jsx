import { useState } from 'react';
import axios from 'axios';

const API_BASE =
  import.meta.env.VITE_AUTH_API_URL || 'http://localhost:5000/api/auth';

function AuthScreen({ onAuthSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' oder 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isLogin = mode === 'login';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const res = await axios.post(`${API_BASE}/login`, {
          email,
          password,
        });
        onAuthSuccess(res.data);
      } else {
        const res = await axios.post(`${API_BASE}/register`, {
          email,
          password,
          username,
        });
        onAuthSuccess(res.data);
      }
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Etwas ist schiefgelaufen. Bitte erneut versuchen.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6 space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            ToDo und Journal
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {isLogin
              ? 'Melde dich an, um deine ToDos und dein Journal zu verwalten.'
              : 'Erstelle einen Account, um deine ToDos und dein Journal zu speichern.'}
          </p>
        </div>

        <div className="flex rounded-xl bg-slate-100 dark:bg-slate-700 p-1 text-sm">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 py-2 rounded-lg transition ${
              isLogin
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`flex-1 py-2 rounded-lg transition ${
              !isLogin
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Registrieren
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Benutzername
              </label>
              <input
                type="text"
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500/70"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required={!isLogin}
                placeholder="z. B. MaxMustermann"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
              E-Mail
            </label>
            <input
              type="email"
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500/70"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="name@example.com"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
              Passwort
            </label>
            <input
              type="password"
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500/70"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="Mindestens 6 Zeichen"
            />
          </div>

          {error && (
            <div className="text-xs text-red-500 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 inline-flex items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2.5 shadow-sm"
          >
            {loading
              ? 'Bitte warten...'
              : isLogin
              ? 'Anmelden'
              : 'Account erstellen'}
          </button>
        </form>

        <p className="text-[11px] text-center text-slate-500 dark:text-slate-400">
          Hinweis: Der Dark Mode richtet sich nach der letzten Auswahl im
          eingeloggten Zustand und wird im Browser gespeichert.
        </p>
      </div>
    </div>
  );
}

export default AuthScreen;
