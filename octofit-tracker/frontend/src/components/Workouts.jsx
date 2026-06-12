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

export default function Workouts() {
  const apiPath = "/api/workouts/";
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
      <h2>Workouts</h2>
      {loading && <p>Loading workouts...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && items.length === 0 && <p>No workouts found.</p>}
      {!loading && !error && items.length > 0 && (
        <div className="resource-table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Duration (min)</th>
                <th>Difficulty</th>
                <th>Focus</th>
                <th>Equipment</th>
              </tr>
            </thead>
            <tbody>
              {items.map((workout, index) => (
                <tr key={String(workout._id ?? workout.id ?? index)}>
                  <td>{renderValue(workout.name)}</td>
                  <td>{renderValue(workout.durationMin)}</td>
                  <td>{renderValue(workout.difficulty)}</td>
                  <td>{renderValue(workout.focus)}</td>
                  <td>{renderValue(workout.equipment)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
