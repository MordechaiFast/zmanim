//  Intl.DateTimeFormat("he", {calendar: "hebrew"}).format(date)
//  Intl.DateTimeFormat("he-u-ca-hebrew").format(date)
//  This function can be used to convert the Gregorian date to the hebrew date.

function getHebrewMonthNames(year) {
  const fNum = new Intl.DateTimeFormat('en-u-ca-hebrew', {month: 'numeric'});
  const fName = new Intl.DateTimeFormat('he-u-ca-hebrew', {month: 'long'});

  const months = {};
  for (let i = 1; i < 366; i++) {
    const d = new Date(Date.UTC(year, 0, i));
    if (!months[fNum.format(d)]) {
      months[fNum.format(d)] = fName.format(d);
    }
  }
  return months;
}

function hebrewToGregorian(hDay, hMonth, hYear) {
  // hMonth: Nissan = 1, Addar = 12, Addar II = 13
  const fFull = new Intl.DateTimeFormat('he-u-ca-hebrew');
  const fNum = new Intl.DateTimeFormat('en-u-ca-hebrew', {month: 'numeric'});

  if (hMonth > 6) {
      hMonth -= 6;
  } else {
      hMonth += 6 + (leapYear(hYear) ? 1 : 0);
  }
  const gYear = hYear - 3761;

  for (let month = 8; month < 22; month++) {
    for (let day = 1; day <= 31; day++) {
      const date = new Date(Date.UTC(gYear, month, day));
      const [dayH, monthHN, yearH] = fFull.format(date).split(" ");
      const monthH = fNum.format(date);
      if (dayH == hDay && monthH == hMonth && yearH == hYear) {
        return date;
      }
    }
  }
}

function leapYear(hYear) {
  // Only works for years with the Gregorian Calendar (5200+)
  const Sep20ofYear = new Date(Date.UTC(hYear - 3760, 8, 20));
  // A date that is always אלול on a leap year
  const fNum = new Intl.DateTimeFormat('en-u-ca-hebrew', {month: 'numeric'});
  return fNum.format(Sep20ofYear) == '13';
}

// Example
let hDay = 1, hMonth = 1, hYear = 5787;
let gDate = hebrewToGregorian(hDay, hMonth, hYear)
console.log(Intl.DateTimeFormat().format(gDate),
            Intl.DateTimeFormat("en-u-ca-hebrew").format(gDate));
// 4/8/2027 1 Nisan 5787

// const aLeapYear = 2022, aStandardYear = 2020;
// console.log(getHebrewMonthNames(aStandardYear), getHebrewMonthNames(aLeapYear));
