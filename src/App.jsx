import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Users,
  UserCheck,
  UserRoundPlus,
  IndianRupee,
  Plus,
  Building2,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  X,
} from "lucide-react";

import EmployeeForm from "./Components/EmployeeForm.jsx";
import EmployeeTable from "./Components/EmployeeTable.jsx";
import StatCard from "./Components/StatCard.jsx";

function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return undefined;

    const timer = setTimeout(onClose, 3500);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  return (
    <div
      role="status"
      className={`fixed bottom-5 right-5 z-[60] flex max-w-sm items-start gap-3 rounded-xl border bg-white p-4 shadow-xl ${
        toast.type === "error" ? "border-red-200" : "border-emerald-200"
      }`}
    >
      {toast.type === "error" ? (
        <AlertCircle className="mt-0.5 shrink-0 text-red-600" size={20} />
      ) : (
        <CheckCircle2
          className="mt-0.5 shrink-0 text-emerald-600"
          size={20}
        />
      )}

      <p className="flex-1 text-sm font-medium text-slate-700">
        {toast.message}
      </p>

      <button
        type="button"
        onClick={onClose}
        aria-label="Dismiss notification"
        className="text-slate-400 hover:text-slate-700"
      >
        <X size={17} />
      </button>
    </div>
  );
}

export default function App() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [toast, setToast] = useState(null);

  const notify = useCallback((message, type = "success") => {
    setToast({ message, type });
  }, []);

  const loadEmployees = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await employeeApi.getAll();

      if (!Array.isArray(data)) {
        throw new Error("The API returned an invalid employee list.");
      }

      setEmployees(data);
    } catch (err) {
      setError(
        err.message.includes("Failed to fetch")
          ? "Unable to connect to the API. Start the JSON Server on port 3001."
          : err.message
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  const stats = useMemo(() => {
    const active = employees.filter(
      (employee) => employee.status === "Active"
    ).length;

    const departments = new Set(
      employees.map((employee) => employee.department)
    ).size;

    const payroll = employees.reduce(
      (total, employee) => total + (Number(employee.salary) || 0),
      0
    );

    return {
      total: employees.length,
      active,
      departments,
      payroll,
    };
  }, [employees]);

  function openCreateForm() {
    setEditingEmployee(null);
    setFormOpen(true);
  }

  function openEditForm(employee) {
    setEditingEmployee(employee);
    setFormOpen(true);
  }

  function closeForm() {
    if (saving) return;
    setFormOpen(false);
    setEditingEmployee(null);
  }

  async function handleSave(formData) {
    setSaving(true);

    try {
      if (editingEmployee) {
        const updated = await employeeApi.update(
          editingEmployee.id,
          formData
        );

        setEmployees((current) =>
          current.map((employee) =>
            employee.id === editingEmployee.id
              ? { ...employee, ...updated }
              : employee
          )
        );

        notify("Employee updated successfully.");
      } else {
        const created = await employeeApi.create(formData);

        setEmployees((current) => [...current, created]);
        notify("Employee added successfully.");
      }

      setFormOpen(false);
      setEditingEmployee(null);
    } catch (err) {
      notify(`Unable to save employee: ${err.message}`, "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(employee) {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${employee.name}?`
    );

    if (!confirmed) return;

    try {
      await employeeApi.remove(employee.id);

      setEmployees((current) =>
        current.filter((item) => item.id !== employee.id)
      );

      notify("Employee deleted successfully.");
    } catch (err) {
      notify(`Unable to delete employee: ${err.message}`, "error");
    }
  }

  const formattedPayroll = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(stats.payroll);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Sidebar and header */}
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col border-r border-slate-200 bg-white lg:flex">
        <div className="flex h-20 items-center gap-3 border-b border-slate-100 px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
            <Building2 size={22} />
          </div>
          <div>
            <p className="font-bold tracking-tight">PeopleHub</p>
            <p className="text-xs text-slate-500">Employee management</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2 p-4">
          <div className="flex items-center gap-3 rounded-xl bg-indigo-50 px-4 py-3 font-semibold text-indigo-700">
            <Users size={19} />
            Employees
          </div>
          <div className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-500">
            <UserCheck size={19} />
            Directory
          </div>
        </nav>

        <div className="m-4 rounded-xl bg-slate-50 p-4">
          <p className="text-sm font-semibold">Employee workspace</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            Manage your team, employee records, and payroll overview.
          </p>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-10 flex h-20 items-center justify-between border-b border-slate-200 bg-white/90 px-5 backdrop-blur sm:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">
              Workspace / People
            </p>
            <h1 className="mt-1 text-lg font-bold sm:text-xl">
              Employee management
            </h1>
          </div>

          <button
            type="button"
            onClick={openCreateForm}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Add employee</span>
            <span className="sm:hidden">Add</span>
          </button>
        </header>

        <main className="mx-auto max-w-[1500px] space-y-7 p-5 sm:p-8">
          <section>
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  Team overview
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Manage employee information from one place.
                </p>
              </div>

              <button
                type="button"
                onClick={loadEmployees}
                disabled={loading}
                className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
              >
                <RefreshCw
                  size={16}
                  className={loading ? "animate-spin" : ""}
                />
                Refresh data
              </button>
            </div>
          </section>

          {/* Conditional rendering for API errors */}
          {error && (
            <div
              role="alert"
              className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-start gap-3">
                <AlertCircle
                  className="mt-0.5 shrink-0 text-red-600"
                  size={20}
                />
                <div>
                  <p className="font-semibold text-red-800">
                    Could not load employees
                  </p>
                  <p className="mt-1 text-sm text-red-700">{error}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={loadEmployees}
                className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700"
              >
                Try again
              </button>
            </div>
          )}

          {/* Statistics cards */}
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Total employees"
              value={loading ? "—" : stats.total}
              subtitle="All employee records"
              icon={Users}
              iconBg="bg-indigo-50"
              iconColor="text-indigo-600"
            />

            <StatCard
              title="Active employees"
              value={loading ? "—" : stats.active}
              subtitle="Currently active"
              icon={UserCheck}
              iconBg="bg-emerald-50"
              iconColor="text-emerald-600"
            />

            <StatCard
              title="Departments"
              value={loading ? "—" : stats.departments}
              subtitle="Across the organization"
              icon={UserRoundPlus}
              iconBg="bg-amber-50"
              iconColor="text-amber-600"
            />

            <StatCard
              title="Monthly payroll"
              value={loading ? "—" : formattedPayroll}
              subtitle="Combined employee salaries"
              icon={IndianRupee}
              iconBg="bg-sky-50"
              iconColor="text-sky-600"
            />
          </section>

          {/* Conditional rendering for loading, error and data */}
          {loading ? (
            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
              <RefreshCw
                className="mx-auto animate-spin text-indigo-600"
                size={30}
              />
              <p className="mt-4 font-semibold">Loading employees...</p>
              <p className="mt-1 text-sm text-slate-500">
                Fetching records from the API.
              </p>
            </div>
          ) : !error ? (
            <EmployeeTable
              employees={employees}
              onEdit={openEditForm}
              onDelete={handleDelete}
            />
          ) : null}

          <footer className="pb-2 text-center text-xs text-slate-400">
            PeopleHub · Employee Management System · React + Tailwind CSS
          </footer>
        </main>
      </div>

      {/* Conditional rendering of create/edit modal */}
      {formOpen && (
        <EmployeeForm
          employee={editingEmployee}
          onSubmit={handleSave}
          onClose={closeForm}
          saving={saving}
        />
      )}

      <Toast
        toast={toast}
        onClose={() => setToast(null)}
      />
    </div>
  );
}