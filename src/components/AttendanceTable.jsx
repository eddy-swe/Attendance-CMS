import React, { useEffect, useState } from "react";

const STATUSES = ["present", "absent", "late", "excused"];

export default function AttendanceTable({ students = [], onSave }) {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    // initialize rows from students
    setRows(students.map((s) => ({ ...s, status: "present", notes: "" })));
  }, [students]);

  const setStatus = (id, status) => {
    setRows((r) => r.map((row) => (row.id === id ? { ...row, status } : row)));
  };

  const setNotes = (id, notes) => {
    setRows((r) => r.map((row) => (row.id === id ? { ...row, notes } : row)));
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
              <th className="p-2">Student</th>
              <th className="p-2">Status</th>
              <th className="p-2">Notes</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-slate-100 align-top">
                <td className="p-2">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-slate-200" />
                    <div>
                      <div className="font-medium text-slate-900">
                        {row.name}
                      </div>
                      <div className="text-sm text-slate-500">{row.id}</div>
                    </div>
                  </div>
                </td>
                <td className="p-2">
                  <div className="flex flex-wrap gap-2">
                    {STATUSES.map((s) => (
                      <button
                        key={s}
                        onClick={() => setStatus(row.id, s)}
                        className={`rounded-full border px-2.5 py-1 text-sm capitalize transition-colors ${
                          row.status === s
                            ? "border-indigo-600 bg-indigo-600 text-white"
                            : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </td>
                <td className="p-2">
                  <input
                    value={row.notes}
                    onChange={(e) => setNotes(row.id, e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    placeholder="Optional note"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-wrap justify-end gap-2">
        <button
          onClick={() =>
            setRows((r) => r.map((row) => ({ ...row, status: "present" })))
          }
          className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Mark All Present
        </button>
        <button
          onClick={() =>
            setRows((r) =>
              r.map((row) => ({ ...row, status: "present", notes: "" }))
            )
          }
          className="rounded-lg bg-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-300"
        >
          Reset
        </button>
        <button
          onClick={() => onSave(rows)}
          className="rounded-lg bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700"
        >
          Save & Submit Attendance
        </button>
      </div>
    </div>
  );
}
