import { NavLink, Navigate, Route, Routes } from "react-router-dom";
import Activities from "./components/Activities";
import Leaderboard from "./components/Leaderboard";
import Teams from "./components/Teams";
import Users from "./components/Users";
import Workouts from "./components/Workouts";
import { apiHost, VITE_CODESPACE_NAME } from "./components/api";
import "./App.css";

const tabs = [
  { path: "activities", label: "Activities" },
  { path: "leaderboard", label: "Leaderboard" },
  { path: "teams", label: "Teams" },
  { path: "users", label: "Users" },
  { path: "workouts", label: "Workouts" },
];

function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <h1>OctoFit Tracker</h1>
          <p>React 19 frontend with Vite routing and API integration.</p>
        </div>

        <nav className="app-nav" aria-label="Primary navigation">
          {tabs.map((tab) => (
            <NavLink
              key={tab.path}
              to={`/${tab.path}`}
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            >
              {tab.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <section className="environment-banner">
        {VITE_CODESPACE_NAME ? (
          <p>
            Backend API host: <code>{apiHost}</code>
          </p>
        ) : (
          <p className="warning">
            <strong>Warning:</strong> <code>VITE_CODESPACE_NAME</code> is not defined. The frontend is using a safe local fallback at <code>{apiHost}</code>. Define <code>VITE_CODESPACE_NAME</code> in <code>.env.local</code> for Codespaces.
          </p>
        )}
      </section>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/users" element={<Users />} />
          <Route path="/workouts" element={<Workouts />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <footer className="app-footer">
        <p>Frontend uses <code>import.meta.env</code> to read <code>VITE_CODESPACE_NAME</code> and build API URLs.</p>
      </footer>
    </div>
  );
}

function Home() {
  return (
    <section className="home-page">
      <h2>Welcome to OctoFit Tracker</h2>
      <p>
        Use the tabs above to inspect activities, leaderboard, teams, users, and workouts. The frontend resolves API endpoints from <code>import.meta.env.VITE_CODESPACE_NAME</code>.
      </p>
      <p>
        If you are running in GitHub Codespaces, set <code>VITE_CODESPACE_NAME</code> in <code>.env.local</code>. Otherwise the app falls back to <code>http://localhost:8000/api</code>.
      </p>
    </section>
  );
}

export default App;
