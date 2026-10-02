import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StatsCard from "../components/StatsCard";
import { getSummary, getRecentActivity } from "../services/attendanceService";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    getSummary().then(setSummary);
    getRecentActivity().then(setActivity);
  }, []);

  const rate = summary?.avgAttendance;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Total Students"
          value={summary?.totalStudents ?? "—"}
          hint="Enrolled across all classes"
        />
        <StatsCard
          title="Classes Today"
          value={summary?.classesToday ?? "—"}
          hint="Scheduled for today"
        />
        <StatsCard
          title="Avg Attendance"
          value={rate == null ? "—" : `${rate}%`}
          hint="Present and late, excluding excused"
        />
        <StatsCard
          title="Missing Records"
          value={summary?.missing ?? "—"}
          hint="Classes today with no attendance saved"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-2 text-base font-semibold">Quick Actions</h3>
          <p className="mb-4 text-sm text-slate-500">
            Start attendance for the day with one click.
          </p>
          <Link
            to="/attendance"
            className="inline-block rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Take Today&apos;s Attendance
          </Link>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-2 text-base font-semibold">Recent Activity</h3>
          {activity.length === 0 ? (
            <p className="text-sm text-slate-500">No attendance recorded yet.</p>
          ) : (
            <ul>
              {activity.map((a) => (
                <li
                  key={a.id}
                  className="border-b border-slate-100 py-2 text-sm text-slate-700"
                >
                  {a.text}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
