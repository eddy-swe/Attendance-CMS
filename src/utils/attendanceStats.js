import { isScheduledOn } from "./dates.js";

export const STATUSES = ["present", "absent", "late", "excused"];

// One record per student, per class, per date.
export const recordKey = (r) => `${r.classId}|${r.date}|${r.studentId}`;

// Replace records that share a key with the incoming ones; keep everything else.
// This prevents duplicates when the same class/date is saved more than once.
export const upsertRecords = (existing, incoming) => {
  const map = new Map(existing.map((r) => [recordKey(r), r]));
  incoming.forEach((r) => map.set(recordKey(r), r));
  return [...map.values()];
};

export const countStatuses = (records) => {
  const counts = { present: 0, absent: 0, late: 0, excused: 0 };
  records.forEach((r) => {
    if (r.status in counts) counts[r.status] += 1;
  });
  return counts;
};

// Attendance rate: present and late count as attended; excused absences are
// left out of the calculation. Returns null when there is nothing to measure.
export const attendanceRate = (counts) => {
  const counted = counts.present + counts.late + counts.absent;
  if (!counted) return null;
  return Math.round(((counts.present + counts.late) / counted) * 100);
};

export const summarizeByStudent = (records) => {
  const byStudent = new Map();
  records.forEach((r) => {
    if (!byStudent.has(r.studentId)) {
      byStudent.set(r.studentId, { studentId: r.studentId, studentName: r.studentName, records: [] });
    }
    byStudent.get(r.studentId).records.push(r);
  });
  return [...byStudent.values()]
    .map(({ records: rs, ...student }) => {
      const counts = countStatuses(rs);
      return { ...student, ...counts, total: rs.length, rate: attendanceRate(counts) };
    })
    .sort((a, b) => a.studentName.localeCompare(b.studentName));
};

// Dashboard numbers.
// - totalStudents: students enrolled (not just those who appear in records)
// - classesToday: classes whose schedule includes today's weekday
// - avgAttendance: overall rate across all records (null if no records)
// - missing: classes scheduled today that have no attendance saved yet
export const dashboardStats = ({ records, students, classes, today }) => {
  const todaysClasses = classes.filter((c) => isScheduledOn(c, today));
  const recordedToday = new Set(records.filter((r) => r.date === today).map((r) => r.classId));
  return {
    totalStudents: students.length,
    classesToday: todaysClasses.length,
    avgAttendance: attendanceRate(countStatuses(records)),
    missing: todaysClasses.filter((c) => !recordedToday.has(c.id)).length,
  };
};
