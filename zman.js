/*
 JavaScript Temporal Hour Calculator
*/


var month, day, year, a, sun_time, automatic, jewish;
var offset, offsetCorrection, lat, longitude,AMPM, hite, roundUpOrDown, showSeconds, nerot , diaspora;

var eqtime, declin, with_refraction, pressure, temp;
var dst = 0;


var strArray = new Array(31);
//var strArray1 = new Array(1000);
//var counter1 = 0;
var text = new Array(8);
var monthName = new Array('January','February','March','April','May','June','July','August','September','October','November','December');
var shortMonthName = new Array('Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec');

function makeArray() {
	this[0] = makeArray.arguments.length;
	for (i = 0; i < makeArray.arguments.length; i = i + 1)
		this[i+1] = makeArray.arguments[i];
}


function cot(x) {
	var K=Math.PI/180;
	x = Math.tan(x*K)
	x = 1/x;
	x = x/K
	return x
}

function computeAltitude(declin, lat, ha) {	
 var K = Math.PI/180.0;
 var lat_K = lat*K;
 var dec_K = declin*K;
 
 sinHeight =Math.sin(dec_K)*Math.sin(lat_K) + Math.cos(dec_K)*Math.cos(lat_K)*Math.cos(K*ha);	
 return Math.asin(sinHeight)/K;
 
}

function computeAzimut(declin, lat, ha, altitude) {	
	var K = Math.PI/180.0;
	var cosAz, Az,nenner;
	var lat_K = lat*K;
	var altitude_K = altitude*K;		
	nenner = Math.cos(altitude_K)*Math.cos(lat_K);	
		cosAz = (Math.sin(declin*K) - Math.sin(lat_K)*Math.sin(altitude_K))/nenner;					
	Az = Math.PI/2.0 - Math.asin(cosAz);
	Az = Az/K;
	if (Math.sin(K*ha) <= 0) Az = Az;	
	else Az = 360.0 - Az;			
	return Az;
}


function hourAngleTwillight(tl, MornOrEve) {
	
	var K=Math.PI/180;
	
	temporal(temporalToLocal(MornOrEve),2);
	
	
	
	hars = Math.cos(K*tl)/(Math.cos(K*lat)*Math.cos(K*declin)) - Math.tan(K*lat)*Math.tan(K*declin);
	hars = Math.acos(hars)/K;
	
	
	
	// morning and evening (local time)
	if (MornOrEve == 0)
		sun_time = longitude-hars;
	else 
		sun_time = longitude+hars;
	
	
	sun_time = 720 + 4*(sun_time) - eqtime;
	sun_time = sun_time/60 + offset;
	

	sun_time -= offsetCorrection;
	
	return HoursMinutesSeconds(sun_time);
	
}



function frac(X) {
	X = X - Math.floor(X);
	if (X<0) X = X + 1.0;
	return X;		
}




function HoursMinutesSeconds(time) {
	
	time += dst;
	
	if (time >= 24)
		time -= 24;
	
		
	var timeFormat = ""
		
	var h = Math.floor(time);
	
	
	var min = Math.floor(60.0*frac(time));
	var sec = Math.round(60.0*frac(60.0*frac(time)));
	


	if (sec == 60){min += 1;sec = 0;}
	if (min == 60){h += 1;	min = 0; }
	
	if (showSeconds == 0){
		if (roundUpOrDown == 1){
			if(sec > 0){
				min++
				if (min == 60){h += 1;	min = 0; }
			}
		}
	}
	
	if (AMPM == 1){
		timeFormat = " AM"
		
		if (h >= 12){
			if(h>12)
				h = h - 12;
			timeFormat = " PM";
		}
	}
	
	if (AMPM == 2){
		timeFormat = "&nbsp;AM"

		if (h >= 12){
			if(h>12)
				h = h - 12;
			timeFormat = "&nbsp;PM";
		}
	}
	
	
	if (h == 0)
		h = 12;
		
	var str=h+":";

	if (min>=10) str=str+min;
	else  str=str+"0"+min;
	
	
	if (showSeconds == 1){
		str = str + ":";

		if (sec>=10) str=str+sec;
		else  str=str+"0"+sec;
	
	}

	//return " " + str + AMPM;
	return " " + str + timeFormat ;
}



function JulDay (d, m, y, u){
	if (y<1900) y=y+1900
	if (m<=2) {m=m+12; y=y-1}
	A = Math.floor(y/100);
	JD =  Math.floor(365.25*(y+4716)) + Math.floor(30.6001*(m+1)) + d - 13 -1524.5 + u/24.0;
	return JD
}




function temporalToLocal(temporalHour) {	
	
	// equation of time (in minutes)
	var rjd = JulDay (day , month, year, 7 + temporalHour)
	var t = calcTimeJulianCent(rjd);
	eqtime = calcEquationOfTime(t)
	// declination (in degrees)
	declin = calcSunDeclination(t);
	var K=Math.PI/180;
	var s = 0 - Math.tan(K*lat) * Math.tan(K*declin);
	s = Math.acos(s)/K
	//Hour angle
	var ha = ( temporalHour - 6 ) * s / 6
	// time offset (in minutes)
	var time_offset = eqtime - 4*longitude - 60*offset;
	//True Solar Time (in minutes)
	var tst = ha*4 + 720;
	var localTime = tst - time_offset;
	
	return (localTime/60);
}


