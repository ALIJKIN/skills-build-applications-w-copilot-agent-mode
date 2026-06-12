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

export default function Activities() {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim();
  const apiPath = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api/activities/`
    : "/api/activities/";
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
      <h2>Activities</h2>
      {loading && <p>Loading activities...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && items.length === 0 && <p>No activities found.</p>}
      {!loading && !error && items.length > 0 && (
        <div className="resource-table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Activity</th>
                <th>Distance (km)</th>
                <th>Duration (min)</th>
                <th>Calories</th>
                <th>Date</th>
                <th>User</th>
              </tr>
            </thead>
            <tbody>
              {items.map((activity, index) => (
                <tr key={String(activity._id ?? activity.id ?? index)}>
                  <td>{renderValue(activity.type)}</td>
                  <td>{renderValue(activity.distanceKm)}</td>
                  <td>{renderValue(activity.durationMin)}</td>
                  <td>{renderValue(activity.caloriesBurned)}</td>
                  <td>{renderValue(activity.date)}</td>
                  <td>{renderValue(activity.userId)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
