import React, { useEffect, useState } from "react";
import { fetchClasses } from "../services/classService";
import { fetchAttendanceByClassDate } from "../services/attendanceService";

export default function Reports() {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [start, setStart] = useState("2026-01-01");
  const [end, setEnd] = useState(new Date().toISOString().slice(0, 10));
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetchClasses().then(setClasses);
  }, []);

  const runQuery = async () => {
    if (!selectedClass) return alert("Select a class");
    // naive per-day fetch: for demo just fetch for end date
    const r = await fetchAttendanceByClassDate(selectedClass, end);
    setResults(r);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        >
          <option value="">Select class</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />
        <input
          type="date"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />
        <button
          onClick={runQuery}
          className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Filter
        </button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
              <th className="p-2">Date</th>
              <th className="p-2">Student</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r) => (
              <tr key={r.id} className="border-t border-slate-100">
                <td className="p-2">{r.date}</td>
                <td className="p-2">{r.studentName}</td>
                <td className="p-2">
                  <span
                    className={`rounded px-2 py-1 text-sm capitalize ${
                      r.status === "present"
                        ? "bg-green-100 text-green-800"
                        : r.status === "absent"
                        ? "bg-red-100 text-red-800"
                        : r.status === "late"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-blue-100 text-blue-800"
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
  );
}
