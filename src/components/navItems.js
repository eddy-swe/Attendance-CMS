import { Home, CheckSquare, BookOpen, BarChart2 } from "lucide-react";

// Shared by the desktop sidebar and the mobile navigation bar.
export const navItems = [
  { to: "/dashboard", icon: Home, label: "Dashboard" },
  { to: "/attendance", icon: CheckSquare, label: "Take Attendance" },
  { to: "/classes", icon: BookOpen, label: "Classes & Students" },
  { to: "/reports", icon: BarChart2, label: "Attendance Reports" },
];