function temporal(localTime, withRefraction) {
	
	
	var hours = Math.floor(localTime);
	var minutes = Math.floor(60.0*frac(localTime));
	var seconds = Math.round(60.0*frac(60.0*frac(localTime)));

	if (seconds == 60){minutes += 1;seconds = 0;}
	if (minutes == 60){hours += 1;	minutes = 0; }

	
	// equation of time (in minutes)
	var myDate = new Date(year, month-1, day, hours, minutes, seconds);
	var rjd = JulDay (myDate.getUTCDate() , myDate.getUTCMonth()+1, myDate.getUTCFullYear(), myDate.getUTCHours() + minutes/60 + seconds/3600)
	var t = calcTimeJulianCent(rjd);
	eqtime = calcEquationOfTime(t)
	// declination (in degrees)
	declin = calcSunDeclination(t);
	var localDeclin = declin + 0;
	// time offset (in minutes)
	var time_offset = eqtime - 4*longitude - 60*offset;
	// true solar time (in hours)
	var tst = hours*60 + minutes + (seconds/60) + time_offset;
	// solar hour angle (in degrees)
	var ha = tst/4 - 180;
	
	if (ha < -180) 
	{	  
	  ha += 360.0;
	  //alert(ha);
	}
	
	
	var K=Math.PI/180.0;
	var L = 180.0/Math.PI
	
	var lat_Rad = degToRad(lat);
	
	if(withRefraction==1){
		//var azimuth = computeAzimut(declin, lat, ha, altitude);
		//var altitude = computeAltitude(declin, lat, ha);
		
		var declin_Rad = degToRad(declin);
		var ha_Rad = degToRad(ha);
		
		var altitude = (Math.sin(lat_Rad) * Math.sin(declin_Rad)) + (Math.cos(lat_Rad)*Math.cos(declin_Rad)*Math.cos(ha_Rad));
		altitude = radToDeg(Math.asin(altitude));
		altitude_Rad = degToRad(altitude);
		
		
		 /*
		var apparent_altitude = altitude + (10.3/(altitude+5.11))
		apparent_altitude = (Math.tan(degToRad(apparent_altitude)));
		apparent_altitude = 1.02/apparent_altitude 
		apparent_altitude *= (pressure / 1010) * (283 / temp);
		
		 */
				
				
		
		
		
		// /*
		var apparent_altitude = altitude + (10.3/(altitude+5.11))
		apparent_altitude = (Math.tan(degToRad(apparent_altitude)));
		apparent_altitude = 1/apparent_altitude + .00189
		apparent_altitude = .017 * apparent_altitude;
		apparent_altitude *= (pressure / 1010) * (283 / temp);
		apparent_altitude = radToDeg(Math.asin(apparent_altitude));
		// */

		apparent_altitude = altitude + (apparent_altitude / 60);
		
		//var apparent_altitude = altitude + 0.0
		
		var apparent_altitude_Rad = degToRad(apparent_altitude);
		
		//var azimuth = (Math.cos(declin_Rad)*Math.sin(ha_Rad))/Math.cos(altitude_Rad);
		//azimuth = radToDeg(Math.asin(azimuth)) 
		var azimuth = radToDeg(Math.atan(Math.sin(ha_Rad)/((Math.sin(lat_Rad)*Math.cos(ha_Rad))-(Math.tan(declin_Rad)*Math.cos(lat_Rad)))));
			
		if (ha < 0){
			if (azimuth > 0){azimuth -= 180;}
		}
		else {
			if (azimuth < 0) {azimuth += 180;}
		}

		
		var azimuth_Rad = degToRad(azimuth) ;
		
		var newDeclin = Math.sin(lat_Rad) * Math.sin(apparent_altitude_Rad)
		newDeclin -= (Math.cos(lat_Rad)*Math.cos(apparent_altitude_Rad)*Math.cos(azimuth_Rad))
		newDeclin = Math.asin(newDeclin);
		
		var newHa = radToDeg(Math.asin(Math.cos(apparent_altitude_Rad)*Math.sin(azimuth_Rad)/Math.cos(newDeclin)));
		newDeclin = radToDeg(newDeclin);
		
		localDeclin = newDeclin + 0.0;
		
		//alert(HoursMinutesSeconds(newHa - ha));
		
		ha = newHa + 0.0;
		
	}
	
	
	var s = 0 - Math.tan(lat_Rad) * Math.tan(degToRad(localDeclin));
	s = radToDeg(Math.acos(s));
	
	
	if (ha < -s) {
		var stemporal = (6.0 * (360.0 + ha - s)) / (180.0 - s)
	}
	else {
		if (ha >= s){
			var stemporal = (6.0 * (ha - s)) / (180.0 - s)
		}
		else {
			var stemporal = (6.0 * (ha + s)) / s
		}
	}
	
	
	/*
	if(declin - newDeclin > 1 || declin - newDeclin < -1){
		if(withRefraction==1){
			counter1++
			strB = new Array(stemporal,declin ,newDeclin ,ha, newHa,azimuth ,altitude ,apparent_altitude);
 			strArray1[counter1] = strB;
		}
	}
	*/
	
	return (stemporal);
}



