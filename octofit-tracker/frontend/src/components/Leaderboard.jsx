import { useEffect, useState } from "react";
import { fetchResource } from "./api.ts";

function renderValue(value) {
  if (value === null || value === undefined) {
    return "—";
  }

  if (Array.isArray(value)) {
    return value.join(", ");
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
}

export default function Leaderboard() {
  const apiPath = "/api/leaderboard/";
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchResource(apiPath);
        if (active) {
          setItems(data);
        }
      } catch (caught) {
        if (active) {
          setError(caught instanceof Error ? caught.message : String(caught));
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="resource-view">
      <h2>Leaderboard</h2>
      {loading && <p>Loading leaderboard...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && items.length === 0 && <p>No leaderboard entries available.</p>}
      {!loading && !error && items.length > 0 && (
        <div className="resource-table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Team</th>
                <th>Rank</th>
                <th>Points</th>
                <th>Season</th>
              </tr>
            </thead>
            <tbody>
              {items.map((entry, index) => (
                <tr key={String(entry._id ?? entry.id ?? index)}>
                  <td>{renderValue(entry.teamId)}</td>
                  <td>{renderValue(entry.rank)}</td>
                  <td>{renderValue(entry.points)}</td>
                  <td>{renderValue(entry.season)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
