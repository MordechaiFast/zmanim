function setDate(){
	const today = new Date();
	const year = today.getFullYear();
	const month = today.getMonth() + 1;
	const day = today.getDate();
	setGregorian(year, month, day);
	updateFromGregorian();
}

function setGregorian(year, month, day){
	const gregorian = document.querySelector('input[name="gregorian"]');
	gregorian.value = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function readGregorian(){
	const gregorian = document.querySelector('input[name="gregorian"]');
	year = Number(gregorian.value.slice(0, 4));
	month = Number(gregorian.value.slice(5, 7));
	day = Number(gregorian.value.slice(8, 10));
}


function updateFromGregorian() {	// Update hebrew calendar from Gregorian
	readGregorian();
	// Set Hebrew date
	const hebrew = document.hebrew;
    const jd = gregorian_to_jd(year, month, day)
	const [hYear, hMonth, hDay] = jd_to_hebrew(jd);
	hebrew.year.value = hYear;
    hebrew.month.value = hMonth;
    hebrew.day.value = hDay;
	updateHebrew();
    // Again after updating month list
	hebrew.month.value = hMonth;
    hebrew.day.value = hDay;
	updateHebrewDescription();
}

function updateHebrew() {
	// Read Hebrew date
	const hebrew = document.hebrew;
	const hYear = Number(hebrew.year.value);
	const hMonth = Number(hebrew.month.value);
	const hDay = Number(hebrew.day.value);
	// Update Hebrew month list
	if (hebrew_leap(hYear)) {
		const hebMonthName = ["תשרי", "מרחשון", "כסלו", "טבת", "שבט", "אדר א'", "אדר ב'", "ניסן", "אייר", "סיון", "תמוז", "אב", "אלול"];
	    const hebMonthValue = [7,8,9,10,11,12,13,1,2,3,4,5,6];
		for (let i = 0; i < hebMonthName.length; i++)
			hebrew.month.options[i] = new Option(hebMonthName[i], hebMonthValue[i]);
	} else {
		const hebMonthName = ["תשרי", "מרחשון", "כסלו", "טבת", "שבט", "אדר", "ניסן", "אייר", "סיון", "תמוז", "אב", "אלול"];
		const hebMonthValue = [7,8,9,10,11,12,1,2,3,4,5,6];
		for (var i = 0; i < hebMonthName.length; i ++)
			hebrew.month.options[i] = new Option(hebMonthName[i], hebMonthValue[i]);
		hebrew.month.options[12] = null;;
	}
	// Update Hebrew day list
	hebrew.day.options[29] =
		hebrew_month_days(hYear, hMonth) == 30 ? new Option("30", "30") : null;
    hebrew.year.value = hYear;
    hebrew.month.value = hMonth;
    hebrew.day.value = hDay;
    if (hebrew.day.selectedIndex == -1)
        hebrew.day.selectedIndex = 0;
}

function updateHebrewDescription() {
	// Read Hebrew date
	const hebrew = document.hebrew;
	const hYear = Number(hebrew.year.value);
	const hMonth = Number(hebrew.month.value);
	const hDay = Number(hebrew.day.value);
	const dayOfWeek = (hebrew_to_jd(hYear, hMonth, hDay) + 1.5) % 7 + 1;
    hebrew.leap.value = yearDescription(hYear);
	hebrew.holidays.value = moadim(hDay, hMonth, hYear);
	if(dayOfWeek == 7) {
		const torahReading = getTorahSections(hDay, hMonth, hYear);
		if(torahReading != "")
			hebrew.holidays.value += " שבת פרשת " + torahReading
		else
			hebrew.holidays.value += " שבת";
	} else
		hebrew.holidays.value += " יום " + (
			dayOfWeek == 1 ? "ראשון" :
			dayOfWeek == 2 ? "שני" :
			dayOfWeek == 3 ? "שלישי" :
			dayOfWeek == 4 ? "רביעי" :
			dayOfWeek == 5 ? "חמישי" :
			dayOfWeek == 6 ? "שישי" : ""
		);
}

function yearDescription(hYear) {   
    const days = hebrew_year_days(hYear);
    if(days == 353)
		return "שנה חסרה רגילה (353 ימים)"
    else if(days == 354)
		return  "שנה כסידרה רגילה (354 ימים)"
    else if(days == 355)
		return "שנה מלאה רגילה (355 ימים)"
    else if(days == 383)
		return "שנה חסרה מעוברת (383 ימים)"
    else if(days == 384)
		return "שנה כסידרה מעוברת (384 ימים)"
    else if(days == 385)
		return "שנה מלאה מעוברת (385 ימים)"
    else
		return "Invalid year length: " + hebrew_year_days(hYear) + " days.";
}

function updateFromHebrew() {	// Update Gergoran calendar from Hebrew
	// Read Hebrew date
    const hebrew = document.hebrew;
	const hYear = Number(hebrew.year.value);
	const hMonth = Number(hebrew.month.value);
	const hDay = Number(hebrew.day.value);
	// Set Gregorian date
    const jd = hebrew_to_jd(hYear, hMonth, hDay);
    const [year, month, day] = jd_to_gregorian(jd);
	setGregorian(year, month, day);
}


function checkDST(){
	readGregorian();	
	const inputs = document.myform1;
	inputs.dst.checked = DST(year, month, day);
}

function DST(year, month, day) {
	if(diaspora == 1) {
		if (month > 3 && month < 11)
			return true
		else {
			if (month == 3 && day >= NthDOW(2, 1, 3, year))
				return true
			else if (month == 11 && day < NthDOW(1, 1, 11, year))
				return true;
		}
	} else if(diaspora == 2) {
		// New Zealand DST
		if (month > 9 || month < 4)
			return true
		else {
			if (month == 9 && day >= NthDOW(0, 1, 9, year))
				return true
			else if (month == 4 && day < NthDOW(1, 1, 4, year))
				return true;
		}
	} else {
		// Israel DST
		if (month > 3 && month < 10)
			return true
		else {
			if (month == 3 && day >= NthDOW(0, 6, 3, year))
				return true
			else if (month == 10 && day < NthDOW(0, 1, 10, year))
				return true;
		}
	}
	return false;
}


function erevMoadim(hday, hmonth, hyear) {
	const dow = (hebrew_to_jd(hyear, hmonth, hday) + 1.5) % 7 + 1;
	
	if(dow == 6)
		return 1;
	if(hmonth == 1) {
		if((hday == 14 || hday == 20) && dow != 7)
			return 2;
		else if (((hday == 14 || hday == 20) && dow == 7) || ((hday == 15 || hday == 21) && diaspora))
			return 3;
	} else if(hmonth == 3) {
		if(hday == 5 && dow != 7)
			return 2;
		else if((hday == 5 && dow == 7) || (hday == 6 && diaspora))
			return 3;
	} else if(hmonth == 6) {
		if(hday == 29)
			return 2;
	} else if(hmonth == 7) {
		if(hday == 9 || ((hday == 14 || hday == 21) && dow != 7))
			return 2;
		if(hday == 1 || ((hday == 14 || hday == 21) && dow == 7) || ((hday == 15 || hday == 22) && diaspora))
			return 3;
	}
	return 0;
}


function moadim(hday, hmonth, hyear) {
	const dow = (hebrew_to_jd(hyear, hmonth, hday) + 1.5) % 7 + 1;
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
		else if(hday == 23 && diaspora)
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
			if(hebrew_month_days(hyear, 9) == 29){
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
		else if(hday == 22 && diaspora)
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
		else if(hday == 7 && diaspora)
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

function daysInM(month, year) {
	if (month == 4 || month == 6 || month == 9 || month == 11)
		return 30;
	else if (month == 2) {
		if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0)
			return 29;
		else
			return 28;
	} else
		return 31;
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

