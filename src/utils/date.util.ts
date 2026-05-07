export const generateYearOptions = (
  from: number,
  to: number = new Date().getFullYear() + 1,
) =>
  Array.from({ length: to - from + 1 }, (_, i) => ({
    label: String(to - i),
    value: String(to - i),
  }))