function getAccurate(temporalHour, localTime){
	//localTime -= 0.0055555555555555555555555555555556; //20 seconds
	//localTime -= 0.016666666666666666666666666666667 //1 minute
	
	localTime -= 0.5 //1 minute
	for (var i = 0; i < 20000000; i++){
		localTime += .00027777777777777777777777777777778;
		temp1 = temporal(localTime, with_refraction);
		temp1 = Math.floor(temp1*10000);
		temp2 = Math.floor(temporalHour*10000);
		if (temp2 <= temp1){
			if (temp2 < temp1) localTime -= .00027777777777777777777777777777778;
			break;
		}
	}
	

	localTime -= offsetCorrection;
	return HoursMinutesSeconds(localTime);
}


Math.toDegrees = Function("radians" , "{ return radians/(Math.PI/180);}");

function getInput(){
	month = Number(document.myform.month.value);
	day = Number(document.myform.day.value);
	year = Number(document.myform.year.value);
	
	lat = Number(document.myform1.latitude.value);
	longitude = Number(document.myform1.longitude.value);
	
	if (document.myform1.NorthSouth.selectedIndex==0) lat=Math.abs(lat);
		else lat=-Math.abs(lat);
	if (document.myform1.EastWest.selectedIndex==0) longitude=-Math.abs(longitude);
		else  longitude=Math.abs(longitude);

	
	offset = (document.myform1.EastWest.selectedIndex==0 ? Math.round(Math.abs(longitude)/15) : -Math.round(Math.abs(longitude)/15));
	
	offsetCorrection = offset - Number(document.myform1.timezone.value);
	
	hite = Number(document.myform1.hite.value);
	//hite = Math.sqrt(hite) * 0.0348 ;
	hite = Math.toDegrees(Math.acos(6371009 / (6371009 + hite)));
	
	
	
	showSeconds = Number(document.myform1.seconds.checked);
	
	jewish = Number(document.myform.jewish.checked);
	
	with_refraction = Number(document.myform1.refraction.checked)+0;
	
	pressure = Number(document.myform1.pressure.value);
	//temp = 273.15 + Number(document.myform1.temp.value);
	temp = 273 + Number(document.myform1.temp.value);
	
	nerot = Number(document.myform1.nerot.value);
	
	//diaspora = document.myform1.diaspora.checked;
	
	dst = document.myform1.dst.checked;	
	
	
}


function calculate(){

	getInput();
	
	//counter1 = 0;
	
	for (var i = 0; i < document.myform1.ampm.length; i++) {
	   if (document.myform1.ampm[i].checked == "1")
		 AMPM = Number(document.myform1.ampm[i].value);
	}
	
	
	
	roundUpOrDown = 1;
	document.myform1.alot.value = hourAngleTwillight(108, 0);
	document.myform1.misheyakir.value = hourAngleTwillight(101, 0);
	document.myform1.hanetz.value = hourAngleTwillight(90 + (50.0/60.0) +hite, 0);
	roundUpOrDown = 2;
	document.myform1.shema.value = getAccurate(3, temporalToLocal(3));
	//document.myform1.shema.value = getAccurate(.01, temporalToLocal(.01));
	document.myform1.tefillah.value = getAccurate(4, temporalToLocal(4));
	
	document.myform1.chatzot.value = getAccurate(6, temporalToLocal(6));
	roundUpOrDown = 1;
	document.myform1.minchag.value = getAccurate(6.5, temporalToLocal(6.5));
	document.myform1.minchak.value = getAccurate(9.5, temporalToLocal(9.5));
	roundUpOrDown = 2;
	document.myform1.plag.value = getAccurate(10.75, temporalToLocal(10.75));
	document.myform1.shkia.value = hourAngleTwillight(90 + (50.0/60.0) +hite, 12);
	
	
	var myDate = new Date(year, month-1, day);
  	myDate.setHours(12);
  	
  	
  	var erevMoadim1 = erevMoadim(myDate.getDay()+1 , "getDate", 1);
  	if(myDate.getDay()== 5) {
 		document.myform1.shabbat.value = HoursMinutesSeconds(sun_time - (nerot/60)); 
 	}
 	else if (erevMoadim1 == 1) 
 		document.myform1.shabbat.value = HoursMinutesSeconds(sun_time - (nerot/60)) + "*"; 
 	else {
 		document.myform1.shabbat.value = ""
 	}
 	
	roundUpOrDown = 1;
	document.myform1.tzeit.value = hourAngleTwillight(96, 12);
	
	if (erevMoadim1 == 2)
		document.myform1.shabbat.value = HoursMinutesSeconds(sun_time + (10/60)) + "*"; 
	
	
	
	calcGregorian();
	
	document.hebrew.holidays.value = moadim(myDate.getDay()+1, document.hebrew.month.value, document.hebrew.day.value, document.hebrew.year.value);
	
	if(myDate.getDay()== 6) {
		if (document.hebrew.holidays.value != "")
			document.hebrew.holidays.value += " ";
			
		document.hebrew.holidays.value += getTorahSections(document.hebrew.day.value, document.hebrew.month.value, document.hebrew.year.value);
	}
	
	
	for(var i = 10; i < document.myform1.length; i++){
		if (document.myform1.elements[i].value.toString().lastIndexOf('N')>0){
			document.myform1.elements[i].value=" --:--";
		}
	}
	
	//writeResults();
	
	
}

