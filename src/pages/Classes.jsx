import React, { useEffect, useState } from "react";
import { fetchClasses } from "../services/classService";

export default function Classes() {
  const [classes, setClasses] = useState([]);
  useEffect(() => {
    fetchClasses().then(setClasses);
  }, []);
  return (
    <div>
      <h3 className="mb-4 text-lg font-semibold text-slate-900">Classes</h3>
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <ul>
          {classes.map((c) => (
            <li
              key={c.id}
              className="flex justify-between border-b border-slate-100 py-3"
            >
              <div>
                <div className="font-medium text-slate-900">{c.name}</div>
                <div className="text-sm text-slate-500">{c.schedule}</div>
              </div>
              <div className="text-sm text-slate-500">{c.id}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
