function phTime() {
  const now = new Date();

  // Get UTC timestamp
  const utcTime = now.getTime();

  // Add 8 hours (Philippine time offset)
  const phTime = new Date(utcTime + 8 * 60 * 60 * 1000);

  return phTime;
}

export default phTime;
