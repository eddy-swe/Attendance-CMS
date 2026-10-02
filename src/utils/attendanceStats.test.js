import { test } from "node:test";
import assert from "node:assert/strict";
import {
  upsertRecords,
  countStatuses,
  attendanceRate,
  summarizeByStudent,
  dashboardStats,
} from "./attendanceStats.js";
import { isScheduledOn, toISODate, weekdayName } from "./dates.js";

const rec = (over) => ({
  id: "x",
  studentId: "s1",
  studentName: "Alice",
  classId: "c1",
  date: "2026-09-21",
  status: "present",
  ...over,
});

test("upsertRecords replaces the same class/date/student instead of duplicating", () => {
  const first = upsertRecords([], [rec({ status: "present" })]);
  const second = upsertRecords(first, [rec({ status: "absent" })]);
  assert.equal(second.length, 1);
  assert.equal(second[0].status, "absent");
});

test("upsertRecords keeps records for other dates, classes and students", () => {
  const existing = [
    rec({ date: "2026-09-20" }),
    rec({ classId: "c2" }),
    rec({ studentId: "s2" }),
  ];
  const merged = upsertRecords(existing, [rec({ status: "late" })]);
  assert.equal(merged.length, 4);
});

test("attendanceRate counts present and late, ignores excused, null when empty", () => {
  assert.equal(attendanceRate({ present: 1, late: 1, absent: 2, excused: 5 }), 50);
  assert.equal(attendanceRate({ present: 0, late: 0, absent: 0, excused: 3 }), null);
  assert.equal(attendanceRate(countStatuses([])), null);
});

test("summarizeByStudent totals per student, sorted by name", () => {
  const out = summarizeByStudent([
    rec({ studentId: "s2", studentName: "Bob", status: "absent" }),
    rec({ studentId: "s1", studentName: "Alice", status: "present" }),
    rec({ studentId: "s1", studentName: "Alice", status: "late", date: "2026-09-22" }),
  ]);
  assert.deepEqual(out.map((s) => s.studentName), ["Alice", "Bob"]);
  assert.equal(out[0].total, 2);
  assert.equal(out[0].rate, 100);
  assert.equal(out[1].rate, 0);
});

test("weekday and schedule use the local calendar date", () => {
  assert.equal(weekdayName("2026-10-03"), "Sat");
  assert.equal(toISODate(new Date(2026, 9, 3, 0, 49)), "2026-10-03");
  assert.equal(isScheduledOn({ schedule: "Mon/Wed/Fri 09:00" }, "2026-09-21"), true);
  assert.equal(isScheduledOn({ schedule: "Mon/Wed/Fri 09:00" }, "2026-09-22"), false);
});

test("dashboardStats: enrolled students, classes today, missing = scheduled but unrecorded", () => {
  const classes = [
    { id: "c1", schedule: "Mon/Wed/Fri 09:00" },
    { id: "c2", schedule: "Mon 11:00" },
  ];
  const students = [{ id: "s1" }, { id: "s2" }, { id: "s3" }];
  const records = [rec({ classId: "c1", date: "2026-09-21" })]; // a Monday
  const stats = dashboardStats({ records, students, classes, today: "2026-09-21" });
  assert.equal(stats.totalStudents, 3);
  assert.equal(stats.classesToday, 2);
  assert.equal(stats.missing, 1); // c2 has no record today
  assert.equal(stats.avgAttendance, 100);
});
