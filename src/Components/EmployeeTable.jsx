import { useMemo, useState } from "react";
import {
  Search,
  Pencil,
  Trash2,
  Users,
  Mail,
  BriefcaseBusiness,
  ChevronDown,
} from "lucide-react";

function getInitials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

function EmployeeRow({ employee, onEdit, onDelete }) {
  const statusStyles = {
    Active: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    "On Leave": "bg-amber-50 text-amber-700 ring-amber-600/20",
    Inactive: "bg-slate-100 text-slate-600 ring-slate-500/20",
  };

  return (
    <tr className="transition hover:bg-slate-50/80">
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-sm font-bold text-indigo-700">
            {getInitials(employee.name)}
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold text-slate-900">
              {employee.name}
            </p>
            <p className="mt-1 flex items-center gap-1 truncate text-xs text-slate-500">
              <Mail size={12} />
              {employee.email}
            </p>
          </div>
        </div>
      </td>

      <td className="px-5 py-4">
        <p className="font-medium text-slate-700">{employee.position}</p>
        <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
          <BriefcaseBusiness size={12} />
          {employee.department}
        </p>
      </td>

      <td className="whitespace-nowrap px-5 py-4 font-medium text-slate-700">
        {new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
          maximumFractionDigits: 0,
        }).format(Number(employee.salary))}
      </td>

      <td className="px-5 py-4">
        <span
          className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${
            statusStyles[employee.status] ?? statusStyles.Inactive
          }`}
        >
          {employee.status}
        </span>
      </td>

      <td className="px-5 py-4">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(employee)}
            aria-label={`Edit ${employee.name}`}
            className="rounded-lg p-2 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600"
          >
            <Pencil size={16} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(employee)}
            aria-label={`Delete ${employee.name}`}
            className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function EmployeeTable({
  employees,
  onEdit,
  onDelete,
}) {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");

  const departments = useMemo(
    () => [...new Set(employees.map((employee) => employee.department))].sort(),
    [employees]
  );

  const filteredEmployees = useMemo(() => {
    const query = search.trim().toLowerCase();

    return employees.filter((employee) => {
      const matchesSearch = [
        employee.name,
        employee.email,
        employee.department,
        employee.position,
      ].some((value) => value.toLowerCase().includes(query));

      const matchesDepartment =
        department === "All" || employee.department === department;

      return matchesSearch && matchesDepartment;
    });
  }, [employees, search, department]);

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            All employees
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {filteredEmployees.length} of {employees.length} employees
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search employees..."
              aria-label="Search employees"
              className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 sm:w-56"
            />
          </div>

          <div className="relative">
            <select
              value={department}
              onChange={(event) => setDepartment(event.target.value)}
              aria-label="Filter by department"
              className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-3 pr-9 text-sm outline-none focus:border-indigo-500 sm:w-48"
            >
              <option value="All">All departments</option>
              {departments.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <ChevronDown
              size={15}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
          </div>
        </div>
      </div>

      {filteredEmployees.length === 0 ? (
        <div className="flex flex-col items-center px-6 py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
            <Users size={25} />
          </div>
          <h3 className="mt-4 font-semibold text-slate-900">
            No employees found
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Try another search or change the department filter.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-3.5 font-semibold">Employee</th>
                <th className="px-5 py-3.5 font-semibold">Role</th>
                <th className="px-5 py-3.5 font-semibold">Monthly salary</th>
                <th className="px-5 py-3.5 font-semibold">Status</th>
                <th className="px-5 py-3.5 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEmployees.map((employee) => (
                <EmployeeRow
                  key={employee.id}
                  employee={employee}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}