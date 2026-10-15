import { useEffect, useState } from "react";
import { X, UserPlus, Save } from "lucide-react";

const initialForm = {
  name: "",
  email: "",
  department: "Engineering",
  position: "",
  salary: "",
  status: "Active",
};

const departments = [
  "Engineering",
  "Design",
  "Marketing",
  "Human Resources",
  "Finance",
  "Sales",
  "Operations",
];

const fieldClass =
  "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50";

export default function EmployeeForm({
  employee,
  onSubmit,
  onClose,
  saving,
}) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (employee) {
      setForm({
        name: employee.name ?? "",
        email: employee.email ?? "",
        department: employee.department ?? "Engineering",
        position: employee.position ?? "",
        salary: String(employee.salary ?? ""),
        status: employee.status ?? "Active",
      });
    } else {
      setForm(initialForm);
    }

    setErrors({});
  }, [employee]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: "",
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = "Employee name is required.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!form.position.trim()) {
      nextErrors.position = "Position is required.";
    }

    if (
      form.salary.trim() === "" ||
      !Number.isFinite(Number(form.salary)) ||
      Number(form.salary) < 0
    ) {
      nextErrors.salary = "Enter a valid, non-negative salary.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    onSubmit({
      ...form,
      name: form.name.trim(),
      email: form.email.trim(),
      position: form.position.trim(),
      salary: Number(form.salary),
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !saving) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="employee-form-title"
        className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <div className="flex items-center gap-2 text-indigo-600">
              {employee ? <Save size={18} /> : <UserPlus size={18} />}
              <span className="text-xs font-bold uppercase tracking-wider">
                Employee details
              </span>
            </div>

            <h2
              id="employee-form-title"
              className="mt-1 text-xl font-bold text-slate-900"
            >
              {employee ? "Edit employee" : "Add new employee"}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Close form"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <div>
            <label htmlFor="name" className="text-sm font-medium text-slate-700">
              Full name *
            </label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Aarav Patel"
              className={fieldClass}
              aria-invalid={Boolean(errors.name)}
              required
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-600">{errors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="text-sm font-medium text-slate-700">
              Email address *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="name@company.com"
              className={fieldClass}
              aria-invalid={Boolean(errors.email)}
              required
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-600">{errors.email}</p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="department"
                className="text-sm font-medium text-slate-700"
              >
                Department
              </label>
              <select
                id="department"
                name="department"
                value={form.department}
                onChange={handleChange}
                className={fieldClass}
              >
                {departments.map((department) => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="position"
                className="text-sm font-medium text-slate-700"
              >
                Job title *
              </label>
              <input
                id="position"
                name="position"
                value={form.position}
                onChange={handleChange}
                placeholder="e.g. Developer"
                className={fieldClass}
                aria-invalid={Boolean(errors.position)}
                required
              />
              {errors.position && (
                <p className="mt-1 text-xs text-red-600">{errors.position}</p>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="salary"
                className="text-sm font-medium text-slate-700"
              >
                Monthly salary (₹) *
              </label>
              <input
                id="salary"
                name="salary"
                type="number"
                min="0"
                step="0.01"
                value={form.salary}
                onChange={handleChange}
                placeholder="50000"
                className={fieldClass}
                aria-invalid={Boolean(errors.salary)}
                required
              />
              {errors.salary && (
                <p className="mt-1 text-xs text-red-600">{errors.salary}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="status"
                className="text-sm font-medium text-slate-700"
              >
                Employment status
              </label>
              <select
                id="status"
                name="status"
                value={form.status}
                onChange={handleChange}
                className={fieldClass}
              >
                <option>Active</option>
                <option>On Leave</option>
                <option>Inactive</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save size={16} />
              {saving
                ? "Saving..."
                : employee
                  ? "Save changes"
                  : "Add employee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}