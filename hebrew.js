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


/*  updateFromGregorian  --  Update all calendars from Gregorian.
                             "Why not Julian date?" you ask.  Because
                             starting from Gregorian guarantees we're
                             already snapped to an integral second, so
                             we don't get roundoff errors in other
                             calendars.  */

function updateFromGregorian()
{
    var j, year, mon, mday, 
        weekday, julcal, hebcal, islcal, hmindex, utime, isoweek,
        may_countcal, mayhaabcal, maytzolkincal, bahcal, frrcal,
        indcal, isoday, xgregcal;


    mon = Number(document.myform.month.value);
    mday = Number(document.myform.day.value);
    year = Number(document.myform.year.value);

    //  Update Julian day

    j = gregorian_to_jd(year, mon, mday)


    //  Update Hebrew Calendar

    hebcal = jd_to_hebrew(j);
    
    if (hebrew_leap(hebcal[0])) {
            var hebMonth = new Array("תשרי", "מרחשון", "כסלו", "טבת", "שבט", "אדר א'", "אדר ב'", "ניסן", "אייר", "סיון", "תמוז", "אב", "אלול")
	    var hebMonthValue = new Array(7,8,9,10,11,12,13,1,2,3,4,5,6);

    		document.hebrew.month.options.length = 13;
            
            for (var i = 0; i < hebMonth.length; i ++){
                    document.hebrew.month.options[i] = new Option(hebMonth[i]);
                    document.hebrew.month.options[i].value = hebMonthValue[i];
            }
            	
        } else {
            var hebMonth = new Array("תשרי", "מרחשון", "כסלו", "טבת", "שבט", "אדר", "ניסן", "אייר", "סיון", "תמוז", "אב", "אלול")
    	    var hebMonthValue = new Array(7,8,9,10,11,12,1,2,3,4,5,6);
		
            document.hebrew.month.options.length = 12;
            for (var i = 0; i < hebMonth.length; i ++){
            	document.hebrew.month.options[i] = new Option(hebMonth[i]);
    		document.hebrew.month.options[i].value = hebMonthValue[i];
            }
            
        }
    
    
    
    document.hebrew.year.value = hebcal[0];
    
    //document.hebrew.month.selectedIndex = hebcal[1] - 1;
    document.hebrew.month.value = hebcal[1];
    document.hebrew.day.value = hebcal[2];
    hmindex = hebcal[1];
    if (hmindex == 12 && !hebrew_leap(hebcal[0])) {
        hmindex = 14;
    }

    
    
    switch (hebrew_year_days(hebcal[0])) {
        case 353:
            document.hebrew.leap.value = "שנה חסרה רגילה (353 ימים)";
            break;

        case 354:
            document.hebrew.leap.value = "שנה כסידרה רגילה (354 ימים)";
            break;

        case 355:
            document.hebrew.leap.value = "שנה מלאה רגילה (355 ימים)";
            break;

        case 383:
            document.hebrew.leap.value = "שנה חסרה מעוברת (383 ימים)";
            break;

        case 384:
            document.hebrew.leap.value = "שנה כסידרה מעוברת (384 ימים)";
            break;

        case 385:
            document.hebrew.leap.value = "שנה מלאה מעוברת (385 ימים)";
            break;

        default:
            document.hebrew.leap.value = "Invalid year length: " +
                hebrew_year_days(hebcal[0]) + " days.";
            break;
    }

	
	
}

//  calcGregorian  --  Perform calculation starting with a Gregorian date

function calcGregorian()
{
    updateFromGregorian();
    calcHebrew();
}


/*  JHMS  --  Convert Julian time to hour, minutes, and seconds,
              returned as a three-element array.  */

function jhms(j) {
    var ij;

    j += 0.5;                 /* Astronomical to civil */
    ij = (j - Math.floor(j)) * 86400.0;
    return new Array(
                     Math.floor(ij / 3600),
                     Math.floor((ij / 60) % 60),
                     Math.floor(ij % 60));
}

//  calcJulian  --  Perform calculation starting with a Julian date

function calcJulian(j)
{
    var date, time;

    j = new Number(j);
    date = jd_to_gregorian(j);
    time = jhms(j);
    
    document.myform.year.value = date[0];
    document.myform.month.selectedIndex = date[1] - 1;
    document.myform.day.value = date[2];
    
    updateFromGregorian();
}

//  calcHebrew  --  Update from Hebrew calendar

function calcHebrew()
{
    
    calcJulian(hebrew_to_jd((new Number(document.hebrew.year.value)),
                          document.hebrew.month.value,
                          (new Number(document.hebrew.day.value))));
    
}


function calcHMonth(){
	dIHM = hebrew_month_days(new Number(document.hebrew.year.value), document.hebrew.month.value)	
	hud(dIHM);
}


function hud(dIM) {
  
  if (dIM == 30){
  	document.hebrew.day.options[29] = new Option("30");
        document.hebrew.day.options[29].value = "30";
  }
  else {
  	document.hebrew.day.options[29] = null;
  }

  //if (document.hebrew.day.selectedIndex == -1)
  //  document.myform.day.selectedIndex = 0;

}



