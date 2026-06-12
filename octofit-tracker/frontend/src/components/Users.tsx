import { useEffect, useState } from "react";
import { fetchResource, ResourceItem } from "./api";

function renderValue(value: unknown) {
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

export default function Users() {
  const apiPath = "/api/users/";
  const [items, setItems] = useState<ResourceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      <h2>Users</h2>
      <p>Registered users with role and team membership details.</p>

      {loading && <p>Loading users...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && items.length === 0 && <p>No users found.</p>}

      {!loading && !error && items.length > 0 && (
        <div className="resource-table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Team</th>
              </tr>
            </thead>
            <tbody>
              {items.map((user, index) => (
                <tr key={String(user._id ?? user.id ?? index)}>
                  <td>{renderValue(user.name)}</td>
                  <td>{renderValue(user.email)}</td>
                  <td>{renderValue(user.role)}</td>
                  <td>{renderValue((user as { teamId?: unknown }).teamId)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
