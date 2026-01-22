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

function HoursMinutesSeconds(time, roundUp=false) {
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
	const roundUp = true;
	const evening = true;
	//hite = Math.sqrt(hite) * 0.0348 ;
	let hight = Math.acos(6371009 / (6371009 + hite)) * 180 / Math.PI;
	switch (zman) {
		case "alot":
			time = twilightAngle(90 + alotDeg, 0);
			return HoursMinutesSeconds(time, roundUp);
		case "misheyakir":
			time = twilightAngle(90 + misheyakirDeg, 0);
			return HoursMinutesSeconds(time, roundUp);
		case "hanetz":
			time = twilightAngle(90 + (50.0/60.0) + hight, 0);
			return HoursMinutesSeconds(time, roundUp);
		case "shema":
			time = temporalHour(3);
			return HoursMinutesSeconds(time);
		case "tefillah":
			time = temporalHour(4);
			return HoursMinutesSeconds(time);
		case "chatzot":
			time = temporalHour(6);
			return HoursMinutesSeconds(time);
		case "minchag":
			time = temporalHour(6.5);
			return HoursMinutesSeconds(time, roundUp);
		case "minchak":
			time = temporalHour(9.5);
			return HoursMinutesSeconds(time, roundUp);
		case "plag":
			time = temporalHour(10.75);
			return HoursMinutesSeconds(time);
		case "shkia":
			time = twilightAngle(90 + (50.0/60.0) + hight, evening);
			return HoursMinutesSeconds(time);
		case "tzeit":
			time = twilightAngle(90 + tzeitDeg, 12);
			return HoursMinutesSeconds(time, roundUp);
		case "shabbat":
			sunset = twilightAngle(90 + (50.0/60.0) + hight, evening);
			return HoursMinutesSeconds(sunset - (nerot/60));
		case "motzai shabbat":
			tzeit = twilightAngle(90 + tzeitDeg, 12);
			return HoursMinutesSeconds(tzeit + (10/60), roundUp);
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

function buildDailyTable(cols=3) {
	const tableRow = document.getElementById("daily-table-row");
	const perCol = Math.ceil(zmanimIDs.length / cols);
	for(let col=0; col<cols; col++) {
		const td = document.createElement("td");
		td.setAttribute("VALIGN", "TOP");
		const innerTable = document.createElement("table");
		innerTable.setAttribute("BORDER", "0");
		const end = Math.min((col+1)*perCol, zmanimIDs.length);
		for (let i = col*perCol; i < end; i++) {
			const tr = document.createElement("tr");
			const tdTitle = document.createElement("td");
			tdTitle.innerHTML = lookupTitle(zmanimIDs[i]);
			tr.appendChild(tdTitle);
			const tdInput = document.createElement("td");
			const input = document.createElement("input");
			input.type = "text";
			input.size = 9;
			input.maxLength = 80;
			input.readOnly = true;
			input.name = zmanimIDs[i];
			tdInput.appendChild(input);
			tr.appendChild(tdInput);
			innerTable.appendChild(tr);
		}
		td.appendChild(innerTable);
		tableRow.appendChild(td);
	}
}


function getInput(){
	readGregorian();
	
	const hebrew = document.hebrew;
	hDay = Number(hebrew.day.value);
	hMonth = Number(hebrew.month.value);
	hYear = Number(hebrew.year.value);

	jewish = document.myform.jewish.checked;
	
	const inputs = document.myform1;
	lat = Number(inputs.latitude.value);
	long = Number(inputs.longitude.value);
	
	if (inputs.NorthSouth.selectedIndex==0) lat=Math.abs(lat);
		else lat=-Math.abs(lat);
	if (inputs.EastWest.selectedIndex==0) long=-Math.abs(long);
		else  long=Math.abs(long);
	
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
	const daily = document.myform1;
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
	let dayOfWeek = DOW(day, month, year);
	let erevMoad = erevMoadim(dayOfWeek, hMonth, hDay);
	if (dayOfWeek == 6) {
		daily.shabbat.value = zmanOf("shabbat");
	} else if (erevMoad == 1) {
		daily.shabbat.value = zmanOf("shabbat") + "*";
	} else {
		daily.shabbat.value = "";
	}
	daily.tzeit.value = zmanOf("tzeit");
	if (erevMoad == 2)
		daily.shabbat.value = "*" + zmanOf("motzai shabbat") + "*";
}

function table() {

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
 
 
 
 
 
 if (AMPM == 1) AMPM=2;

 var dIM = daysInM(month,year);
 var strMonthYear = monthName[month-1] + " " + year
 var myDate = new Date(year, month-1, 1);
 myDate.setHours(12);
  

 var myHebMonth;
 var myHebYear;
 var myFlag = false;
 var myMonth = "";
 
 if (jewish == 1){
 	myMonth = shortMonthName[month-1] + "";
 	var myMonthNum = month-1;
  	var j = hebrew_to_jd(hYear, hMonth, 1);
 	var date1 = jd_to_gregorian(j);
 	
 	year = date1[0];
 	month = date1[1];
 	day = date1[2];
 
  	var myDate = new Date(year, month-1, day);
 	 
 	myDate.setHours(12);
 	
 	//  Update Hebrew Calendar
 	hebcal = jd_to_hebrew(j);
 	
 	myHebMonth = hebcal[1];
 	myHebYear = hebcal[0];
 	
 	if (hebrew_leap(myHebYear)) {
 	 	var hebMonth = new Array("ניסן", "אייר", "סיון", "תמוז", "אב", "אלול", "תשרי", "מרחשון", "כסלו", "טבת", "שבט", "אדר א'", "אדר ב'")
 	 }
 	 else {
 	 	var hebMonth = new Array("ניסן", "אייר", "סיון", "תמוז", "אב", "אלול", "תשרי", "מרחשון", "כסלו", "טבת", "שבט", "אדר")
 	 }   
  	
  	var whatHebMonth = hebMonth[myHebMonth-1];
  	strMonthYear = "<span class=hebrewTitle align=center>" + whatHebMonth + "</span> ";
  	strMonthYear +=  myHebYear ;
  }
 
 //title
 text[0] = "<Center><FONT COLOR=black size=+1><B>" + strMonthYear  + "&nbsp;&nbsp;&nbsp;<div class=hebrewTitle align=center>" + locName + "</div>" 
 + "</B><FONT COLOR=red size=-1>Latitude: "  + Math.abs(lat) +deg + ns 
 + "  Longitude: "  + Math.abs(long) +deg + ew 
 + "<BR>" + timezoneString 
 + ", "  + hite + " meters above sealevel";
 
 if (with_refraction == 1){
 	text[0] += "<BR>refraction calculated for " + (temp - 273) + "&deg;C ," + pressure + " millibars (Air Pressure)";
 }

 text[0] += "</FONT>"

if (jewish == 1){
	
	var dayOfWeek = new Array("ראשון","שני","שלישי","רביעי","חמישי","שישי","שבת");
	dIM = hebrew_month_days(myHebYear, myHebMonth);
}
else 
	var dayOfWeek = new Array("Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sha");
	



for (var i=1; i<=dIM; i++) {

	month = myDate.getUTCMonth()+1;
	year =  myDate.getUTCFullYear();
	day = myDate.getUTCDate();

	
	if (automatic)
		dst = DST(year, month, day);
	month = myDate.getUTCMonth()+1;
	year =  myDate.getUTCFullYear();
	day = myDate.getUTCDate();

	
	myDate.setHours(12);
	
	alot = zmanOf("alot");
	misheyakir = zmanOf("misheyakir");
	hanetz = zmanOf("hanetz");
	shema = zmanOf("shema");
	tefillah = zmanOf("tefillah");
	chatzot = zmanOf("chatzot");
	minchag = zmanOf("minchag");
	minchak = zmanOf("minchak");
	plag = zmanOf("plag");

	shkia = zmanOf("shkia"); 
	
	var erevMoadim1 = ""
	var myHebDay;
	
	
	if (jewish == 1){
		myHebDay = i;
	}
	else {
		var hebcal = jd_to_hebrew(gregorian_to_jd(myDate.getUTCFullYear(), myDate.getMonth()+1, myDate.getDate()));
		myHebMonth = hebcal[1];
		myHebDay = hebcal[2];
		myHebYear = hebcal[0];
		
		month = myDate.getUTCMonth()+1;
		year =  myDate.getUTCFullYear();
		day = myDate.getUTCDate();
	}
	
	erevMoadim1 = erevMoadim(myDate.getDay()+1, myHebMonth, myHebDay); 
	
	
	if (myDate.getDay()== 5 ){
		shabbat = "<B>" + zmanOf("shabbat") + "</B>" ;
	}
	else if (erevMoadim1 == 1)
		shabbat = "<B>" + zmanOf("shabbat") + "*</B>" ;
 	else { 
 		shabbat = "&nbsp;"
 	}
 	
 	
	
	tzeit = zmanOf("tzeit"); 
	
	if (erevMoadim1 == 2 && myDate.getDay()!= 5){
		shabbat = "<B>" + zmanOf("motzai shabbat") + "*</B>" ;
	}
	
	
	
	if (myDate.getDay()== 6 )
		var torahReading = "</B><span class=hebrewBody align=center>" + getTorahSections(myHebDay, myHebMonth, myHebYear) + "</span><B>";
	else 
		var torahReading = "&nbsp;";
	
	
	
	
	var myMoed = moadim(myHebDay, myHebMonth, myHebYear);
	
	
	if (myMoed != "")
		myMoed = "</B><span class=hebrewBody align=center>" + myMoed + "</span><B>";
	else
		myMoed = "&nbsp;";
	
	if (torahReading != "&nbsp;")
		myMoed = torahReading + " " + myMoed;
	
	
	if (jewish == 1){
		if ((shortMonthName[myDate.getMonth()] != myMonth) && (myFlag == false)){
			myFlag = true;
			if (myMonthNum < myDate.getMonth()){
				myMonth = myMonth + "/<BR>" + shortMonthName[myDate.getMonth()] ;}
			else{
				myMonth = shortMonthName[myDate.getMonth()] + "/<BR>" + myMonth ;}
		}
		
		myDay =  "" +  myDate.getDate();
			
	}
	else {
		
		if (myFlag == false){
			
			if (hebrew_leap(myHebYear)) {
				var hebMonth = new Array("ניסן", "אייר", "סיון", "תמוז", "אב", "אלול", "תשרי", "מרחשון", "כסלו", "טבת", "שבט", "אדר א'", "אדר ב'")
			 }
			 else {
				var hebMonth = new Array("ניסן", "אייר", "סיון", "תמוז", "אב", "אלול", "תשרי", "מרחשון", "כסלו", "טבת", "שבט", "אדר")
			 }   
			
			if (myMonth == "")
				myMonth = "" + hebMonth[myHebMonth-1];
			
			if (hebMonth[myHebMonth-1] != myMonth){
				myFlag = true;
				myMonth += "/<BR>" + hebMonth[myHebMonth-1];
			}
				
			
		}
		
		myDay =  "" + myHebDay;
		
	}
 	
 	var myDayofWeek = dayOfWeek[myDate.getDay()];
 	
 strB = new Array(tzeit,shkia ,shabbat, plag ,minchak ,minchag ,chatzot ,tefillah ,shema ,hanetz ,misheyakir ,alot ,myMoed,myDay,myDayofWeek,i);
 
 

 if (myDate.getDay()== 6){strB = strB.concat(6);}
 else { strB = strB.concat(1);}
 
 strArray[i] = strB;
 myDate = new Date(Date.parse(myDate) + (86400000));

} // for day

 //if (what==2) 
 	text[1] = myMonth ;
 	
 	writeMonthPage(strArray,dIM);
 	
}


function writeMonthPage(strArray,dIM) {


  var htmlText="";
  htmlText += "<html><head>"
  htmlText += "<title>Monthly Zmanim</title>"
  htmlText += "<STYLE TYPE='text/css' media='screen'>P,TR,TD{font-size: 12px;font-family:verdana , arial, helvetica, sans-serif;color: black;}SPAN{font-size: 15px;font-family:Times New Roman,  serif;color: black;}.hebrewTitle {cursor:hand;font-family:david,times new roman,serif;font-weight:normal;font-size:150%;color:#000000;}</STYLE>"  
  htmlText += "<STYLE TYPE='text/css' media='print'>P,TR,TD{font-size: 10px;font-family:verdana , arial, helvetica, sans-serif;color: black;}SPAN{font-size: 13px;font-family:Times New Roman,  serif;color: black;}.hebrewTitle {cursor:hand;font-family:david,times new roman,serif;font-weight:normal;font-size:120%;color:#000000;}</STYLE>"  
  //htmlText += "<STYLE TYPE='text/css' media='print'> DIV.page {	MARGIN: 10% 0%; WRITING-MODE: tb-rl; HEIGHT: 80% } DIV.page TABLE { FILTER: progid:DXImageTransform.Microsoft.BasicImage(Rotation=1); MARGIN-RIGHT: 50pt }</STYLE>"
  htmlText += "</head>"

  htmlText += "<body BGCOLOR=#FFFFFF TEXT=#000000 LINK=#0000FF VLINK=#663399 ALINK=#FF0000>"

  htmlText += "<div class=page align=\"center\"><center>"

  htmlText += "<TABLE width=700 border=1 cellpadding=1 cellspacing=0 bordercolor=Black>"

  htmlText += "<TR>"
  htmlText += "<TD COLSPAN=16>"
  htmlText += text[0] 
  htmlText += "</TD>"
  htmlText += "</TR>"

 
htmlText += "<TR>"
 htmlText += "<TD>"
   htmlText +="<P ALIGN=center><FONT COLOR=red size=-5>©&nbsp;N.&nbsp;Kaplan&nbsp;&nbsp;</FONT>"
   htmlText +="&nbsp;";
   htmlText += "</TD>"	
  
  
for( var j = 0; j<11; j++){
  htmlText += "<TD >"
  htmlText +="<P ALIGN=center>"
  htmlText +="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
  htmlText += "</TD>"
}

  htmlText += "<TD >"
  htmlText +="<P ALIGN=center>"
  htmlText +="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
  htmlText += "</TD>"

for( var j = 0; j<3; j++){  
  htmlText += "<TD>"
  htmlText +="<P ALIGN=center>"
  htmlText +="&nbsp;";
  htmlText += "</TD>"	
}  
  htmlText += "</TR>"	
  
  
 htmlText += "<TR>"
 
 var whatTitle = new Array("parsha","alot", "misheyakir", "hanetz", "shema", "tefillah", "chatzot", "minchag", "minchak", "plag", "shabbat", "shkia", "tzeit")

 
 for( var j = 12; j>=0; j--){
	 
	 htmlText += "<TD bgcolor=#FFFFEE>"
	 htmlText +="<P ALIGN=center><div class=hebrewTitle align=center>"
	 htmlText += hebrewTitle(whatTitle[j]);
	 htmlText += "</div></TD>"
}

	htmlText += "<TD bgcolor=#CCCCCC>"
	htmlText +="<P ALIGN=center>"
	htmlText +=text[1];
	htmlText += "</TD>"

	htmlText += "<TD bgcolor=#CCCCCC>"
	htmlText +="<P ALIGN=center>"
	htmlText +="&nbsp;Day&nbsp;";
	htmlText += "</TD>"
	
	htmlText += "<TD bgcolor=#CCCCCC>"
	htmlText +="<P ALIGN=center>"
	htmlText +="D";
	htmlText += "</TD>"


  htmlText += "</TR>"


  var std;
  for (var i=1; i<=dIM; i++)
  {
	strB=strArray[i];
	
	if(i % 2 == 0){
		htmlText += "<TR bgcolor=#CCCCCC>"
	}
	else {
		
		htmlText += "<TR bgcolor=#FFFFFF>"
	}

	for(var j = 0; j < 16; j++){
		htmlText += "<TD>"
		
		htmlText +="<P ALIGN=center>"
		if (strB[16]== 6){ htmlText += "<B>";}
		
		htmlText +=strB[j];
		if (strB[16]== 6){ htmlText += "</B>";}
		
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
 text[0] = "<Center><FONT COLOR=black size=+1><B><span class=hebrewTitle align=center>" + hebrewTitle(zman) + " " 
 
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
	
	
	
	
	var myMoed = moadim(myHebDay, myHebMonth, myHebYear);
	
	
	if (myMoed == "")
		myMoed = "&nbsp;";	
	else{
		myMoed = "</B><span class=hebrewBody align=center>" + myMoed + "</span><B>";	
		
		myDate = new Date(Date.parse(myDate) - (86400000));
		month = myDate.getUTCMonth()+1;
		year =  myDate.getUTCFullYear();
		day = myDate.getUTCDate();
		erevMoadim1 = erevMoadim(myDate.getDay()+1, myHebMonth, myHebDay-1); 
		
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
			htmlText += hebrewTitle("parsha");
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


