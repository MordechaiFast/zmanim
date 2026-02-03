/*
 JavaScript Temporal Hour Calculator
*/


let month, day, year, hDay, hMonth, hYear, jewish,
diaspora, nerot, hite, lat, long, timezone, dst, 
alotDeg, misheyakirDeg, tzeitDeg, pressure, temp, 
AMPM, showSeconds, graMga, with_refraction;

var strArray = new Array(31);
//var strArray1 = new Array(1000);
//var counter1 = 0;
var text = new Array(8);
var monthName = new Array('January','February','March','April','May','June','July','August','September','October','November','December');
var shortMonthName = new Array('Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec');

function twilightAngle(h, evening) {
  const date = {year, month, day};
  const location = {lat, long, timezone, dst};
  return twilightTime(90-h, evening, date, location)
}

function temporalHour(hour) {
  const date = {year, month, day};
  const location = {lat, long, timezone, dst};
  const atmospheric = {pressure, temp};
  return (
    (graMga == 'MGA')
    ? ( with_refraction
		? temporalHourR(hour, date, location, atmospheric, alotDeg)
		: temporalHourD(hour, date, location, alotDeg) )
    : ( with_refraction
		? temporalHourR(hour, date, location, atmospheric)
		: temporalHourS(hour, date, location) )
  );
}

function HoursMinutesSeconds(time, showSeconds=true, roundUp=false) {
	const frac = x => x - Math.floor(x);
	
	if (isNaN(time))
		return " --:--";

	let h = Math.floor(time);
	let min = Math.floor(60 * frac(time));
	let sec = Math.round(60 * frac(60 * frac(time)));
	
	if (sec == 60) {min += 1; sec = 0;}
	if (min == 60) {h += 1; min = 0;}
	
	if (!showSeconds && roundUp) {
		if (sec > 0) {
			min++
			if (min == 60){h += 1;	min = 0;}
		}
	}
	
	let timeFormat = "";
	if (AMPM) {
		if (h < 12)
			timeFormat = " AM"
		else {
			if (h > 12)
				h -= 12;
			timeFormat = " PM";
		}
		if (AMPM == 2)
			timeFormat = timeFormat.replace(" ", "&nbsp;");
		if (h == 0)
			h = 12;
	}
	
	return ' ' + (AMPM ? h : h.toString().padStart(2, '0'))
        + ':' + min.toString().padStart(2, '0')
        + (showSeconds ? ':' + sec.toString().padStart(2, '0') : '')
	    // + timeFormat;
}

function zmanOf(zman){
	const minutesOnly = false;
	const roundUp = true;
	const evening = true;
	//hite = Math.sqrt(hite) * 0.0348 ;
	let hight = Math.acos(6371009 / (6371009 + hite)) * 180 / Math.PI;
	switch (zman) {
		case "alot":
			time = twilightAngle(90 + alotDeg, 0);
			return HoursMinutesSeconds(time, showSeconds, roundUp);
		case "misheyakir":
			time = twilightAngle(90 + misheyakirDeg, 0);
			return HoursMinutesSeconds(time, showSeconds, roundUp);
		case "hanetz":
			time = twilightAngle(90 + (50.0/60.0) + hight, 0);
			return HoursMinutesSeconds(time, minutesOnly, roundUp);
		case "shema":
			time = temporalHour(3);
			return HoursMinutesSeconds(time, showSeconds);
		case "tefillah":
			time = temporalHour(4);
			return HoursMinutesSeconds(time, showSeconds);
		case "chatzot":
			time = temporalHour(6);
			return HoursMinutesSeconds(time, showSeconds);
		case "minchag":
			time = temporalHour(6.5);
			return HoursMinutesSeconds(time, showSeconds, roundUp);
		case "minchak":
			time = temporalHour(9.5);
			return HoursMinutesSeconds(time, showSeconds, roundUp);
		case "plag":
			time = temporalHour(10.75);
			return HoursMinutesSeconds(time, showSeconds);
		case "shkia":
			time = twilightAngle(90 + (50.0/60.0) + hight, evening);
			return HoursMinutesSeconds(time, minutesOnly);
		case "tzeit":
			time = twilightAngle(90 + tzeitDeg, 12);
			return HoursMinutesSeconds(time, showSeconds, roundUp);
		case "shabbat":
			sunset = twilightAngle(90 + (50.0/60.0) + hight, evening);
			return HoursMinutesSeconds(sunset - (nerot/60), minutesOnly);
		case "motzai shabbat":
			tzeit = twilightAngle(90 + tzeitDeg, 12);
			return HoursMinutesSeconds(tzeit + (10/60), showSeconds, roundUp);
	}
}

function lookupTitle(zman){
	switch (zman) {
		case "alot":
			return "עלות השחר";
		case "misheyakir":
			return "משיכיר";
		case "hanetz":
			return "הנץ החמה";
		case "shema":
			return "קריאת שמע";
		case "tefillah":
			return "תפילה";
		case "chatzot":
			return "חצות";
		case "minchag":
			return "מנחה גדולה";
		case "minchak":
			return "מנחה קטנה";
		case "plag":
			return "פלג המנחה";
		case "shkia":
			return "שקיעת החמה";
		case "tzeit":
			return "צאת הכוכבים";
		case "shabbat":
			return "הדלקת נרות";
		case "parsha":
			return "שבת ומועד";
		case "molad":
			return "מולד";
	}
}

