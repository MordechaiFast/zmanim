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


