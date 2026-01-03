function putcal(month,year) {
	var agt=navigator.userAgent.toLowerCase(); 
	var is_major = parseInt(navigator.appVersion); 
	var is_minor = parseFloat(navigator.appVersion); 
	var is_ie = ((agt.indexOf("msie") != -1) && (agt.indexOf("opera") == -1)); 
	var is_nav = ((agt.indexOf('mozilla')!=-1) && (agt.indexOf('spoofer')==-1) && (agt.indexOf('compatible') == -1) && (agt.indexOf('opera')==-1) && (agt.indexOf('webtv')==-1) && (agt.indexOf('hotjava')==-1)); 
	var is_nav4up = (is_nav && (is_major >= 4)); 
	var is_nav6up = (is_nav && (is_major >= 5)); 
	var is_ie4up = (is_ie && (is_major >= 4)); 
	var is_mac = (agt.indexOf("mac")!=-1);


  
  if (is_mac) {
    calwin = window.open("","calwin","width=300,height=300,resizable=yes");
  } else {
  	if(is_nav){
    		calwin = window.open("","calwin","width=290,height=280,resizable=yes");
    	}
    	else {
    		calwin = window.open("","calwin","width=230,height=280,resizable=yes");
    	}
    		
    
  }
  calwin.focus();

  calccal(calwin,month,year);
}

function calccal(targetwin,month,year) {
  var monthname = new Array(12);
  monthname[0] = "January";
  monthname[1] = "February";
  monthname[2] = "March";
  monthname[3] = "April";
  monthname[4] = "May";
  monthname[5] = "June";
  monthname[6] = "July";
  monthname[7] = "August";
  monthname[8] = "September";
  monthname[9] = "October";
  monthname[10] = "November";
  monthname[11] = "December";

  var endday = calclastday(eval(month),eval(year));

  mystr = month + "/01/" + year;
  mydate = new Date(mystr);
  firstday = mydate.getDay();

  var cnt = 0;

  var day = new Array(6);
  for (var i=0; i<6; i++)
    day[i] = new Array(7);

  for (var r=0; r<6; r++)
  {
    for (var c=0; c<7; c++)
    {
      if ((cnt==0) && (c!=firstday))
        continue;
      cnt++;
      day[r][c] = cnt;
      if (cnt==endday)
        break;
    }
    if (cnt==endday)
      break;
  }
  
  targetwin.document.clear();
  targetwin.document.close();
  targetwin.document.open("text/html", "replace");
  targetwin.document.clear();
  targetwin.document.write("<TABLE><TR VALIGN=TOP><FORM>");

  var prevyear = eval(year) - 1;
  targetwin.document.write("<TD><INPUT TYPE=BUTTON NAME=prevyearbutton VALUE='<<'"+
   " onclick=\"document.close();document.clear();opener.calccal(opener.calwin,"+month+","+prevyear+")\"></TD>");

  var prevmonth = calcprevmonth(month);
  var prevmonthyear = calcprevyear(month,year);
  targetwin.document.write("<TD><INPUT TYPE=BUTTON NAME=prevmonthbutton VALUE='&nbsp;<&nbsp;'"+
   " onclick='document.close();document.clear();opener.calccal(opener.calwin,"+prevmonth+","+prevmonthyear+")'></TD>");

  targetwin.document.write("<TD COLSPAN=3 ALIGN=CENTER>");
  var index = eval(month) - 1;
  targetwin.document.write("<B>" + monthname[index] + " " + year + "</B></TD>");

  var nextmonth = calcnextmonth(month);
  var nextmonthyear = calcnextyear(month,year);
  targetwin.document.write("<TD><INPUT TYPE=BUTTON NAME=nextmonthbutton VALUE='&nbsp;>&nbsp;'"+
   " onclick='document.close();document.clear();opener.calccal(opener.calwin,"+nextmonth+","+nextmonthyear+")'></TD>");

  var nextyear = eval(year) + 1;
  targetwin.document.write("<TD><INPUT TYPE=BUTTON NAME=nextyearbutton VALUE='>>'"+
   " onclick='document.close();document.clear();opener.calccal(opener.calwin,"+month+","+nextyear+")'></TD>");

  targetwin.document.write("</TR><TR>");
  targetwin.document.write("<TD>Su</TD>");
  targetwin.document.write("<TD>Mo</TD>");
  targetwin.document.write("<TD>Tu</TD>");
  targetwin.document.write("<TD>We</TD>");
  targetwin.document.write("<TD>Th</TD>");
  targetwin.document.write("<TD>Fr</TD>");
  targetwin.document.write("<TD>Sa</TD>");
  targetwin.document.write("</TR>");

  targetwin.document.write("<TR><TD COLSPAN=7><HR NOSHADE></TD></TR>");

  var selectedmonth = eval(month) - 1;
  var today = new Date();
  var thisyear = today.getFullYear();
  var selectedyear = eval(year) - thisyear + 20;

  var conditionalpadder = "";

  for(r=0; r<6; r++)
  {
   targetwin.document.write("<TR>");
   for(c=0; c<7; c++)
   {
    targetwin.document.write("<TD>");
    if(day[r][c] != null) {
      if (day[r][c] < 10)
        conditionalpadder = "&nbsp;"
      else
        conditionalpadder = "";
      targetwin.document.write("<INPUT TYPE=BUTTON NAME="+day[r][c]+
        " VALUE=" + conditionalpadder + day[r][c] + conditionalpadder +
        " onClick=\"opener.document.myform.month.selectedIndex="+selectedmonth+";" +
        "opener.document.myform.year.selectedIndex="+selectedyear+";"+
        "opener.ud(opener.document.myform.month);"+
	"opener.document.myform.day.selectedIndex=this.name-1;"+
	//"opener.document.whichweek.weekdate.value = opener.document.myform.month.options[opener.document.myform.month.selectedIndex].value + '/' + document.myform.day.options[opener.document.myform.day.selectedIndex].value + '/' + document.myform.year.options[opener.document.myform.year.selectedIndex].value;"+
	"opener.document.whichweek.weekdate.value = opener.showdate(); window.close(); opener.calculate();"+
	"\";" + ">");
    }
    targetwin.document.write("</TD>");
   }
   targetwin.document.write("</TR>");
  }
  targetwin.document.write("</FORM></TABLE>");

}

function calclastday(month,year) {
  if (month==2)
  	if ( ((year%400)==0) || (((year%100)!=0) && ((year%4)==0)) ) 
  		  return 29;
        else
        	return 28;

  if ((month==1) || (month == 3) || (month == 5) || (month == 7) ||
      (month==8) || (month == 10) || (month ==12))
    return 31;

  return 30;
}

function calcnextmonth(month) {
  if (month=="12")
    return "1";
  else
    return (eval(month)+1);
}

function calcnextyear(month,year) {
  if (month=="12")
    return (eval(year)+1);
  else
    return (year);
}

function calcprevmonth(month) {
  if (month=="1")
    return "12";
  else
    return (eval(month)-1);
}

function calcprevyear(month,year) {
  if (month=="1")
    return (eval(year)-1);
  else
    return (year);
}