function erevMoadim(dow, hmonth, hday) {
	
	if (hmonth == "getDate"){
		hmonth = new Number(document.hebrew.month.value);
		hday = new Number(document.hebrew.day.value);
		
    	}
    	if(hmonth == 6) {
		if(hday == 29)
			return 1
	}
	else if(hmonth == 7) {
		if(hday == 9 || hday == 0 || ((hday == 14  || hday == 21 ) && dow != 7)){
			return 1
		}
		if (hday== 1 || ((hday == 14  || hday == 21 ) && dow == 7) || ((hday == 15 || hday == 22) && diaspora == 1)){
			return 2
		}
		
	}
	
	else if(hmonth == 1) {
		if((hday == 14  || hday == 20 ) && dow != 7)
			return 1
		else if (((hday == 14  || hday == 20 ) && dow == 7) || ((hday == 15 || hday == 21) && diaspora == 1))
			return 2
		
	}
	
	else if(hmonth == 3) {
		if(hday == 5 && dow != 7)
			return 1
		else if((hday == 5 && dow == 7) || (hday == 6 && diaspora == 1))
			return 2
	}
	
	
	return "";
}


function moadim(dow, hmonth, hday, hyear) {
	//var hmonth = document.hebrew.month.value;
	//var hday = document.hebrew.day.value;
	
	if(hmonth == 7) {
		if(hday == 1 || hday == 2)
			return "ראש השנה"
		else if(hday == 3 && dow != 7)
			return "צום גדליה";
		else if(hday == 4 && dow == 1)
			return "צום גדליה";
		else if(hday == 10)
			return "יום הכפורים"
		else if(hday >= 15 && hday < 22)
			return "סכות"
		else if(hday == 22)	
			return "שמיני עצרת"
		else if(hday == 23 && diaspora == 1)
			return "שמחת תורה"
	}
	else if(hmonth == 9) {
		if(hday >= 25)
			return "חנוכה"
	}
	else if(hmonth == 10) {
		if(hday <= 2) {
			return "חנוכה"
		}
		else if(hday == 3) {
			// Kislev can be malei or chaser
			if(hebrew_month_days(new Number(hyear), 9)	== 29){
				return "חנוכה"
			}	
		}
	
		else if(hday == 10)
			return "עשרה בטבת"
	}
	else if(hmonth == 11) {
		if(hday==15)
			return "ט\"ו בשבט"
	}
	else if(hmonth == 12) {
		if (hebrew_leap(hyear)){
			if(hday == 14)
				return "פורים קטן"
		}
		else {
			if(hday == 11 && dow == 5)
				return "תענית אסתר"
			else if(hday == 13 && dow != 7)
				return "תענית אסתר"
			else if(hday == 14)
				return "פורים"
			else if(hday == 15)
				return "שושן פורים"
		} 
	}
	
	else if(hmonth == 13) {
		if(hday == 11 && dow == 5)
			return "תענית אסתר"
		else if(hday == 13 && dow != 7)
			return "תענית אסתר"
		else if(hday == 14)
			return "פורים"
		else if(hday == 15)
			return "שושן פורים"
	}
	else if(hmonth == 1) {

		if(hday == 12 && dow == 5)
			return "תענית בכורות"
		else if(hday == 14 && dow != 7)
			return "תענית בכורות"
		else if(hday >= 15 && hday <= 21)
			return "פסח"
		else if(hday == 22 && diaspora == 1)
			return "פסח"
			
		if((hday == 25  && dow == 5) || (hday == 26 && dow == 5))
			return "יום השואה"
		else if(hday == 27  && dow != 6 && dow != 7 && dow != 1)
			return "יום השואה"
		else if(hday == 28  && dow == 2)
			return "יום השואה"
	}
	else if(hmonth == 2) {
		if(hday == 3 && dow == 5)
			return "יום העצמאות"
		else if(hday == 4 && dow == 5)
			return "יום העצמאות"
		else if(hday == 5 && dow != 6 && dow != 7 && dow != 2)
			return "יום העצמאות"
		else if(hday == 6 && dow == 3)
			return "יום העצמאות"	
			
		if(hday == 14)
			return "פסח שני"
		else if(hday == 18)
			return "ל\"ג בעומר"
		if(hday == 28)
			return "יום ירושלים"
	}
	else if(hmonth == 3) {
		if(hday == 6)
			return "שבועות"
		else if(hday == 7 && diaspora == 1)
			return "שבועות"
	}
	else if(hmonth == 4) {
		if(hday == 17 && dow != 7)
			return "י\"ז בתמוז"
		if(hday == 18 && dow == 1)
			return "י\"ז בתמוז"
	}
	else if(hmonth == 5) {
		if(hday == 9 && dow != 7)
			return "תשעה באב"
		if(hday == 10 && dow == 1)
			return "תשעה באב"
		if(hday == 15)
			return "ט\"ו באב"
	}
	
	

	return "";
}

function DOW(day,month,year) {
	var a = Math.floor((14 - month)/12);
	var y = year - a;
	var m = month + 12*a - 2;
	var d = (day + y + Math.floor(y/4) - Math.floor(y/100) +
			Math.floor(y/400) + Math.floor((31*m)/12)) % 7;
	return d + 1;
}

function NthDOW(nth,weekday,month,year) {
	if (nth > 0)
		return (nth - 1) * 7 + 1 + (7 + weekday - DOW((nth - 1) * 7 + 1, month, year)) % 7;
	var days = daysInM(month, year);
	return days - (DOW(days, month, year) - weekday + 7) % 7;
}

