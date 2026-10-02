import React, { useEffect, useMemo, useState } from "react";
import { STATUSES } from "../utils/attendanceStats";

export default function AttendanceTable({
  students = [],
  existing = [],
  onSave,
  saving = false,
  loading = false,
}) {
  const [rows, setRows] = useState([]);

  // Starting point for the sheet: saved status/notes when they exist,
  // otherwise everyone defaults to "present".
  const baseline = useMemo(() => {
    const byStudent = new Map(existing.map((r) => [r.studentId, r]));
    return students.map((s) => ({
      ...s,
      status: byStudent.get(s.id)?.status ?? "present",
      notes: byStudent.get(s.id)?.notes ?? "",
    }));
  }, [students, existing]);

  useEffect(() => {
    setRows(baseline);
  }, [baseline]);

  const setStatus = (id, status) => {
    setRows((r) => r.map((row) => (row.id === id ? { ...row, status } : row)));
  };

  const setNotes = (id, notes) => {
    setRows((r) => r.map((row) => (row.id === id ? { ...row, notes } : row)));
  };

  const hasSaved = existing.length > 0;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="mb-3 text-sm text-slate-500">
        {loading
          ? "Loading…"
          : hasSaved
          ? "Saved attendance loaded. Saving again will update it."
          : "No attendance saved for this class and date yet."}
      </p>

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
                    <div
                      className="h-9 w-9 rounded-full bg-slate-200"
                      aria-hidden="true"
                    />
                    <div>
                      <div className="font-medium text-slate-900">
                        {row.name}
                      </div>
                      <div className="text-sm text-slate-500">{row.id}</div>
                    </div>
                  </div>
                </td>
                <td className="p-2">
                  <div
                    className="flex flex-wrap gap-2"
                    role="group"
                    aria-label={`Status for ${row.name}`}
                  >
                    {STATUSES.map((s) => (
                      <button
                        key={s}
                        type="button"
                        aria-pressed={row.status === s}
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
                    aria-label={`Note for ${row.name}`}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    placeholder="Optional note"
                  />
                </td>
              </tr>
            ))}
            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={3} className="p-4 text-sm text-slate-500">
                  No students are enrolled in this class.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-wrap justify-end gap-2">
        <button
          type="button"
          onClick={() =>
            setRows((r) => r.map((row) => ({ ...row, status: "present" })))
          }
          className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Mark All Present
        </button>
        <button
          type="button"
          onClick={() => setRows(baseline)}
          className="rounded-lg bg-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-300"
        >
          Reset
        </button>
        <button
          type="button"
          onClick={() => onSave(rows)}
          disabled={saving || loading || rows.length === 0}
          className="rounded-lg bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save & Submit Attendance"}
        </button>
      </div>
    </div>
  );
}
