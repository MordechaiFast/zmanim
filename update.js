function setDate(){
	var mydate = new Date();
	document.myform.month.selectedIndex = mydate.getMonth();
	document.myform.day.selectedIndex = mydate.getDate()-1;
	document.myform.year.selectedIndex = 20;
	ud(document.myform.month);
	document.whichweek.weekdate.value = showdate();
}

function ud() {		// update day list
    const gregorian = document.myform;
    const dayNum = Number(gregorian.day.value);
    const monthNum = Number(gregorian.month.value);
    const yearNum = Number(gregorian.year.value);
    const days = daysInM(monthNum, yearNum);
    gregorian.day.options.length = 0;
    for (let d = 1; d <= days; d++)
        gregorian.day.options.add(new Option(d, d));
    gregorian.day.value = dayNum;
    if (gregorian.day.selectedIndex == -1)
        gregorian.day.selectedIndex = 0;
}

function calcHMonth(){	// update hebrew day list
	const hebrew = document.hebrew;
	const year = Number(hebrew.year.value);
	const month = Number(hebrew.month.value);
  	hebrew.day.options[29] =
		hebrew_month_days(year, month) == 30 ? new Option("30", "30") : null;
}


function showdate() {
  var i = document.myform.month.selectedIndex;
  var j = document.myform.day.selectedIndex;
  var k = document.myform.year.selectedIndex;
  return (document.myform.month.options[i].value + "/" +
        document.myform.day.options[j].value + "/" +
        document.myform.year.options[k].value)
}


function checkDST(){
	month = Number(document.myform.month.value);
	day = Number(document.myform.day.value);
	year = Number(document.myform.year.value);
	
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


function updateFromGregorian() {	// Update hebrew calendar from Gregorian
	year = Number(document.myform.year.value);
    month = Number(document.myform.month.value);
    day = Number(document.myform.day.value);
	
	const hebrew = document.hebrew;
    const jd = gregorian_to_jd(year, month, day)
    const hebcal = jd_to_hebrew(jd);
    if (hebrew_leap(hebcal[0])) {
		const hebMonthName = ["תשרי", "מרחשון", "כסלו", "טבת", "שבט", "אדר א'", "אדר ב'", "ניסן", "אייר", "סיון", "תמוז", "אב", "אלול"];
	    const hebMonthValue = [7,8,9,10,11,12,13,1,2,3,4,5,6];
		hebrew.month.options.length = 13;
		for (let i = 0; i < hebMonthName.length; i++)
			hebrew.month.options[i] = new Option(hebMonthName[i], hebMonthValue[i]);
	} else {
		const hebMonthName = ["תשרי", "מרחשון", "כסלו", "טבת", "שבט", "אדר", "ניסן", "אייר", "סיון", "תמוז", "אב", "אלול"];
		const hebMonthValue = [7,8,9,10,11,12,1,2,3,4,5,6];
		hebrew.month.options.length = 12;
		for (var i = 0; i < hebMonthName.length; i ++)
			hebrew.month.options[i] = new Option(hebMonthName[i], hebMonthValue[i]);
	}
    hebrew.year.value = hebcal[0];
    hebrew.month.value = hebcal[1];
    hebrew.day.value = hebcal[2];
	calcHMonth();
    hebrew.leap.value = yearType(hebcal[0]);
}

function yearType(hyear) {   
    const days = hebrew_year_days(hyear);
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
		return "Invalid year length: " + hebrew_year_days(hyear) + " days.";
}

function calcHebrew() {	// Update Gergoran calendar from Hebrew
    hyear = new Number(document.hebrew.year.value);
	hmonth = new Number(document.hebrew.month.value);
	hday = new Number(document.hebrew.day.value);
	
	const gregorian = document.myform;
    const jd = hebrew_to_jd(hyear, hmonth, hday);
    const gregcal = jd_to_gregorian(jd);
	gregorian.year.value = gregcal[0];
	gregorian.month.value = gregcal[1];
	gregorian.day.value = gregcal[2];
	ud();

	updateFromGregorian(); // ??
}



function erevMoadim(dow, hmonth, hday) {
	if(hmonth == 6) {
		if(hday == 29)
			return 1
	}
	else if(hmonth == 7) {
		if(hday == 9 || hday == 0 || ((hday == 14  || hday == 21 ) && dow != 7)){
			return 1
		}
		if (hday== 1 || ((hday == 14  || hday == 21 ) && dow == 7) || ((hday == 15 || hday == 22) && diaspora)){
			return 2
		}
		
	}
	
	else if(hmonth == 1) {
		if((hday == 14  || hday == 20 ) && dow != 7)
			return 1
		else if (((hday == 14  || hday == 20 ) && dow == 7) || ((hday == 15 || hday == 21) && diaspora))
			return 2
		
	}
	
	else if(hmonth == 3) {
		if(hday == 5 && dow != 7)
			return 1
		else if((hday == 5 && dow == 7) || (hday == 6 && diaspora))
			return 2
	}
	
	
	return "";
}


function moadim(dow, hmonth, hday, hyear) {
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

function daysInM(m, y) {
	var n=31
	m=m-1
	
	if ((m==3) || (m==5) || (m==8) || (m==10))  n--;
	if (m==1) {
		n=28;
		if (((y % 4) == 0) && (((y % 100) != 0) || ((y % 400) == 0))) n=29
	}
	return n;	
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

