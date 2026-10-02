import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchClasses } from "../services/classService";
import { fetchStudents } from "../services/studentService";

export default function Classes() {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetchClasses().then(setClasses);
    fetchStudents().then(setStudents);
  }, []);

  return (
    <div>
      <h3 className="mb-4 text-lg font-semibold text-slate-900">
        Classes &amp; Students
      </h3>
      <div className="space-y-4">
        {classes.map((c) => {
          const roster = students.filter((s) => s.classId === c.id);
          return (
            <section
              key={c.id}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <div className="font-medium text-slate-900">{c.name}</div>
                  <div className="text-sm text-slate-500">
                    {c.schedule} · {roster.length} student
                    {roster.length === 1 ? "" : "s"}
                  </div>
                </div>
                <Link
                  to={`/attendance?class=${c.id}`}
                  className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  Take attendance
                </Link>
              </div>
              {roster.length === 0 ? (
                <p className="pt-3 text-sm text-slate-500">
                  No students enrolled.
                </p>
              ) : (
                <ul>
                  {roster.map((s) => (
                    <li
                      key={s.id}
                      className="flex justify-between border-b border-slate-100 py-2 text-sm last:border-b-0"
                    >
                      <span className="text-slate-800">{s.name}</span>
                      <span className="text-slate-500">{s.id}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
