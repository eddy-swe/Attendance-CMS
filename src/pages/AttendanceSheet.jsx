import React, { useEffect, useState } from "react";
import { fetchClasses } from "../services/classService";
import { fetchStudents } from "../services/studentService";
import { saveAttendanceRecords } from "../services/attendanceService";
import AttendanceTable from "../components/AttendanceTable";

export default function AttendanceSheet() {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetchClasses().then((c) => {
      setClasses(c);
      setSelectedClass(c[0]?.id);
    });
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchStudents(selectedClass).then(setStudents);
    }
  }, [selectedClass]);

  const handleSave = async (updatedRows) => {
    // transform rows into attendance records
    const records = updatedRows.map((r) => ({
      id: `r_${Date.now()}_${r.id}`,
      studentId: r.id,
      studentName: r.name,
      classId: selectedClass,
      date,
      status: r.status,
      notes: r.notes || "",
      createdAt: new Date().toISOString(),
    }));
    await saveAttendanceRecords(records);
    alert("Saved attendance (local mock)");
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <label className="text-sm font-medium text-slate-600">Class</label>
          <select
            value={selectedClass || ""}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          >
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <label className="text-sm font-medium text-slate-600">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>
      </div>

      <AttendanceTable students={students} onSave={handleSave} />
    </div>
  );
}
