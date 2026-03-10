/**
 * Pregnancy calculation utilities
 * DDR = First day of last menstrual period (DD/MM/YYYY)
 */

export function parseDate(str) {
  if (!str || !str.trim()) return null;
  const parts = str.trim().split(/[/-]/);
  if (parts.length !== 3) return null;
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const year = parseInt(parts[2], 10);
  if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
  const d = new Date(year, month, day);
  if (d.getFullYear() !== year || d.getMonth() !== month || d.getDate() !== day) return null;
  return d;
}

export function weeksAndDaysFromDDR(ddrDate) {
  if (!ddrDate || !(ddrDate instanceof Date) || isNaN(ddrDate.getTime())) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(ddrDate);
  d.setHours(0, 0, 0, 0);
  const diff = today.getTime() - d.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days < 0) return null;
  const week = Math.floor(days / 7);
  const day = days % 7;
  return { week, day, totalDays: days };
}

export function weeksFromDDR(ddrDate) {
  const wd = weeksAndDaysFromDDR(ddrDate);
  return wd ? wd.week : null;
}

export function dueDateFromDDR(ddrDate) {
  if (!ddrDate || !(ddrDate instanceof Date) || isNaN(ddrDate.getTime())) return null;
  const d = new Date(ddrDate);
  d.setDate(d.getDate() + 280);
  return d;
}

export function trimesterFromWeek(week) {
  if (week == null || week < 0) return null;
  if (week < 14) return 1;
  if (week < 28) return 2;
  return 3;
}