const zmanimIDs = [
	"alot", "misheyakir", "hanetz", "shema",
	"tefillah", "chatzot", "minchag", "minchak",
	"plag", "shkia", "tzeit", "shabbat",
];


function getInput(){
	[year, month, day] = readGregorian();
	
	const hebrew = document.hebrew;
	hDay = Number(hebrew.day.value);
	hMonth = Number(hebrew.month.value);
	hYear = Number(hebrew.year.value);

	jewish = Number(document.tables.jewish.value);
	
	const inputs = document.myform1;
	lat = Math.abs(inputs.latitude.value) * (inputs.NorthSouth.value == 'N' ? 1 : -1);
	long = Math.abs(inputs.longitude.value) * (inputs.EastWest.value == 'W' ? 1 : -1);
	
	timezone = Number(inputs.timezone.value);
	dst = inputs.dst.checked;	
	
	hite = Number(inputs.hite.value);
	
	showSeconds = inputs.seconds.checked;
	AMPM = Number(inputs.ampm.value);
	
	with_refraction = inputs.refraction.checked;
	
	pressure = Number(inputs.pressure.value);
	//temp = 273.15 + Number(inputs.temp.value);
	temp = 273 + Number(inputs.temp.value);
	
	nerot = Number(inputs.nerot.value);
	
	alotDeg = Number(inputs.alotDeg.value);
	misheyakirDeg = Number(inputs.misheyakirDeg.value);
	tzeitDeg = Number(inputs.tzeitDeg.value);
	graMga = inputs.GRA_MGA.value;
	
	if (diaspora != 2) {
		diaspora = inputs.diaspora.checked;
	} else {
		if (!inputs.diaspora.checked) 
			diaspora = 0;
	}
}


function calculate(){
	getInput();
	const daily = document.dailyTable;
	daily.alot.value = zmanOf("alot");
	daily.misheyakir.value = zmanOf("misheyakir");
	daily.hanetz.value = zmanOf("hanetz");
	daily.shema.value = zmanOf("shema");
	daily.tefillah.value = zmanOf("tefillah");
	daily.chatzot.value = zmanOf("chatzot");
	daily.minchag.value = zmanOf("minchag");
	daily.minchak.value = zmanOf("minchak");
	daily.plag.value = zmanOf("plag");
	daily.shkia.value = zmanOf("shkia");
	const erevMoad = erevMoadim(hDay, hMonth, hYear, diaspora);
	if (erevMoad == 1) {
		daily.shabbat.value = zmanOf("shabbat");
	} else if (erevMoad == 2) {
		daily.shabbat.value = zmanOf("shabbat") + "*";
	} else if (erevMoad == 3) {
		daily.shabbat.value = "*" + zmanOf("motzai shabbat") + "*";
	} else {
		daily.shabbat.value = "";
	}
	daily.tzeit.value = zmanOf("tzeit");
}

function hebrewNumber(num) {
	const thousands = num - num % 1000;
	const hundreds = num - thousands - num % 100;
	const tens = num - thousands - hundreds - num % 10;
	const ones = num - thousands - hundreds - tens;
	const hundredsLetters = ['', 'ק', 'ר', 'ש', 'ת', 'תק', 'תר', 'תש', 'תת', 'תתק'];
	const tensLetters = ['', 'י', 'כ', 'ל', 'מ', 'נ', 'ס', 'ע', 'פ', 'צ'];
	const onesLetters = ['', 'א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט'];
	let letterString = '' + hundredsLetters[hundreds/100] + tensLetters[tens/10] + onesLetters[ones];
	if(letterString.length > 1)
		letterString = letterString.slice(0, letterString.length - 1) + '"' + letterString[letterString.length-1]
	else
		letterString += "'";
	if(letterString.endsWith('י"ה'))
		letterString = letterString.slice(0, letterString.length - 3) + 'ט"ו'
	else if(letterString.endsWith('י"ו'))
		letterString = letterString.slice(0, letterString.length - 3) + 'ט"ז';
	return letterString;
}

