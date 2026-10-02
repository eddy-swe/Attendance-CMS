// Date helpers. All dates are handled as local "YYYY-MM-DD" strings.
// Note: `new Date().toISOString().slice(0, 10)` returns the UTC date, which is
// the wrong day for users east/west of UTC (e.g. just after midnight in Nairobi).

const pad = (n) => String(n).padStart(2, "0");

export const toISODate = (d = new Date()) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const todayISO = () => toISODate(new Date());

export const daysAgoISO = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return toISODate(d);
};

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const weekdayName = (iso) => {
  const [y, m, d] = iso.split("-").map(Number);
  return DAY_NAMES[new Date(y, m - 1, d).getDay()];
};

// A class schedule looks like "Mon/Wed/Fri 09:00".
export const isScheduledOn = (cls, iso) => {
  const days = (cls.schedule || "").split(" ")[0].split("/");
  return days.includes(weekdayName(iso));
};
