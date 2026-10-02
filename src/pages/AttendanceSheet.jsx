import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchClasses } from "../services/classService";
import { fetchStudents } from "../services/studentService";
import {
  fetchAttendanceByClassDate,
  saveAttendanceRecords,
} from "../services/attendanceService";
import AttendanceTable from "../components/AttendanceTable";
import { todayISO } from "../utils/dates";

export default function AttendanceSheet() {
  const [searchParams] = useSearchParams();
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [date, setDate] = useState(todayISO());
  const [students, setStudents] = useState([]);
  const [existing, setExisting] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    fetchClasses().then((c) => {
      setClasses(c);
      const requested = searchParams.get("class");
      setSelectedClass(
        c.some((x) => x.id === requested) ? requested : c[0]?.id ?? ""
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load the roster and any attendance already saved for this class + date.
  useEffect(() => {
    if (!selectedClass) return;
    let cancelled = false;
    setLoading(true);
    setNotice(null);
    Promise.all([
      fetchStudents(selectedClass),
      fetchAttendanceByClassDate(selectedClass, date),
    ])
      .then(([s, saved]) => {
        if (cancelled) return;
        setStudents(s);
        setExisting(saved);
      })
      .catch(() => {
        if (!cancelled)
          setNotice({ type: "error", text: "Could not load attendance." });
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedClass, date]);

  const handleSave = async (updatedRows) => {
    const createdAt = new Date().toISOString();
    const records = updatedRows.map((r) => ({
      id: `r_${selectedClass}_${date}_${r.id}`,
      studentId: r.id,
      studentName: r.name,
      classId: selectedClass,
      date,
      status: r.status,
      notes: r.notes || "",
      createdAt,
    }));
    setSaving(true);
    setNotice(null);
    try {
      await saveAttendanceRecords(records);
      setExisting(records);
      setNotice({
        type: "success",
        text: `Attendance saved for ${records.length} students.`,
      });
    } catch (err) {
      setNotice({
        type: "error",
        text: err.message || "Could not save attendance.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <label
            htmlFor="attendance-class"
            className="text-sm font-medium text-slate-600"
          >
            Class
          </label>
          <select
            id="attendance-class"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          >
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <label
            htmlFor="attendance-date"
            className="text-sm font-medium text-slate-600"
          >
            Date
          </label>
          <input
            id="attendance-date"
            type="date"
            value={date}
            max={todayISO()}
            onChange={(e) => e.target.value && setDate(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>
      </div>

      {notice && (
        <div
          role={notice.type === "error" ? "alert" : "status"}
          className={`rounded-lg border px-4 py-3 text-sm ${
            notice.type === "error"
              ? "border-red-200 bg-red-50 text-red-800"
              : "border-green-200 bg-green-50 text-green-800"
          }`}
        >
          {notice.text}
        </div>
      )}

      <AttendanceTable
        students={students}
        existing={existing}
        onSave={handleSave}
        saving={saving}
        loading={loading}
      />
    </div>
  );
}