function writeResults(){


	var htmlText="";
	htmlText += "<html><head>"
	htmlText += "<title>Results Table</title>"
	htmlText += "</head>"

	htmlText += "<body BGCOLOR=#FFFFFF TEXT=#000000 LINK=#0000FF VLINK=#663399 ALINK=#FF0000>"

	htmlText += "<div align=\"center\"><center>"

	htmlText += "<TABLE width=700 border=1 cellpadding=1 cellspacing=0 bordercolor=Black>"

	  htmlText += "<TR>"
	  htmlText += "<TD COLSPAN=14>"
	  htmlText += "<FONT COLOR=red size=+1><P ALIGN=center>" + month + "/" + day + "/" + year  + " Latitude = " + lat + "</FONT>"
	  htmlText += "</TD>"
	  htmlText += "</TR>"





	 htmlText += "<TR>"

	 var whatTitle = new Array("Temporal&nbsp;Hour","Declination", "New&nbsp;Declination", "Hour&nbsp;Angle", "New&nbsp;Hour&nbsp;Angle", "Azimuth", "Altitude","Apparent&nbsp;Altitude")

	  for( var j = 0; j<8; j++){

		 htmlText += "<TD bgcolor=#CCCCCC>"
		 htmlText +="<P ALIGN=center>"
		 htmlText += (whatTitle[j]);
		 htmlText += "</TD>"
	 }

	   
	htmlText += "</TR>"

	
	var std;
	  for (var i=1; i<=counter1; i++)
	  {
		strB=strArray1[i];
		
		
		if(i % 2 == 0){
			htmlText += "<TR bgcolor=#CCCCCC>"
		}
		else {
			
			htmlText += "<TR bgcolor=#FFFFFF>"
		}
	
		for(var j = 0; j < 8; j++){
			htmlText += "<TD>"
			
			htmlText +="<P ALIGN=center><FONT size=-1>"
			htmlText +=strB[j];
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

function getLocationName(LatLong) {

 var n=LatLong.length;
 var latStr="", s=0, s1=0, star=0;
 for (var i=0; i<n; i++) {if (LatLong.charAt(i)=='/') {s=i;break}};
 for (var i=s+1; i<n; i++) {if (LatLong.charAt(i)=='/') {s1=i;break}};
 for (var i=s1+1; i<n; i++) {if (LatLong.charAt(i)=='*') {star=i;break}};

 //var latStr = LatLong.substring(0,s);
 //var longStr = LatLong.substring(s+1,s1);
 
 locName = LatLong.substring(star+1,n);
 return locName;
 
}

function getLocation(LatLong) {

 var n=LatLong.length;
 var latStr="", s=0, s1=0, star=0, s2=0;s3=0;s4=0;
 for (var i=0; i<n; i++) {if (LatLong.charAt(i)=='/') {s=i;break}};
 for (var i=s+1; i<n; i++) {if (LatLong.charAt(i)=='/') {s1=i;break}};
 for (var i=s1+1; i<n; i++) {if (LatLong.charAt(i)=='/') {s2=i;break}};
 for (var i=s2+1; i<n; i++) {if (LatLong.charAt(i)=='/') {s3=i;break}};
 for (var i=s3+1; i<n; i++) {if (LatLong.charAt(i)=='/') {s4=i;break}};
 
 for (var i=s4+1; i<n; i++) {if (LatLong.charAt(i)=='*') {star=i;break}};

 var latStr = LatLong.substring(0,s);
 document.myform1.latitude.value=Math.abs(latStr);
 lat = Number(latStr);
 if (lat>=0) {ns=" N";  document.myform1.NorthSouth.options[0].selected=true;}
 else {ns=" S"; document.myform1.NorthSouth.options[1].selected=true;}

 var longStr = LatLong.substring(s+1,s1);
 document.myform1.longitude.value=Math.abs(longStr);
 longit = Number(longStr);
 if (longit<=0) {ew=" E"; document.myform1.EastWest.options[0].selected=true;}
 else {ew=" W"; document.myform1.EastWest.options[1].selected=true;}
 var tzString = LatLong.substring(s1+1,s2);
 locOffset=Number(tzString);
 
 
 
 var nn=2*locOffset;
 if (locOffset>0) nn=nn-1;
 document.myform1.timezone.options[Math.abs(nn)].selected=true;

 var ht = LatLong.substring(s2+1,s3);
 
 document.myform1.hite.value=Number(ht);
 
 nerot = LatLong.substring(s3+1,s4);
 document.myform1.nerot.value = Number(nerot);

 diaspora = LatLong.substring(s4+1,star);
 document.myform1.diaspora.checked = Number(diaspora);


 locName = LatLong.substring(star+1,n);

 calculate();
 //calculate();
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

function table(what) {

var truthBeTold = window.confirm("Do you wish to use DST automatically? OK for yes. Cancel for no.");
if (truthBeTold) 
	automatic = 1;
else	
	automatic = 0;

var deg = String.fromCharCode(176);

getInput();

var locName = getLocationName(document.myform1.location.options[document.myform1.location.selectedIndex].value);

 var str11="", str22="";
 var T;

 var timezoneString = "";
  //var offsetStr = offset + 0;
  var offsetStr = Number(document.myform1.timezone.value) + 0;
   
 
  
   if (document.myform1.dst.checked) {
   	if (automatic == 0){
   		timezoneString = " DST"
   	}
   	//offsetStr = offset - 1;
   }
  
   if (lat>=0) ns=" N"; else ns=" S";
   if (longitude>=0) ew=" W"; else ew=" E";
   
   
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
  	var date1;
 	var j = new Number(hebrew_to_jd((new Number(document.hebrew.year.value)), document.hebrew.month.value, 1));
 	date1 = jd_to_gregorian(j);
 	
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
 + "  Longitude: "  + Math.abs(longitude) +deg + ew 
 + "<BR>" + timezoneString 
 + ", "  + document.myform1.hite.value + " meters above sealevel";
 
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

	
	if (automatic == 1){
					dst = 0;
	
	if(diaspora==1){
		if (month > 3 && month < 11)
			dst = 1;
		else {
			if (month == 3 && day >= NthDOW(2, 1, 3, year))
				dst = 1;
			else if (month == 11 && day < NthDOW(1, 1, 11, year))
				dst = 1;
		}
	}
		//for new zealand dst
	else if (diaspora==2){
					
			dst = 0;

			if (month > 9 || month < 4){
				dst = 1;
			}

			else {
				if (month == 9 && day >= NthDOW(0, 1, 9, year))
					dst = 1;
				else if (month == 4 && day < NthDOW(1, 1, 4, year))
					dst = 1;
			}
	}

	else {
		if (month > 3 && month < 10)
			dst = 1;
		else {
			if (month == 3 && day >= NthDOW(0, 6, 3, year))
				dst = 1;
			else if (month == 10 && day < NthDOW(0, 1, 10, year))
				dst = 1;
		}
		
		
	}
	
	}
	month = myDate.getUTCMonth()+1;
	year =  myDate.getUTCFullYear();
	day = myDate.getUTCDate();

	
	myDate.setHours(12);
	
	roundUpOrDown = 1;
	alot = hourAngleTwillight(108, 0);
	misheyakir = hourAngleTwillight(101, 0);
	hanetz = hourAngleTwillight(90 + (50.0/60.0) +hite, 0);
	roundUpOrDown = 2;
	shema = getAccurate(3, temporalToLocal(3));
	tefillah = getAccurate(4, temporalToLocal(4));
	chatzot = getAccurate(6, temporalToLocal(6));
	roundUpOrDown = 1;
	minchag = getAccurate(6.5, temporalToLocal(6.5));
	minchak = getAccurate(9.5, temporalToLocal(9.5));
	roundUpOrDown = 2;
	plag = getAccurate(10.75, temporalToLocal(10.75));
	
	shkia = hourAngleTwillight(90 + (50.0/60.0) +hite, 12); 
	
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
		shabbat = "<B>" + HoursMinutesSeconds(sun_time - (nerot/60)) + "</B>" ;
	}
	else if (erevMoadim1 == 1)
		shabbat = "<B>" + HoursMinutesSeconds(sun_time - (nerot/60)) + "*</B>" ;
 	else { 
 		shabbat = "&nbsp;"
 	}
 	
 	
	
	roundUpOrDown = 1;
	tzeit = hourAngleTwillight(96, 12); 
	
	if (erevMoadim1 == 2 && myDate.getDay()!= 5){
		shabbat = "<B>" + HoursMinutesSeconds(sun_time + (10/60)) + "*</B>" ;
	}
	
	
	
	if (myDate.getDay()== 6 )
		var torahReading = "</B><span class=hebrewBody align=center>" + getTorahSections(myHebDay, myHebMonth, myHebYear) + "</span><B>";
	else 
		var torahReading = "&nbsp;";
	
	
	
	
	var myMoed = moadim(myDate.getDay()+1, myHebMonth, myHebDay, myHebYear);
	
	
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
 
  for(var k1 = 0; k1 < 12; k1++){
  	if (strB[k1].toString().lastIndexOf('N')>0){
	 		strB[k1]=" --:--";
 	}
  }
 
 

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
	 htmlText += lookupTitle(whatTitle[j]);
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


function lookupWhat(what){

var whatCalc="";
switch (what) {
	case  "alot" : roundUpOrDown = 1;whatCalc = hourAngleTwillight(108, 0); break;
	case  "misheyakir" : roundUpOrDown = 1;whatCalc = hourAngleTwillight(101, 0); break;
	case  "hanetz" : roundUpOrDown = 1;whatCalc = hourAngleTwillight(90 + (50.0/60.0) +hite, 0); break;
	case  "shema" : roundUpOrDown = 2;whatCalc = getAccurate(3, temporalToLocal(3)); break;
	case  "tefillah" : roundUpOrDown = 2;whatCalc = getAccurate(4, temporalToLocal(4)); break;
	case  "chatzot" : roundUpOrDown = 2;whatCalc = getAccurate(6, temporalToLocal(6)); break;
	case  "minchag" : roundUpOrDown = 1;whatCalc = getAccurate(6.5, temporalToLocal(6.5)); break;
	case  "minchak" : roundUpOrDown = 1;whatCalc = getAccurate(9.5, temporalToLocal(9.5)); break;
	case  "plag" : roundUpOrDown = 2;whatCalc = getAccurate(10.75, temporalToLocal(10.75)); break;
	case  "shkia" : roundUpOrDown = 2;whatCalc = hourAngleTwillight(90 + (50.0/60.0) +hite, 12);  break;
	case  "tzeit" : roundUpOrDown = 1;whatCalc = hourAngleTwillight(96, 12);  break;
	case  "shabbat" : roundUpOrDown = 2; hourAngleTwillight(90 + (50.0/60.0) +hite, 12); whatCalc = HoursMinutesSeconds(sun_time - (18/60)) ;  break;

}
return whatCalc;


}

function lookupTitle(what){


var whatCalc="";
switch (what) {
	
	
	case  "alot" : 			whatCalc="עלות השחר";break;
	case  "misheyakir" : 		whatCalc="משיכיר";break;
	case  "hanetz" : 		whatCalc="הנץ החמה";break;
	case  "shema" : 		whatCalc="קריאת שמע";break;
	case  "tefillah" : 		whatCalc="תפילה";break;
	case  "chatzot" : 		whatCalc="חצות";break;
	case  "minchag" : 		whatCalc="מנחה גדולה";break;
	case  "minchak" : 		whatCalc="מנחה קטנה";break;
	case  "plag" : 			whatCalc="פלג המנחה";break;
	case  "shkia" : 		whatCalc="שקיעת החמה";break;
	case  "tzeit" : 		whatCalc="צאת הכוכבים";break;
	case  "shabbat" : 		whatCalc="הדלקת נרות";break;
	case  "parsha" : 		whatCalc="שבת ומועד";break;
	case  "molad" :			whatCalc="מולד";break;
	/*
	
	case  "alot" : 			whatCalc="Dawn";break;
	case  "misheyakir" : 		whatCalc="משיכיר";break;
	case  "hanetz" : 		whatCalc="Sunise";break;
	case  "shema" : 		whatCalc="The 3rd Hour";break;
	case  "tefillah" : 		whatCalc="The 4th Hour";break;
	case  "chatzot" : 		whatCalc="Midday";break;
	case  "minchag" : 		whatCalc="6:30 temporal hour";break;
	case  "minchak" : 		whatCalc="9:30 temporal hour";break;
	case  "plag" : 			whatCalc="10:45 temporal hour";break;
	case  "shkia" : 		whatCalc="Sunset";break;
	case  "tzeit" : 		whatCalc="End of civil twilight";break;
	case  "shabbat" : 		whatCalc="Sabbath Candle Lighting";break;
	case  "parsha" : 		whatCalc="שבת ומועד";break;
	case  "molad" :			whatCalc="מולד";break;
	
	*/

}
return whatCalc;


}



function yearTable(what) {

if (what == "shabbat"){
	yearShabbat();
}
else {



//yearTable('shema')

var deg = String.fromCharCode(176);

getInput();

if (what == "molad"){
	var hYear = new Number(document.hebrew.year.value)

	var a = window.open("molad.asp?year="+hYear)
	//a.document.open();
	//a.document.write(strResponse);
	//a.document.close();
}
else {   
	

var truthBeTold = window.confirm("Do you wish to use DST automatically? OK for yes. Cancel for no.");
if (truthBeTold) 
	automatic = 1;
else	
	automatic = 0;



if (jewish == 1){
	var numDays = 30;
	var date1;
	var j = new Number(hebrew_to_jd((new Number(document.hebrew.year.value)), 7, 1));
	date1 = jd_to_gregorian(j);

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


var locName = getLocationName(document.myform1.location.options[document.myform1.location.selectedIndex].value);


 var str11="", str22="";
 var T;

 
 
 var timezoneString = "";
 //var offsetStr = offset + 0;
 var offsetStr = Number(document.myform1.timezone.value) + 0;
  

 
  if (document.myform1.dst.checked) {
  	if (automatic == 0){
		timezoneString = " DST"
   	}
  }
 
  if (lat>=0) ns=" N"; else ns=" S";
  if (longitude>=0) ew=" W"; else ew=" E";
  
  
  //if (offset>=0) timezoneString="GMT + " + offsetStr + timezoneString; 
  if (offsetStr>=0) timezoneString="GMT + " + offsetStr + timezoneString;
  else  timezoneString="GMT  " + offsetStr + timezoneString;

 
 if (AMPM == 1) AMPM=2;
 
 //title
 text[0] = "<Center><FONT COLOR=black size=+1><B><span class=hebrewTitle align=center>" + lookupTitle(what) + " " 
 
 if (numDays == 31)
  	text[0] += year  
 else
  	text[0] += hebYear
 
 
 text[0] += "&nbsp;&nbsp;&nbsp;" + locName  
 + "</span><BR></B><FONT COLOR=red size=-1>Latitude: "  + Math.abs(lat) +deg + ns 
 + "  Longitude: "  + Math.abs(longitude) +deg + ew 
 + "<BR>" + timezoneString 

 if (what == "hanetz" || what == "shkia"){
	text[0] += ", "  + document.myform1.hite.value + " meters above sealevel";
 }
 if (with_refraction == 1 && what != "alot" && what != "misheyakir" && what != "hanetz" && what != "shkia" && what != "tzeit"  ){
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

	if (automatic == 1){
					dst = 0;
	
	if(diaspora==1){
		if (month > 3 && month < 11)
			dst = 1;
		else {
			if (month == 3 && day >= NthDOW(2, 1, 3, year))
				dst = 1;
			else if (month == 11 && day < NthDOW(1, 1, 11, year))
				dst = 1;
		}
	}
		//for new zealand dst
	else if (diaspora==2){
					
			dst = 0;

			if (month > 9 || month < 4){
				dst = 1;
			}

			else {
				if (month == 9 && day >= NthDOW(0, 1, 9, year))
					dst = 1;
				else if (month == 4 && day < NthDOW(1, 1, 4, year))
					dst = 1;
			}
	}

	else {
		if (month > 3 && month < 10)
			dst = 1;
		else {
			if (month == 3 && day >= NthDOW(0, 6, 3, year))
				dst = 1;
			else if (month == 10 && day < NthDOW(0, 1, 10, year))
				dst = 1;
		}
		
		
	}
	
	}
			month = myDate.getUTCMonth()+1;
			year =  myDate.getUTCFullYear();
			day = myDate.getUTCDate();


			if (i<=dIM) {
				strM1[month1][i]=lookupWhat(what);

				if (strM1[month1][i].toString().lastIndexOf('N')>0){
						strM1[month1][i]=" --:--";
				}

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


function checkDST(){
	month = Number(document.myform.month.value);
	day = Number(document.myform.day.value);
	year = Number(document.myform.year.value);
	
	var dst = 0;
	
	if(diaspora==1){
		if (month > 3 && month < 11)
			dst = 1;
		else {
			if (month == 3 && day >= NthDOW(2, 1, 3, year))
				dst = 1;
			else if (month == 11 && day < NthDOW(1, 1, 11, year))
				dst = 1;
		}
	}
		//for new zealand dst
	else if (diaspora==2){
					
			dst = 0;

			if (month > 9 || month < 4){
				dst = 1;
			}

			else {
				if (month == 9 && day >= NthDOW(0, 1, 9, year))
					dst = 1;
				else if (month == 4 && day < NthDOW(1, 1, 4, year))
					dst = 1;
			}
	}

	else {
		if (month > 3 && month < 10)
			dst = 1;
		else {
			if (month == 3 && day >= NthDOW(0, 6, 3, year))
				dst = 1;
			else if (month == 10 && day < NthDOW(0, 1, 10, year))
				dst = 1;
		}
		
		
	}
	
	
	
	if (dst == 1)
		document.myform1.dst.checked = true
	else
		document.myform1.dst.checked = false
}


function yearShabbat() {
	var hebDayNumber = new makeArray("א'","ב'","ג'","ד'","ה'","ו'","ז'","ח'","ט'","י'","י\"א","י\"ב","י\"ג","י\"ד","ט\"ו","ט\"ז","י\"ז","י\"ח","י\"ט","כ'","כ\"א","כ\"ב","כ\"ג","כ\"ד","כ\"ה","כ\"ו","כ\"ז","כ\"ח","כ\"ט","ל'");

	var numLines = 0;
	var truthBeTold = window.confirm("Do you wish to use DST automatically? OK for yes. Cancel for no.");
	if (truthBeTold) 
	automatic = 1;
	else	
	automatic = 0;

	var deg = String.fromCharCode(176);

	getInput();

	var locName = getLocationName(document.myform1.location.options[document.myform1.location.selectedIndex].value);

	var str11="", str22="";
	var T;

	var timezoneString = "";
	//var offsetStr = offset + 0;
	var offsetStr = Number(document.myform1.timezone.value) + 0;



	if (document.myform1.dst.checked) {
	if (automatic == 0){
		timezoneString = " DST"
	}
	//offsetStr = offset - 1;
	}

	if (lat>=0) ns=" N"; else ns=" S";
	if (longitude>=0) ew=" W"; else ew=" E";


	//if (offset>=0) timezoneString="GMT + " + offsetStr + timezoneString; 
	if (offsetStr>=0) timezoneString="GMT + " + offsetStr + timezoneString;
	else  timezoneString="GMT  " + offsetStr + timezoneString;


	var strYear = year;
	if (jewish == 1)
		var strYear = document.hebrew.year.value



	//title
	text[0] = "<Center><FONT COLOR=black size=+1><B>" + strYear  + "&nbsp;&nbsp;&nbsp;<div class=hebrewTitle align=center>" + locName + "</div>" 
	+ "</B><FONT COLOR=red size=-1>Latitude: "  + Math.abs(lat) +deg + ns 
	+ "  Longitude: "  + Math.abs(longitude) +deg + ew 
	+ "<BR>" + timezoneString 
	+ ", "  + document.myform1.hite.value + " meters above sealevel"
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
		
		var date1;
		var j = new Number(hebrew_to_jd((new Number(document.hebrew.year.value)) - 1, 6, 29));
		date1 = jd_to_gregorian(j);

		year = date1[0];
		month = date1[1];
		day = date1[2];

		var myDate = new Date(year, month-1, day);

		myDate.setHours(12);
		
		var j = new Number(hebrew_to_jd((new Number(document.hebrew.year.value)) + 1, 7, 1));
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

	
	if (automatic == 1){
					dst = 0;
	
	if(diaspora==1){
		if (month > 3 && month < 11)
			dst = 1;
		else {
			if (month == 3 && day >= NthDOW(2, 1, 3, year))
				dst = 1;
			else if (month == 11 && day < NthDOW(1, 1, 11, year))
				dst = 1;
		}
	}
		//for new zealand dst
	else if (diaspora==2){
					
			dst = 0;

			if (month > 9 || month < 4){
				dst = 1;
			}

			else {
				if (month == 9 && day >= NthDOW(0, 1, 9, year))
					dst = 1;
				else if (month == 4 && day < NthDOW(1, 1, 4, year))
					dst = 1;
			}
	}

	else {
		if (month > 3 && month < 10)
			dst = 1;
		else {
			if (month == 3 && day >= NthDOW(0, 6, 3, year))
				dst = 1;
			else if (month == 10 && day < NthDOW(0, 1, 10, year))
				dst = 1;
		}
		
		
	}
	
	}
	month = myDate.getUTCMonth()+1;
	year =  myDate.getUTCFullYear();
	day = myDate.getUTCDate();

	
	myDate.setHours(12);
	
	roundUpOrDown = 2;
	
	shkia = hourAngleTwillight(90 + (50.0/60.0) +hite, 12); 
	
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
		shkia = hourAngleTwillight(90 + (50.0/60.0) +hite, 12); 
		shabbat = "<B>" + HoursMinutesSeconds(sun_time - (nerot/60)) + "</B>" ;
		myDate = new Date(Date.parse(myDate) + (86400000));
		month = myDate.getUTCMonth()+1;
		year =  myDate.getUTCFullYear();
		day = myDate.getUTCDate();
		
	}
 	else { 
 		shabbat = "&nbsp;"
 	}
 	
 	
	
	roundUpOrDown = 1;
	tzeit = hourAngleTwillight(96, 12); 
	
	
	
	
	if (myDate.getDay()== 6 )
		var torahReading = "</B><span class=hebrewBody align=center>" + getTorahSections(myHebDay, myHebMonth, myHebYear) + "</span><B>";
	else 
		var torahReading = "&nbsp;";
	
	
	
	
	var myMoed = moadim(myDate.getDay()+1, myHebMonth, myHebDay, myHebYear);
	
	
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
			
			
			roundUpOrDown = 2;
			shkia = hourAngleTwillight(90 + (50.0/60.0) +hite, 12); 

			if (erevMoadim1 == 1)
				shabbat = "<B>" + HoursMinutesSeconds(sun_time - (nerot/60)) + "*</B>" ;
			else if (erevMoadim1 == 2 && myDate.getDay()!= 5){
				roundUpOrDown = 1;
				tzeit = hourAngleTwillight(96, 12); 
				shabbat = "<B>" + HoursMinutesSeconds(sun_time + (10/60)) + "*</B>" ;
			}

			
		}
		
		
		myDate = new Date(Date.parse(myDate) + (86400000));
		month = myDate.getUTCMonth()+1;
		year =  myDate.getUTCFullYear();
		day = myDate.getUTCDate();
		roundUpOrDown = 2;
		shkia = hourAngleTwillight(90 + (50.0/60.0) +hite, 12); 
		roundUpOrDown = 1;
		tzeit = hourAngleTwillight(96, 12); 
			
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
 
  for(var k1 = 0; k1 < 3; k1++){
  	if (strB[k1].toString().lastIndexOf('N')>0){
	 		strB[k1]=" --:--";
 	}
  }
 
 
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


