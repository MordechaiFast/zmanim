/*  You may notice that a variety of array variables logically local
    to functions are declared globally here.  In JavaScript, construction
    of an array variable from source code occurs as the code is
    interpreted.  Making these variables pseudo-globals permits us
    to avoid overhead constructing and disposing of them in each
    call on the function in which they are used.  */

var J0000 = 1721424.5;                // Julian date of Gregorian epoch: 0000-01-01
var J1970 = 2440587.5;                // Julian date at Unix epoch: 1970-01-01
var JMJD  = 2400000.5;                // Epoch of Modified Julian Date system
var J1900 = 2415020.5;                // Epoch (day 1) of Excel 1900 date system (PC)
var J1904 = 2416480.5;                // Epoch (day 0) of Excel 1904 date system (Mac)
var dIHM = 0;


var NormLeap = new Array("Normal year", "Leap year");

//  LEAP_GREGORIAN  --  Is a given year in the Gregorian calendar a leap year ?

function leap_gregorian(year)
{
    return ((year % 4) == 0) &&
            (!(((year % 100) == 0) && ((year % 400) != 0)));
}

//  GREGORIAN_TO_JD  --  Determine Julian day number from Gregorian calendar date

var GREGORIAN_EPOCH = 1721425.5;

function gregorian_to_jd(year, month, day)
{
    return (GREGORIAN_EPOCH - 1) +
           (365 * (year - 1)) +
           Math.floor((year - 1) / 4) +
           (-Math.floor((year - 1) / 100)) +
           Math.floor((year - 1) / 400) +
           Math.floor((((367 * month) - 362) / 12) +
           ((month <= 2) ? 0 :
                               (leap_gregorian(year) ? -1 : -2)
           ) +
           day);
}

//  JD_TO_GREGORIAN  --  Calculate Gregorian calendar date from Julian day

function jd_to_gregorian(jd) {
    var wjd, depoch, quadricent, dqc, cent, dcent, quad, dquad,
        yindex, dyindex, year, yearday, leapadj;

    wjd = Math.floor(jd - 0.5) + 0.5;
    depoch = wjd - GREGORIAN_EPOCH;
    quadricent = Math.floor(depoch / 146097);
    dqc = mod(depoch, 146097);
    cent = Math.floor(dqc / 36524);
    dcent = mod(dqc, 36524);
    quad = Math.floor(dcent / 1461);
    dquad = mod(dcent, 1461);
    yindex = Math.floor(dquad / 365);
    year = (quadricent * 400) + (cent * 100) + (quad * 4) + yindex;
    if (!((cent == 4) || (yindex == 4))) {
        year++;
    }
    yearday = wjd - gregorian_to_jd(year, 1, 1);
    leapadj = ((wjd < gregorian_to_jd(year, 3, 1)) ? 0
                                                  :
                  (leap_gregorian(year) ? 1 : 2)
              );
    month = Math.floor((((yearday + leapadj) * 12) + 373) / 367);
    day = (wjd - gregorian_to_jd(year, month, 1)) + 1;

    return new Array(year, month, day);
}


/*  PAD  --  Pad a string to a given length with a given fill character.  */

function pad(str, howlong, padwith) {
    var s = str.toString();

    while (s.length < howlong) {
        s = padwith + s;
    }
    return s;
}

/*  MOD  --  Modulus function which works for non-integers.  */

function mod(a, b)
{
    return a - (b * Math.floor(a / b));
}

//  HEBREW_TO_JD  --  Determine Julian day from Hebrew date

var HEBREW_EPOCH = 347995.5;

//  Is a given Hebrew year a leap year ?

function hebrew_leap(year)
{
    return mod(((year * 7) + 1), 19) < 7;
}

//  How many months are there in a Hebrew year (12 = normal, 13 = leap)

function hebrew_year_months(year)
{
    return hebrew_leap(year) ? 13 : 12;
}

//  Test for delay of start of new year and to avoid
//  Sunday, Wednesday, and Friday as start of the new year.

function hebrew_delay_1(year)
{
    var months, days, parts;

    months = Math.floor(((235 * year) - 234) / 19);
    parts = 12084 + (13753 * months);
    day = (months * 29) + Math.floor(parts / 25920);

    if (mod((3 * (day + 1)), 7) < 3) {
        day++;
    }
    return day;
}

//  Check for delay in start of new year due to length of adjacent years

function hebrew_delay_2(year)
{
    var last, present, next;

    last = hebrew_delay_1(year - 1);
    present = hebrew_delay_1(year);
    next = hebrew_delay_1(year + 1);

    return ((next - present) == 356) ? 2 :
                                     (((present - last) == 382) ? 1 : 0);
}

//  How many days are in a Hebrew year ?

function hebrew_year_days(year)
{
    return hebrew_to_jd(year + 1, 7, 1) - hebrew_to_jd(year, 7, 1);
}

//  How many days are in a given month of a given year

function hebrew_month_days(year, month)
{
    //  First of all, dispose of fixed-length 29 day months

    if (month == 2 || month == 4 || month == 6 ||
        month == 10 || month == 13) {
        return 29;
    }

    //  If it's not a leap year, Adar has 29 days

    if (month == 12 && !hebrew_leap(year)) {
        return 29;
    }

    //  If it's Heshvan, days depend on length of year

    if (month == 8 && !(mod(hebrew_year_days(year), 10) == 5)) {
        return 29;
    }

    //  Similarly, Kislev varies with the length of year

    if (month == 9 && (mod(hebrew_year_days(year), 10) == 3)) {
        return 29;
    }

    //  Nope, it's a 30 day month

    return 30;
}

//  Finally, wrap it all up into...

function hebrew_to_jd(year, month, day)
{
    var jd, mon, months;

	months = hebrew_year_months(year);
    jd = HEBREW_EPOCH + hebrew_delay_1(year) +
         hebrew_delay_2(year) + day + 1;

    if (month < 7) {
        for (mon = 7; mon <= months; mon++) {
            jd += hebrew_month_days(year, mon);
        }
        for (mon = 1; mon < month; mon++) {
            jd += hebrew_month_days(year, mon);
        }
    } else {
        for (mon = 7; mon < month; mon++) {
            jd += hebrew_month_days(year, mon);
        }
    }

    return jd;
}

/*  JD_TO_HEBREW  --  Convert Julian date to Hebrew date
                      This works by making multiple calls to
                      the inverse function, and is this very
                      slow.  */

function jd_to_hebrew(jd)
{
    var year, month, day, i, count, first;

    jd = Math.floor(jd) + 0.5;
    count = Math.floor(((jd - HEBREW_EPOCH) * 98496.0) / 35975351.0);
    year = count - 1;
    for (i = count; jd >= hebrew_to_jd(i, 7, 1); i++) {
        year++;
    }
    first = (jd < hebrew_to_jd(year, 1, 1)) ? 7 : 1;
    month = first;
    for (i = first; jd > hebrew_to_jd(year, i, hebrew_month_days(year, i)); i++) {
        month++;
    }
    day = (jd - hebrew_to_jd(year, month, 1)) + 1;
    return new Array(year, month, day);
}