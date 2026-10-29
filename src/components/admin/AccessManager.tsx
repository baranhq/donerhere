import { useEffect, useState } from "react";
import { api } from "../../store/site";
import type { User } from "../../store/site";
import { ui } from "../../styles/ui";
type Access = {
  options: { key: string; label: string; description: string }[];
  templates: { id: number; name: string; permissions: string[] }[];
};
export default function AccessManager() {
  const [users, setUsers] = useState<User[]>([]);
  const [access, setAccess] = useState<Access | null>(null);
  const [selected, setSelected] = useState("");
  const [permissions, setPermissions] = useState<string[]>([]);
  const [templateName, setTemplateName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    let cancelled = false;
    Promise.all([api<User[]>("/admin/users"), api<Access>("/admin/access")])
      .then(([people, value]) => {
        if (cancelled) return;
        setUsers(
          people.filter((person) =>
            ["employee", "order_staff"].includes(person.role),
          ),
        );
        setAccess(value);
      })
      .catch((cause) => {
        if (!cancelled)
          setError(
            cause instanceof Error
              ? cause.message
              : "Could not load permissions",
          );
      });
    return () => {
      cancelled = true;
    };
  }, [revision]);
  async function save(reset = false) {
    if (!selected) return;
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const result = await api<{ permissions: string[] }>(
        `/admin/users/${selected}/permissions`,
        reset ? "DELETE" : "PUT",
        { permissions },
      );
      setPermissions(result.permissions);
      setUsers((current) =>
        current.map((person) =>
          String(person.id) === selected
            ? { ...person, permissions: result.permissions }
            : person,
        ),
      );
      setMessage("Permissions saved. This employee must sign in again.");
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Could not save permissions",
      );
    } finally {
      setBusy(false);
    }
  }
  async function saveTemplate() {
    setBusy(true);
    setError("");
    try {
      await api("/admin/access", "POST", { name: templateName, permissions });
      setTemplateName("");
      setRevision((value) => value + 1);
      setMessage(
        "Template saved. Applying a template copies its permissions; it does not change other users.",
      );
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Could not save template",
      );
    } finally {
      setBusy(false);
    }
  }
  function toggle(key: string, checked: boolean) {
    setPermissions((current) => {
      let next = checked
        ? [...current, key]
        : current.filter((value) => value !== key);
      if (key === "orders.write" && checked && !next.includes("orders.read"))
        next.push("orders.read");
      if (key === "orders.read" && !checked)
        next = next.filter((value) => value !== "orders.write");
      return next;
    });
  }
  return (
    <section className="max-w-3xl space-y-6">
      <p className="text-stone-600">
        Choose an employee, adjust their permissions, then save. Store admins
        always have full access; customer accounts have none.
      </p>
      {error && (
        <p role="alert" className="text-red-800">
          {error}
        </p>
      )}
      {message && <p role="status">{message}</p>}
      {!access ? (
        <p role="status">Loading permissions…</p>
      ) : (
        <>
          <label>
            Employee
            <select
              value={selected}
              disabled={busy}
              onChange={(event) => {
                setSelected(event.target.value);
                setPermissions(
                  users.find(
                    (person) => String(person.id) === event.target.value,
                  )?.permissions || [],
                );
                setMessage("");
              }}
            >
              <option value="">Choose an employee</option>
              {users.map((person) => (
                <option key={person.id} value={person.id}>
                  {person.name} · {person.email}
                </option>
              ))}
            </select>
          </label>
          {selected && (
            <>
              <label>
                Apply a saved template
                <select
                  defaultValue=""
                  disabled={busy}
                  onChange={(event) => {
                    const template = access.templates.find(
                      (entry) => String(entry.id) === event.target.value,
                    );
                    if (template) setPermissions([...template.permissions]);
                    event.target.value = "";
                  }}
                >
                  <option value="">Choose a template</option>
                  {access.templates.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </label>
              <fieldset className="space-y-4 rounded-xl border border-stone-200 p-5">
                <legend className="px-2 font-semibold">Allowed actions</legend>
                {access.options.map((option) => (
                  <label
                    key={option.key}
                    className="flex-row! items-start gap-3!"
                  >
                    <input
                      type="checkbox"
                      className="mt-1 w-auto!"
                      disabled={busy}
                      checked={permissions.includes(option.key)}
                      onChange={(event) =>
                        toggle(option.key, event.target.checked)
                      }
                    />
                    <span>
                      {option.label}
                      <small className="mt-1 block font-normal text-stone-500">
                        {option.description}
                      </small>
                    </span>
                  </label>
                ))}
              </fieldset>
              <div className="flex flex-wrap gap-4">
                <button
                  className={ui.button}
                  disabled={busy}
                  onClick={() => void save()}
                >
                  Save employee permissions
                </button>
                <button
                  className={ui.textLink}
                  disabled={busy}
                  onClick={() => void save(true)}
                >
                  Reset to role defaults
                </button>
              </div>
              <form
                className="rounded-xl border border-stone-200 p-5"
                onSubmit={(event) => {
                  event.preventDefault();
                  void saveTemplate();
                }}
              >
                <h2>Save these permissions as a template</h2>
                <p className="text-sm text-stone-500">
                  Reuse this selection for another employee. Existing
                  assignments are unaffected.
                </p>
                <label>
                  Template name
                  <input
                    value={templateName}
                    required
                    maxLength={80}
                    disabled={busy}
                    onChange={(event) => setTemplateName(event.target.value)}
                  />
                </label>
                <button className={ui.button} disabled={busy}>
                  Save template
                </button>
              </form>
            </>
          )}
          {!users.length && (
            <p>
              Create an employee account in Users to assign custom permissions.
            </p>
          )}
        </>
      )}
    </section>
  );
}
