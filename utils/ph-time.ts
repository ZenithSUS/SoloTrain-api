function phTime() {
  const now = new Date();

  const utcTime = now.getTime() + now.getTimezoneOffset() * 60 * 1000;

  const phTime = new Date(utcTime + 8 * 60 * 60000);

  return phTime;
}

export default phTime;
