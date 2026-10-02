import React, { useEffect, useMemo, useState } from "react";
import { fetchClasses } from "../services/classService";
import { fetchAttendanceRange } from "../services/attendanceService";
import { summarizeByStudent } from "../utils/attendanceStats";
import { todayISO, daysAgoISO } from "../utils/dates";

const STATUS_STYLES = {
  present: "bg-green-100 text-green-800",
  absent: "bg-red-100 text-red-800",
  late: "bg-yellow-100 text-yellow-800",
  excused: "bg-blue-100 text-blue-800",
};

const inputClass =
  "rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

export default function Reports() {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [start, setStart] = useState(daysAgoISO(30));
  const [end, setEnd] = useState(todayISO());
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const classNames = useMemo(
    () => Object.fromEntries(classes.map((c) => [c.id, c.name])),
    [classes]
  );
  const summary = useMemo(() => summarizeByStudent(results), [results]);

  const runQuery = async () => {
    if (start > end) {
      setError("The start date must be on or before the end date.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      setResults(await fetchAttendanceRange(selectedClass, start, end));
    } catch {
      setError("Could not load the report.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses().then(setClasses);
    runQuery();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-1">
          <label htmlFor="report-class" className="text-xs font-medium text-slate-500">
            Class
          </label>
          <select
            id="report-class"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className={inputClass}
          >
            <option value="">All classes</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="report-start" className="text-xs font-medium text-slate-500">
            From
          </label>
          <input
            id="report-start"
            type="date"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="report-end" className="text-xs font-medium text-slate-500">
            To
          </label>
          <input
            id="report-end"
            type="date"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className={inputClass}
          />
        </div>
        <button
          type="button"
          onClick={runQuery}
          disabled={loading}
          className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? "Loading…" : "Filter"}
        </button>
      </div>

      {error && (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="mb-3 text-base font-semibold text-slate-900">
          Summary by student
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                <th className="p-2">Student</th>
                <th className="p-2">Present</th>
                <th className="p-2">Late</th>
                <th className="p-2">Absent</th>
                <th className="p-2">Excused</th>
                <th className="p-2">Rate</th>
              </tr>
            </thead>
            <tbody>
              {summary.map((s) => (
                <tr key={s.studentId} className="border-t border-slate-100 text-sm">
                  <td className="p-2 font-medium text-slate-900">{s.studentName}</td>
                  <td className="p-2">{s.present}</td>
                  <td className="p-2">{s.late}</td>
                  <td className="p-2">{s.absent}</td>
                  <td className="p-2">{s.excused}</td>
                  <td className="p-2">{s.rate == null ? "—" : `${s.rate}%`}</td>
                </tr>
              ))}
              {summary.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-4 text-sm text-slate-500">
                    No attendance records in this date range.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="mb-3 text-base font-semibold text-slate-900">Records</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                <th className="p-2">Date</th>
                <th className="p-2">Class</th>
                <th className="p-2">Student</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r) => (
                <tr key={r.id} className="border-t border-slate-100">
                  <td className="p-2">{r.date}</td>
                  <td className="p-2">{classNames[r.classId] ?? r.classId}</td>
                  <td className="p-2">{r.studentName}</td>
                  <td className="p-2">
                    <span
                      className={`rounded px-2 py-1 text-sm capitalize ${
                        STATUS_STYLES[r.status] ?? "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
