function setDate(){
var mydate = new Date();
document.myform.month.selectedIndex = mydate.getMonth();
document.myform.day.selectedIndex = mydate.getDate()-1;
document.myform.year.selectedIndex = 20;
ud(document.myform.month);
document.whichweek.weekdate.value = showdate();
}


function gm(num) {
 var mydate = new Date();
 mydate.setDate(1);
 mydate.setMonth(num-1);
 var datestr = "" + mydate;
 return datestr.substring(4,7);
}

function gy(num) {
  var mydate = new Date();
  return (eval(mydate.getFullYear()) - 20 + num);
}

function ud(mon) {
  var i = mon.selectedIndex;

  if(mon.options[i].value == "2") {
    document.myform.day.options[30] = null;
    document.myform.day.options[29] = null;
    var j = document.myform.year.selectedIndex;
    var year = eval(document.myform.year.options[j].value);
    if ( ((year%400)==0) || (((year%100)!=0) && ((year%4)==0)) ) {
      if (document.myform.day.options[28] == null) {
        document.myform.day.options[28] = new Option("29");
        document.myform.day.options[28].value = "29";
      }
    } else {
      document.myform.day.options[28] = null;
    }

  }

  if(mon.options[i].value == "1" ||
     mon.options[i].value == "3" ||
     mon.options[i].value == "5" ||
     mon.options[i].value == "7" ||
     mon.options[i].value == "8" ||
     mon.options[i].value == "10" ||
     mon.options[i].value == "12")
  {
    if (document.myform.day.options[28] == null) {
      document.myform.day.options[28] = new Option("29");
      document.myform.day.options[28].value = "29";
    }
    if (document.myform.day.options[29] == null) {
      document.myform.day.options[29] = new Option("30");
      document.myform.day.options[29].value = "30";
    }
    if (document.myform.day.options[30] == null) {
      document.myform.day.options[30] = new Option("31");
      document.myform.day.options[30].value = "31";
    }
  }

  if(mon.options[i].value == "4" ||
     mon.options[i].value == "6" ||
     mon.options[i].value == "9" ||
     mon.options[i].value == "11")
  {
    if (document.myform.day.options[28] == null) {
      document.myform.day.options[28] = new Option("29");
      document.myform.day.options[28].value = "29";
    }
    if (document.myform.day.options[29] == null) {
      document.myform.day.options[29] = new Option("30");
      document.myform.day.options[29].value = "30";
    }
    document.myform.day.options[30] = null;
  }

  if (document.myform.day.selectedIndex == -1)
    document.myform.day.selectedIndex = 0;

}


function showdate() {
  var i = document.myform.month.selectedIndex;
  var j = document.myform.day.selectedIndex;
  var k = document.myform.year.selectedIndex;
  return (document.myform.month.options[i].value + "/" +
        document.myform.day.options[j].value + "/" +
        document.myform.year.options[k].value)
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

