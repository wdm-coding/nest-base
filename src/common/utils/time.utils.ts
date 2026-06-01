export function convertTimerToMs(timer: string) {
  const unit = timer.slice(-1); // 获取时间单位
  const timerInSec = timer.replace(unit, ''); // 获取时间值
  const value = Number(timerInSec);
  switch (unit) {
    case 's':
      return value * 1000;
    case 'm':
      return value * 60 * 1000;
    case 'h':
      return value * 60 * 60 * 1000;
    case 'd':
      return value * 24 * 60 * 60 * 1000;
    default:
      throw new Error(`未知的时间单位: ${unit}`);
  }
}