function table() {
 const automatic = window.confirm("Do you wish to use DST automatically? OK for yes. Cancel for no.");
 
 getInput();

 if(AMPM == 1) AMPM = 2;
 
 const daysOfWeek = jewish
	? ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"]
	: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sha"];

 const hebMonths = (hebrew_leap(hYear))
	? ["", "ניסן", "אייר", "סיון", "תמוז", "אב", "אלול", "תשרי", "מרחשון", "כסלו", "טבת", "שבט", "אדר א'", "אדר ב'"]
	: ["", "ניסן", "אייר", "סיון", "תמוז", "אב", "אלול", "תשרי", "מרחשון", "כסלו", "טבת", "שבט", "אדר"];

 const strMonthYear = jewish
	? `<span class=hebrewTitle align=center>${hebMonths[hMonth]} ${hebrewNumber(hYear)}</span>`
	: `${monthName[month - 1]} ${year}`;
 
 const refraction = with_refraction
    ? `<BR>refraction calculated for ${temp - 273}&deg;C ,${pressure} millibars (Air Pressure)` 
    : "";

 const title = `<Center><FONT COLOR=black size=+1>
    <B>${strMonthYear}&nbsp;&nbsp;&nbsp;<div class=hebrewTitle align=center>${getLocationName()}</div></B>
    <FONT COLOR=red size=-1>Latitude: ${Math.abs(lat)}°${lat >= 0 ? " N" : " S"}  Longitude: ${Math.abs(long)}°${long >= 0 ? " W" : " E"}
    <BR>GMT ${timezone >= 0 ? "+ " : " "}${timezone}${dst && !automatic ? " DST" : ""}, ${hite} meters above sealevel
    ${refraction}</FONT>`;
 
 if(jewish) {
    const jd = hebrew_to_jd(hYear, hMonth, 1);
    [hYear, hMonth, hDay] = jd_to_hebrew(jd);
    [year, month, day] = jd_to_gregorian(jd);
 } else {
    day = 1;
 }

 let shortMonthTitle = jewish ? shortMonthName[month - 1] : "";
 let monthChanged = false;
 const myMonthNum = month - 1;

 const dIM = jewish
    ? hebrew_month_days(hYear, hMonth)
    : daysInM(month, year);

 for(let date = 1, myDate = new Date(year, month - 1, day); date <= dIM; date++, myDate.setDate(day + 1)) {
	year =  myDate.getFullYear();
	month = myDate.getMonth()+1;
	day = myDate.getDate();
	
	if (jewish){
		hDay = date;
	} else {
		const jd = gregorian_to_jd(year, month, day);
		[hYear, hMonth, hDay] = jd_to_hebrew(jd);
	}
	
	if (automatic)
		dst = DST(year, month, day);
	
	const alot = zmanOf("alot");
	const misheyakir = zmanOf("misheyakir");
	const hanetz = zmanOf("hanetz");
	const shema = zmanOf("shema");
	const tefillah = zmanOf("tefillah");
	const chatzot = zmanOf("chatzot");
	const minchag = zmanOf("minchag");
	const minchak = zmanOf("minchak");
	const plag = zmanOf("plag");
	const shkia = zmanOf("shkia"); 
	const erevMoad = erevMoadim(hDay, hMonth, hYear, diaspora);
	let shabbat;
	if (erevMoad == 1)
		shabbat = "<B>" + zmanOf("shabbat") + "</B>"
	else if (erevMoad == 2)
		shabbat = "<B>" + zmanOf("shabbat") + "*</B>"
	else if (erevMoad == 3)
		shabbat = "<B>*" + zmanOf("motzai shabbat") + "*</B>"
	else
		shabbat = "&nbsp;";
    const tzeit = zmanOf("tzeit"); 
	
	let torahReading = getTorahSections(hDay, hMonth, hYear);
	torahReading = torahReading
    	? `</B><span class=hebrewBody align=center>${torahReading}</span><B>`
    	: "&nbsp;";
	
	let moed = moadim(hDay, hMonth, hYear, diaspora);
	moed = moed
		? `</B><span class=hebrewBody align=center>${moed}</span><B>`
		: "&nbsp;";
	moed = torahReading !== "&nbsp;" ? `${torahReading} ${moed}` : moed;
	
	let secondaryDay;	
	if(jewish) {
		if(shortMonthName[myDate.getMonth()] !== shortMonthTitle && !monthChanged){
			monthChanged = true;
			shortMonthTitle = myMonthNum < myDate.getMonth()
				? `${shortMonthTitle}/<BR>${shortMonthName[myDate.getMonth()]}`
				: `${shortMonthName[myDate.getMonth()]}/<BR>${shortMonthTitle}`;
		}
		secondaryDay = day;
	} else {
		if(!monthChanged) {	
			if (shortMonthTitle === "") {
				shortMonthTitle = hebMonths[hMonth];
			} else if (hebMonths[hMonth] != shortMonthTitle){
				monthChanged = true;
				shortMonthTitle = `${shortMonthTitle}/<BR>${hebMonths[hMonth]}`;
			}
		}
		secondaryDay = hDay;
	}
 	const dayofWeek = daysOfWeek[myDate.getDay()];
	strArray[date] = [tzeit, shkia, shabbat, plag, minchak, minchag, chatzot, tefillah, shema, hanetz, misheyakir, alot,
		moed, secondaryDay, dayofWeek, date, myDate.getDay() == 6];
  }
 writeMonthPage(title, shortMonthTitle, strArray, dIM);
}

