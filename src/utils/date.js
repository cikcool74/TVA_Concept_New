export const getTodayString = () => new Date().toISOString().split("T")[0];

export const getWeekId = (dateString) => {
  const date = dateString ? new Date(dateString) : new Date();
  const startOfWeek = new Date(date.setDate(date.getDate() - date.getDay()));
  return startOfWeek.toISOString().split("T")[0];
};
