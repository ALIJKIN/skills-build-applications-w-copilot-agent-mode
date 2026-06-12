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

export default function Teams() {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim();
  const apiPath = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api/teams/`
    : "/api/teams/";
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
      <h2>Teams</h2>
      {loading && <p>Loading teams...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && items.length === 0 && <p>No teams found.</p>}
      {!loading && !error && items.length > 0 && (
        <div className="resource-table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Members</th>
                <th>Coach</th>
              </tr>
            </thead>
            <tbody>
              {items.map((team, index) => (
                <tr key={String(team._id ?? team.id ?? index)}>
                  <td>{renderValue(team.name)}</td>
                  <td>{renderValue(team.description)}</td>
                  <td>{renderValue(team.members)}</td>
                  <td>{renderValue(team.coach)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
