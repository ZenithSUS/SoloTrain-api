export function getPHDayRange() {
  const nowPH = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Manila" })
  );

  const startOfDayPH = new Date(nowPH);
  startOfDayPH.setHours(0, 0, 0, 0);

  const endOfDayPH = new Date(nowPH);
  endOfDayPH.setHours(23, 59, 59, 999);

  return { startOfDayPH, endOfDayPH };
}

export default getPHDayRange;