function writeMonthPage(title, myMonth, strArray, dIM) {
	const zmanim = ["parsha", "alot", "misheyakir",
		"hanetz", "shema", "tefillah", "chatzot",
		"minchag", "minchak", "plag", "shabbat",
		"shkia", "tzeit"];

	let headerCells = "";
	for(let j = 0; j < 11; j++) {
		headerCells += "<TD><P ALIGN=center>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</TD>";
	}
	headerCells += "<TD><P ALIGN=center>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</TD>";
	for(let j = 0; j < 3; j++) {
		headerCells += "<TD><P ALIGN=center>&nbsp;</TD>";
	}

	let titleCells = "";
	for(let j = 12; j >= 0; j--) {
		titleCells += `
			<TD bgcolor=#FFFFEE>
				<P ALIGN=center>
				<div class=hebrewTitle align=center>${lookupTitle(zmanim[j])}</div>
			</TD>`;
	}

	let dataRows = "";
	for(let i = 1; i <= dIM; i++) {
		const rowData = strArray[i];
		const bgColor = i % 2 === 0 ? "#CCCCCC" : "#FFFFFF";
		dataRows += `<TR bgcolor=${bgColor}>`;

		for(let j = 0; j < 16; j++) {
			const isShabbat = rowData[16];
			const content = isShabbat ? `<B>${rowData[j]}</B>` : rowData[j];
			dataRows += `<TD><P ALIGN=center>${content}</TD>`;
		}
		dataRows += "</TR>";
	}
  
	const htmlText = `
<html>
	<head>
		<meta charset="utf-8">
		<title>Monthly Zmanim</title>
		<STYLE TYPE='text/css' media='screen'>
			P,TR,TD{
				font-size: 12px;
				font-family:verdana , arial, helvetica, sans-serif;
				color: black;
			}
			SPAN{
				font-size: 15px;
				font-family:Times New Roman,  serif;
				color: black;
			}
			.hebrewTitle {
				cursor:hand;
				font-family:david,times new roman,serif;
				font-weight:normal;
				font-size:150%;
				color:#000000;
			}
		</STYLE>
		<STYLE TYPE='text/css' media='print'>
			P,TR,TD{
				font-size: 10px;
				font-family:verdana , arial, helvetica, sans-serif;
				color: black;
			}
			SPAN{
				font-size: 13px;
				font-family:Times New Roman,  serif;
				color: black;
			}
			.hebrewTitle {
				cursor:hand;
				font-family:david,times new roman,serif;
				font-weight:normal;
				font-size:120%;
				color:#000000;
			}
		</STYLE>
	</head>
	<body BGCOLOR=#FFFFFF TEXT=#000000 LINK=#0000FF VLINK=#663399 ALINK=#FF0000>
		<div class=page align="center">
		<center>
		<TABLE width=700 border=1 cellpadding=1 cellspacing=0 bordercolor=Black>
			<TR>
				<TD COLSPAN=16>
					${title}
				</TD>
			</TR>
			<TR>
				<TD>
					<P ALIGN=center>
					<FONT COLOR=red size=-5>©&nbsp;N.&nbsp;Kaplan&nbsp;&nbsp;</FONT>&nbsp;
				</TD>
				${headerCells}
			</TR>
			<TR>
				${titleCells}
				<TD bgcolor=#CCCCCC><P ALIGN=center>${myMonth}</TD>
				<TD bgcolor=#CCCCCC><P ALIGN=center>&nbsp;Day&nbsp;</TD>
				<TD bgcolor=#CCCCCC><P ALIGN=center>D</TD>
			</TR>
			${dataRows}
		</TABLE>
	</body>
</html>`
  
    const blob = new Blob([htmlText], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const newWin = window.open(url, '_blank');
    // If popup blocked, try to open a blank window and navigate it to the blob URL
    if (!newWin) {
      const fallback = window.open('');
      if (fallback) {
        try {
          fallback.location = url;
        } catch (e) {
          // If even setting location fails, inform the user
          alert('Unable to open the month page (popup blocked).');
        }
      } else {
        alert('Unable to open the month page (popup blocked).');
      }
    }
    // Revoke URL after a delay to allow the new window to load
    setTimeout(() => { URL.revokeObjectURL(url); }, 10000);
}


function yearTable(zman) {
if(zman == "")
	return;
if(zman == "shabbat"){
	return yearShabbat();
}

var deg = String.fromCharCode(176);

getInput();

if (zman == "molad"){
	var a = window.open("molad.asp?year="+hYear)
}
else {   
	

var truthBeTold = window.confirm("Do you wish to use DST automatically? OK for yes. Cancel for no.");
if (truthBeTold) 
	automatic = 1;
else	
	automatic = 0;



if (jewish == 1){
	var numDays = 30;
	var j = hebrew_to_jd(hYear, 7, 1);
	var date1 = jd_to_gregorian(j);

	year = date1[0];
	month = date1[1];
	day = date1[2];

	var myDate = new Date(year, month-1, day);

	myDate.setHours(12);

	//  Update Hebrew Calendar
	hebcal = jd_to_hebrew(j);

	var hebYear = hebcal[0];
	var hebMonth = hebcal[1];

	if (hebrew_leap(hebYear))
		var numMonths = 13;
	else 
		var numMonths = 12;   

}
else  {
	var myDate = new Date(year, 0, 1);
	myDate.setHours(12);
	var numMonths = 12;
	var numDays = 31;
}


var locName = getLocationName();


 var str11="", str22="";
 var T;

 
 
 var timezoneString = "";
 //var offsetStr = offset + 0;
 var offsetStr = timezone;
  

 
  if (dst) {
  	if (automatic == 0){
		timezoneString = " DST"
   	}
  }
 
  if (lat>=0) ns=" N"; else ns=" S";
  if (long>=0) ew=" W"; else ew=" E";
  
  
  //if (offset>=0) timezoneString="GMT + " + offsetStr + timezoneString; 
  if (offsetStr>=0) timezoneString="GMT + " + offsetStr + timezoneString;
  else  timezoneString="GMT  " + offsetStr + timezoneString;

 
 if (AMPM == 1) AMPM=2;
 
 //title
 text[0] = "<Center><FONT COLOR=black size=+1><B><span class=hebrewTitle align=center>" + lookupTitle(zman) + " " 
 
 if (numDays == 31)
  	text[0] += year  
 else
  	text[0] += hebYear
 
 
 text[0] += "&nbsp;&nbsp;&nbsp;" + locName  
 + "</span><BR></B><FONT COLOR=red size=-1>Latitude: "  + Math.abs(lat) +deg + ns 
 + "  Longitude: "  + Math.abs(long) +deg + ew 
 + "<BR>" + timezoneString 

 if (zman == "hanetz" || zman == "shkia"){
	text[0] += ", "  + hite + " meters above sealevel";
 }
 if (with_refraction == 1 && zman != "alot" && zman != "misheyakir" && zman != "hanetz" && zman != "shkia" && zman != "tzeit"  ){
	text[0] += "<BR>refraction calculated for " + (temp - 273) + "&deg;C ," + pressure + " millibars (Air Pressure)";
 }

 text[0] += "</FONT>"
 
 var strM1 = new Array(numMonths+1); var strM2 = new Array(numMonths+1);
 
	for (month1=1; month1<=numMonths; month1++) {
		month = month1;
		strM1[month1] = new Array(numDays);

		if (numDays == 31){var dIM = daysInM(month,year);} 
		
		if (numDays < 31){
			dIM = hebrew_month_days(hebYear, hebMonth);
			hebMonth++;
			if (hebMonth == (numMonths + 1))
				hebMonth = 1
		}
		
		for (var i=1; i<=numDays; i++) {
			month = myDate.getUTCMonth()+1;
			year =  myDate.getUTCFullYear();
			day = myDate.getUTCDate();

			if (automatic)
				dst = DST(year, month, day);
			month = myDate.getUTCMonth()+1;
			year =  myDate.getUTCFullYear();
			day = myDate.getUTCDate();


			if (i<=dIM) {
				strM1[month1][i]=zmanOf(zman);

				if (myDate.getDay()== 6){
					strM1[month1][i]= "<B>" + strM1[month1][i] + "</B>";
				}
				

				myDate = new Date(Date.parse(myDate) + (86400000)); 

			} 
			else {
				strM1[month1][i]="";
			}
		} 

		
	} 

	for (var i=1; i<=numDays; i++) {
		strB = new Array();
		strB[0] = i;
		for (var j = 1; j <= numMonths; j++){
			strB = strB.concat(strM1[j][i]);
		}
		strArray[i] = strB;
	}
	
 writeYearPage(strArray, numMonths, numDays);
 
 }
}


function writeYearPage(strArray, numMonths, numDays) {
 if (numDays == 31){
    	var monthShortName = new Array('&nbsp;Day&nbsp;','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec');
    	var dir = "";
    }
    
    else{
    	var dir = "dir='rtl'"
   	 if (numMonths == 13) {
   		var monthShortName = new Array('&nbsp;Day&nbsp;', "תשרי", "מרחשון", "כסלו", "טבת", "שבט", "'אדר א", "'אדר ב","ניסן", "אייר", "סיון", "תמוז", "אב", "אלול")
   	 }
   	 else {
   		var monthShortName = new Array('&nbsp;Day&nbsp;', "תשרי", "מרחשון", "כסלו", "טבת", "שבט", "אדר", "ניסן", "אייר", "סיון", "תמוז", "אב", "אלול")
   	 } 
 }
  
  var htmlText="";
  htmlText += "<html><head>"
  htmlText += "<title>Noam Kaplan's Zmanim Chart</title>"
  
  
  htmlText += "<STYLE TYPE='text/css' media='screen'>P,TR,TD{font-size: 12px;font-family:verdana , arial, helvetica, sans-serif;color: black;}SPAN{font-size: 20px;font-family:Times New Roman,  serif;color: black;}.hebrewTitle {cursor:hand;font-family:david,times new roman,serif;font-weight:normal;font-size:150%;color:#000000;}</STYLE>"  
  htmlText += "<STYLE TYPE='text/css' media='print'>P,TR,TD{font-size: 10px;font-family:verdana , arial, helvetica, sans-serif;color: black;}SPAN{font-size: 13px;font-family:Times New Roman,  serif;color: black;}.hebrewTitle {cursor:hand;font-family:david,times new roman,serif;font-weight:normal;font-size:120%;color:#000000;}</STYLE>"
  
  
 
  htmlText += "</head>"
  htmlText += "<body BGCOLOR=#FFFFFF TEXT=#000000 LINK=#0000FF VLINK=#663399 ALINK=#FF0000>"
  htmlText += "<div align=\"center\"><center>"
  htmlText += "<TABLE width=500 border=1 cellpadding=0 cellspacing=0 bordercolor=black " + dir + ">"
 
  htmlText += "<TR>"
  htmlText += "<TD dir='ltr' COLSPAN=" + (numMonths + 1) + ">"
  htmlText += text[0]
  htmlText += "</TD>"
  htmlText += "</TR>"

  htmlText += "<TR>"
 
  htmlText += "<TD>"
  htmlText +="<P ALIGN=center>"
  htmlText +="&nbsp;&nbsp;&nbsp;&nbsp;";
  htmlText += "</TD>"
  
 
for( var j = 0; j<(numMonths-1); j++){
  htmlText += "<TD >"
  htmlText +="<P ALIGN=center>"
  htmlText +="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
  htmlText += "</TD>"
}

 htmlText += "<TD>"
 htmlText +="<P ALIGN=center dir='ltr'><FONT COLOR=red size=-15>©&nbsp;N.&nbsp;Kaplan</FONT>"
 htmlText +="&nbsp;";
 htmlText += "</TD>"	

  htmlText += "</TR>"

  htmlText += "<TR>"
 
 
 
for( var j = 0; j<numMonths+1; j++){	
  htmlText += "<TD bgcolor=#FFFFEE>"
  htmlText +="<P ALIGN=center dir='ltr'>"
  htmlText += monthShortName[j];
  htmlText += "</TD>"
} 
  
  htmlText += "</TR>"


for (var i=1; i<=numDays; i++){
  strB=strArray[i];

  //htmlText += "<TR>"
  htmlText += "<TR " + (i % 2 == 0 ? "bgcolor=#CCCCCC" : "") + ">"

	for (var j = 0; j <numMonths+1 ; j++){
	  //htmlText += "<TD " + (j % 2 == 0 ? "bgcolor=#CCCCCC" : "") + ">"
	  htmlText += "<TD>"
	  htmlText +="<P ALIGN=center dir='ltr'>"
	  htmlText += strB[j] ;
	  if (strB[j] == "" ){htmlText += "&nbsp;";}
	  htmlText += "</TD>"
	}


  htmlText +=  "</TR>"            
}

  htmlText += "</TABLE>"
  htmlText += "</body></html>"

   var a = window.open("")
   a.document.open();
   a.document.write(htmlText);
   a.document.close();

}


function yearShabbat() {
	var hebDayNumber = new Array("", "א'","ב'","ג'","ד'","ה'","ו'","ז'","ח'","ט'","י'","י\"א","י\"ב","י\"ג","י\"ד","ט\"ו","ט\"ז","י\"ז","י\"ח","י\"ט","כ'","כ\"א","כ\"ב","כ\"ג","כ\"ד","כ\"ה","כ\"ו","כ\"ז","כ\"ח","כ\"ט","ל'");

	var numLines = 0;
	var truthBeTold = window.confirm("Do you wish to use DST automatically? OK for yes. Cancel for no.");
	if (truthBeTold) 
	automatic = 1;
	else	
	automatic = 0;

	var deg = String.fromCharCode(176);

	getInput();

	var locName = getLocationName();

	var str11="", str22="";
	var T;

	var timezoneString = "";
	//var offsetStr = offset + 0;
	var offsetStr = timezone;



	if (dst) {
	if (automatic == 0){
		timezoneString = " DST"
	}
	//offsetStr = offset - 1;
	}

	if (lat>=0) ns=" N"; else ns=" S";
	if (long>=0) ew=" W"; else ew=" E";


	//if (offset>=0) timezoneString="GMT + " + offsetStr + timezoneString; 
	if (offsetStr>=0) timezoneString="GMT + " + offsetStr + timezoneString;
	else  timezoneString="GMT  " + offsetStr + timezoneString;


	var strYear = year;
	if (jewish == 1)
		var strYear = hYear



	//title
	text[0] = "<Center><FONT COLOR=black size=+1><B>" + strYear  + "&nbsp;&nbsp;&nbsp;<div class=hebrewTitle align=center>" + locName + "</div>" 
	+ "</B><FONT COLOR=red size=-1>Latitude: "  + Math.abs(lat) +deg + ns 
	+ "  Longitude: "  + Math.abs(long) +deg + ew 
	+ "<BR>" + timezoneString 
	+ ", "  + hite + " meters above sealevel"
  	+ "<BR>Nerot:&nbsp;" + nerot + "&nbsp;minutes&nbsp;before&nbsp;shkia";
  
	  if (with_refraction == 1){
		text[0] += "<BR>refraction calculated for " + (temp - 273) + "&deg;C ," + pressure + " millibars (Air Pressure)";
	  }
 
 	text[0] += "</FONT>"
 
	var htmlText="";
	htmlText += "<html><head>"
	htmlText += "<title>Shabbat Times</title>"
	htmlText += "<STYLE TYPE='text/css' media='screen'>P,TR,TD{font-size: 12px;font-family:verdana , arial, helvetica, sans-serif;color: black;}SPAN{font-size: 15px;font-family:Times New Roman,  serif;color: black;}.hebrewTitle {cursor:hand;font-family:david,times new roman,serif;font-weight:normal;font-size:150%;color:#000000;}</STYLE>"  
	htmlText += "<STYLE TYPE='text/css' media='print'>P,TR,TD{font-size: 10px;font-family:verdana , arial, helvetica, sans-serif;color: black;}SPAN{font-size: 13px;font-family:Times New Roman,  serif;color: black;}.hebrewTitle {cursor:hand;font-family:david,times new roman,serif;font-weight:normal;font-size:120%;color:#000000;}</STYLE>"  
	// htmlText += "<STYLE TYPE='text/css' media='print'> DIV.page {	MARGIN: 10% 0%; WRITING-MODE: tb-rl; HEIGHT: 80% } DIV.page TABLE { FILTER: progid:DXImageTransform.Microsoft.BasicImage(Rotation=1); MARGIN-RIGHT: 50pt }</STYLE>"
	htmlText += "</head>"

	htmlText += "<body BGCOLOR=#FFFFFF TEXT=#000000 LINK=#0000FF VLINK=#663399 ALINK=#FF0000>"

	htmlText += "<div class=page align='center'><center>"	
	htmlText += "<TABLE DIR=rtl width=1200 border=0 cellpadding=1 cellspacing=0 bordercolor=Black >"

	htmlText += "<TR>"
	htmlText += "<TD COLSPAN=7>"
	htmlText += text[0] 
	htmlText += "</TD>"
	htmlText += "</TR>"


	htmlText += "<TR>"
	htmlText += "<TD>"
	htmlText +="<P ALIGN=right><FONT COLOR=red size=-5>©&nbsp;N.&nbsp;Kaplan&nbsp;&nbsp;</FONT>"
	htmlText +="&nbsp;";
	htmlText += "</TD>"	

	htmlText += "<TD>"
	htmlText +="<P ALIGN=center><FONT COLOR=red size=-5>&nbsp;&nbsp;&nbsp;&nbsp;</FONT>"
	htmlText +="&nbsp;";
	htmlText += "</TD>"	


	htmlText += "<TR valign=top ><TD>"
 	  
	if (AMPM == 1) AMPM=2; 
	
	var myDate = new Date(year, 0, 1);
	myDate.setHours(12);
	var myEndDate =  new Date(year + 1 , 0, 1); 
	
	if (jewish == 1){
		
		var j = hebrew_to_jd(hYear - 1, 6, 29);
		var date1 = jd_to_gregorian(j);

		year = date1[0];
		month = date1[1];
		day = date1[2];

		var myDate = new Date(year, month-1, day);

		myDate.setHours(12);
		
		j = hebrew_to_jd(hYear + 1, 7, 1);
		date1 = jd_to_gregorian(j);

		year = date1[0];
		month = date1[1];
		day = date1[2];

		var myEndDate = new Date(year, month-1, day);

		myEndDate.setHours(12);
	}
		
		


for( ; Date.parse(myDate) < Date.parse(myEndDate); myDate = new Date(Date.parse(myDate) + (86400000))){  
	var myHebMonth;
	var myHebYear;


	myDate.setHours(12);
	month = myDate.getUTCMonth()+1;
	year =  myDate.getUTCFullYear();
	day = myDate.getUTCDate();

	
	if (automatic)
		dst = DST(year, month, day);
	month = myDate.getUTCMonth()+1;
	year =  myDate.getUTCFullYear();
	day = myDate.getUTCDate();

	
	myDate.setHours(12);
	
	shkia = zmanOf("shkia"); 
	
	var erevMoadim1 = ""
	var myHebDay;
	


	var hebcal = jd_to_hebrew(gregorian_to_jd(myDate.getUTCFullYear(), myDate.getMonth()+1, myDate.getDate()));
	myHebMonth = hebcal[1];
	myHebDay = hebcal[2];
	myHebYear = hebcal[0];

	month = myDate.getUTCMonth()+1;
	year =  myDate.getUTCFullYear();
	day = myDate.getUTCDate();

	
	
	
	if (myDate.getDay()== 6 ){
		myDate = new Date(Date.parse(myDate) - (86400000));
		month = myDate.getUTCMonth()+1;
		year =  myDate.getUTCFullYear();
		day = myDate.getUTCDate();
		shabbat = "<B>" + zmanOf("shabbat") + "</B>" ;
		myDate = new Date(Date.parse(myDate) + (86400000));
		month = myDate.getUTCMonth()+1;
		year =  myDate.getUTCFullYear();
		day = myDate.getUTCDate();
		
	}
 	else { 
 		shabbat = "&nbsp;"
 	}
 	
 	
	
	tzeit = zmanOf("tzeit"); 
	
	
	
	
	if (myDate.getDay()== 6 )
		var torahReading = "</B><span class=hebrewBody align=center>" + getTorahSections(myHebDay, myHebMonth, myHebYear) + "</span><B>";
	else 
		var torahReading = "&nbsp;";
	
	
	
	
	var myMoed = moadim(myHebDay, myHebMonth, myHebYear, diaspora);
	
	
	if (myMoed == "")
		myMoed = "&nbsp;";	
	else{
		myMoed = "</B><span class=hebrewBody align=center>" + myMoed + "</span><B>";	
		
		myDate = new Date(Date.parse(myDate) - (86400000));
		month = myDate.getUTCMonth()+1;
		year =  myDate.getUTCFullYear();
		day = myDate.getUTCDate();
		erevMoadim1 = erevMoadim(myHebDay-1, myHebMonth, myHebYear, diaspora); 
		
		if (erevMoadim1 != ""){
			
			
			shkia = zmanOf("shkia"); 

			if (erevMoadim1 == 1)
				shabbat = "<B>" + zmanOf("shabbat") + "*</B>" ;
			else if (erevMoadim1 == 2 && myDate.getDay()!= 5){
				tzeit = zmanOf("tzeit");
				shabbat = "<B>" + zmanOf("motzai shabbat") + "*</B>" ;
			}

			
		}
		
		
		myDate = new Date(Date.parse(myDate) + (86400000));
		month = myDate.getUTCMonth()+1;
		year =  myDate.getUTCFullYear();
		day = myDate.getUTCDate();
		shkia = zmanOf("shkia");
		tzeit = zmanOf("tzeit");
			
	}
	
	if (torahReading != "&nbsp;")
		myMoed = torahReading + " " + myMoed;
	
	
	myDay = shortMonthName[myDate.getMonth()] + " " +  myDate.getDate();


	if (hebrew_leap(myHebYear)) {
		var hebMonth = new Array("ניסן", "אייר", "סיון", "תמוז", "אב", "אלול", "תשרי", "מרחשון", "כסלו", "טבת", "שבט", "אדר א'", "אדר ב'")
	 }
	 else {
		var hebMonth = new Array("ניסן", "אייר", "סיון", "תמוז", "אב", "אלול", "תשרי", "מרחשון", "כסלו", "טבת", "שבט", "אדר")
	 }   


	var whatDay1 =  "<span class=hebrewBody align=center>" + hebDayNumber[myHebDay] + "&nbsp;" + hebMonth[myHebMonth-1] + "</span>";

	 //strB = new Array(tzeit,shkia ,shabbat, myMoed,myDay,whatDay1);
	 strB = new Array(tzeit, shabbat, myMoed,myDay,whatDay1);
 
 
	if (myDate.getDay()== 6){strB = strB.concat(6);}
	else { strB = strB.concat(1);}
 
 	
 		
	if (strB[1] != "&nbsp;"){
		
		numLines++
		
		if (numLines == 1 || numLines == 33){
			if (numLines == 33){
			htmlText +=  "</Table></TD><TD>"
			}
			htmlText += "<TABLE DIR=ltr width=600 border=1 cellpadding=1 cellspacing=0 bordercolor=Black>"	
			htmlText += "</TR>"	
			htmlText += "<TR>"
			
			htmlText += "<TD bgcolor=#FFFFEE WIDTH=130>"
			htmlText +="<P ALIGN=center><div class=hebrewTitle align=center>מוצאי&nbsp;שבת"
			htmlText += "</div></TD>"

			htmlText += "<TD bgcolor=#FFFFEE WIDTH=130>"
			htmlText +="<P ALIGN=center><div class=hebrewTitle align=center>הדלקת&nbsp;נרות"
			htmlText += "</div></TD>"
			
			htmlText += "<TD bgcolor=#FFFFEE WIDTH=250>"
			htmlText +="<P ALIGN=center><div class=hebrewTitle align=center>"
			htmlText += lookupTitle("parsha");
			htmlText += "</div></TD>"

			htmlText += "<TD bgcolor=#FFFFEE WIDTH=90>"
			htmlText +="<P ALIGN=center><div class=hebrewTitle align=center>"
			htmlText += "Date";
			htmlText += "</div></TD>"

			htmlText += "<TD bgcolor=#FFFFEE WIDTH=100>"
			htmlText +="<P ALIGN=center><div class=hebrewTitle align=center>"
			htmlText +="תאריך";
			htmlText += "</div></TD>"


			htmlText += "</TR>"
		}
		
		
		if(numLines % 2 == 0){
			htmlText += "<TR bgcolor=#CCCCCC>"
		}
		else {
			
			htmlText += "<TR bgcolor=#FFFFFF>"
		}
	
		for(var j = 0; j < 5; j++){
			
			htmlText += "<TD>"
			
			htmlText +="<P ALIGN=center>"
			if (strB[5]== 6){ htmlText += "<B>";}
			
			htmlText +=strB[j];
			if (strB[5]== 6){ htmlText += "</B>";}
			
			htmlText += "</TD>"
		}
	  htmlText +=  "</TR>"    
	  
	  }
	  
	  



 	
	}//for each day 	
 	
 	  htmlText += "</TABLE>"
	  htmlText += "</body></html>"
	  
	  var a = window.open("")
	  a.document.open();
	  a.document.write(htmlText);
	  a.document.close();

 	
}


