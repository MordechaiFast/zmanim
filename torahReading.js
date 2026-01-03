/* Copyright (c) by Ulrich Greve (2002-2005/5762-5765) */


function hebrewLeapYear(year) {
  if ((((year*7)+1) % 19) < 7)
    return true;
  else
    return false;
}

function lastMonthOfHebrewYear(year) {
  if (hebrewLeapYear(year))
    return 13;
  else
    return 12;
}

function hebrewCalendarElapsedDays(year) {
  /* Months in complete cycles so far */
  monthsElapsed = 235 * Math.floor((year-1) / 19);

  /* Regular months in this cycle */
  monthsElapsed += 12 * ((year-1) % 19);

  /* Leap months this cycle */
  monthsElapsed += Math.floor(((((year-1) % 19) * 7) + 1) / 19);

  partsElapsed = (((monthsElapsed % 1080) * 793) + 204);
  hoursElapsed = (5 +
                   (monthsElapsed * 12) +
                   (Math.floor(monthsElapsed / 1080) * 793) +
                   Math.floor(partsElapsed / 1080));

  /* Conjunction day */
  day = 1 + (29 * monthsElapsed) + Math.floor(hoursElapsed/24);

  /* Conjunction parts */
  parts = ((hoursElapsed % 24) * 1080) +
           (partsElapsed % 1080);

  /* If new moon is at or after midday, */
  if ((parts >= 19440) ||

  /* ...or is on a Tuesday... */
      (((day % 7) == 2) &&
  /* at 9 hours, 204 parts or later */
       (parts >= 9924)  &&
  /* of a common year */
       (!hebrewLeapYear(year))) ||

  /* ...or is on a Monday at... */
      (((day % 7) == 1) &&
  /* 15 hours, 589 parts or later... */
       (parts >= 16789) &&
  /* at the end of a leap year */
       (hebrewLeapYear(year-1))))
  /* Then postpone Rosh HaShanah one day */
    alternativeDay = day+1;
  else
    alternativeDay = day;                                 

  /* If Rosh HaShanah would occur on Sunday, Wednesday, */
  /* or Friday */
  if (((alternativeDay % 7) == 0) ||
      ((alternativeDay % 7) == 3) ||
      ((alternativeDay % 7) == 5))
  /* Then postpone it one (more) day and return */
    alternativeDay++;

  return (alternativeDay);                
}

function daysInHebrewYear(year)
{
  return hebrewCalendarElapsedDays(year+1) - hebrewCalendarElapsedDays(year);
}

function longHeshvan(year)
{
  if ((daysInHebrewYear(year) % 10) == 5)
    return true;
  else
    return false;
}

function shortKislev(year)
{
  if ((daysInHebrewYear(year) % 10) == 3)
    return true;
  else
    return false;
}

function lastDayOfHebrewMonth(month, year) {
  if ((month == 2) ||
      (month == 4) ||
      (month == 6) ||
      (month == 10) ||
      (month == 13))
    return 29;
  if ((month == 12) && (!hebrewLeapYear(year)))
    return 29;
  if ((month == 8) && (!longHeshvan(year)))
    return 29;
  if ((month == 9) && (shortKislev(year)))
    return 29;
  return 30;
}

function absoluteFromHebrew(day, month, year)
{
  /* Days so far this month */
  returnValue = day;

  /* If before Tishri */
  if (month < 7)
  {
    /* Then add days in prior months this year before and */
    /* after Nisan. */
    for (m = 7; m <= lastMonthOfHebrewYear(year); m++)
      returnValue += lastDayOfHebrewMonth(m, year);
    for (m = 1; m < month; m++)
      returnValue += lastDayOfHebrewMonth(m, year);
  }
  else
  {
    for (m = 7; m < month; m++)
      returnValue += lastDayOfHebrewMonth(m, year);
  }

  /* Days in prior years */
  returnValue += hebrewCalendarElapsedDays(year);

  /* Days elapsed before absolute date 1 */
  returnValue -= 1373429;

  return (returnValue);
}

function hebrewFromAbsolute(date)
{
  /* Approximation */
  approx = Math.floor((date+1373429) / 366);

  /* Search forward from the approximation */
  y = approx;
  for (;;)
  {
    temp = absoluteFromHebrew(1, 7, y+1);
    if (date < temp) break;
    y++;
  }
  year = y;

  /* Starting month for search for month */
  temp = absoluteFromHebrew(1, 1, year);
  if (date < temp)
    uStart = 7;
  else
    uStart = 1;

  /* Search forward from either Tishri or Nisan */
  m = uStart;
  for (;;)
  {
    temp = absoluteFromHebrew(lastDayOfHebrewMonth(m, year), m, year);
    if (date <= temp)
      break;
    m++;
  }
  month = m;

  /* Calculate the day by subtraction */
  temp = absoluteFromHebrew(1, month, year);
  day = date-temp+1;

  returnDateDay   = day;
  returnDateMonth = month;
  returnDateYear  = year;
}

function getJewishHolidayCount() {
  return 54;
}

function isDiaspora() {
 
 	
  if (diaspora)
    return true;
  else
    return false;
}


function getWeekday(absDate) {
  return (absDate % 7);
}







function initTorahReadings() {
  ID_BERESHITH                   = 0
  ID_NOAH                        = 1
  ID_LEHLEHA                     = 2
  ID_VAYERA                      = 3
  ID_HAYESARAH                   = 4
  ID_TOLEDOTH                    = 5
  ID_VAYETSE                     = 6
  ID_VAYISHLAH                   = 7
  ID_VAYESHEB                    = 8
  ID_MIKKETS                     = 9
  ID_VAYIGGASH                  = 10
  ID_VAYHEE                     = 11
  ID_SHEMOTH                    = 12
  ID_VAERA                      = 13
  ID_BO                         = 14
  ID_BESHALLAH                  = 15
  ID_YITHRO                     = 16
  ID_MISHPATIM                  = 17
  ID_TERUMAH                    = 18
  ID_TETSAVVEH                  = 19
  ID_KITISSA                    = 20
  ID_VAYAKHEL                   = 21
  ID_PEKUDE                     = 22
  ID_VAYIKRA                    = 23
  ID_TSAV                       = 24
  ID_SHEMINI                    = 25
  ID_TAZRIANG                   = 26
  ID_METSORANG                  = 27
  ID_AHAREMOTH                  = 28
  ID_KEDOSHIM                   = 29
  ID_EMOR                       = 30
  ID_BEHAR                      = 31
  ID_BEHUKKOTHAI                = 32
  ID_BEMIDBAR                   = 33
  ID_NASO                       = 34
  ID_BEHAALOTEHA                = 35
  ID_SHELAHLEHA                 = 36
  ID_KORAH                      = 37
  ID_HUKATH                     = 38
  ID_BALAK                      = 39
  ID_PINHAS                     = 40
  ID_MATOTH                     = 41
  ID_MASEH                      = 42
  ID_DEBARIM                    = 43
  ID_VAETHANAN                  = 44
  ID_EKEB                       = 45
  ID_REEH                       = 46
  ID_SHOFETIM                   = 47
  ID_KITETSE                    = 48
  ID_KITABO                     = 49
  ID_NITSABIM                   = 50
  ID_VAYELEH                    = 51
  ID_HAAZINU                    = 52

  ID_SIMHATHTORAH               = 53
  ID_SIMHATHTORAH_2             = 54
  ID_SIMHATHTORAH_3             = 55

  ID_ROSH_HODESH_SHABBAT        = 60
  ID_SHEKALIM                   = 61
  ID_ZAHOR                      = 62
  ID_PARAH                      = 63
  ID_HAHODESH                   = 64
  ID_HAGGADOL                   = 65
  ID_SHUVA                      = 66

  ID_ROSH_HASHANAH_I            = 70
  ID_ROSH_HASHANAH_II           = 71
  ID_FAST_OF_GEDALIAH           = 72
  ID_YOM_KIPPUR                 = 73
  ID_SUCCOTH_I                  = 74
  ID_SUCCOTH_II                 = 75
  ID_SUCCOTH_III_NO_SHABBAT     = 76
  ID_SUCCOTH_III                = 77
  ID_SUCCOTH_IV                 = 78
  ID_SUCCOTH_V_NO_SHABBAT       = 79
  ID_SUCCOTH_V                  = 80
  ID_SUCCOTH_VI_NO_SHABBAT      = 81
  ID_SUCCOTH_VI                 = 82
  ID_HOSHANAH_RABBAH            = 83
  ID_HOL_HAMOED_SUCCOTH         = 84
  ID_SHEMINI_AZERETH_1          = 85
  ID_FAST_OF_ESTHER             = 86
  ID_PURIM                      = 87
  ID_FAST_OF_TEVET_10           = 88
  ID_PESAH_I                    = 89
  ID_HOL_HAMOED_PESAH           = 90
  ID_PESAH_VII                  = 91
  ID_PESAH_VIII                 = 92
  ID_PESAH_VIII_NO_SHABBAT      = 93
  ID_SHAVUOTH_I                 = 94
  ID_SHAVUOTH_II_NO_SHABBAT     = 95 
  ID_SHAVUOTH_II                = 96
  ID_YOM_HAATZMAUT              = 97
  ID_FAST_OF_TAMMUZ_17          = 98
  ID_FAST_OF_TISHA_BAV          = 99
  ID_CHANUKKAH_I               = 100
  ID_CHANUKKAH_II              = 101
  ID_CHANUKKAH_III             = 102
  ID_CHANUKKAH_IV              = 103
  ID_CHANUKKAH_V               = 104
  ID_CHANUKKAH_VI              = 105
  ID_CHANUKKAH_VI_ROSH_HODESH  = 106
  ID_CHANUKKAH_VII             = 107
  ID_CHANUKKAH_VII_ROSH_HODESH = 108
  ID_CHANUKKAH_VIII            = 109
  ID_SECOND_SHABBAT_CHANUKKAH  = 110
  ID_ROSH_HODESH               = 111
  ID_PESAH_II                  = 112
  ID_PESAH_III                 = 113
  ID_PESAH_IV                  = 114
  ID_PESAH_IV_NOT_SUNDAY       = 115
  ID_PESAH_IV_SUNDAY           = 116
  ID_PESAH_V                   = 117
  ID_PESAH_V_NOT_MONDAY        = 118
  ID_PESAH_V_MONDAY            = 119
  ID_PESAH_VI                  = 120

  ID_SPECIAL_1                  = 150
  ID_SPECIAL_2                  = 151
  ID_SPECIAL_3                  = 152
  ID_SPECIAL_4                  = 153
  ID_SPECIAL_5                  = 154
  ID_SPECIAL_6                  = 155
  ID_SPECIAL_7                  = 156
  ID_SPECIAL_8                  = 157
  ID_SPECIAL_8A                 = 158
  ID_SPECIAL_9                  = 159
  ID_SPECIAL_10                 = 161
  ID_SPECIAL_11                 = 162
  ID_SPECIAL_12                 = 163

  ID_SHEMINI_AZERETH_2          = 170
  ID_SHEMINI_AZERETH_3          = 171
  ID_SHEMINI_AZERETH            = 172 

  ID_MAX                        = 256

  ID_NULL                       = 1000

  torahSectionsA = new Array
  (ID_BERESHITH,           ID_NULL,    ID_NULL,      /*  1 */
   ID_NOAH,                ID_NULL,    ID_NULL,      /*  2 */
   ID_LEHLEHA,             ID_NULL,    ID_NULL,      /*  3 */
   ID_VAYERA,              ID_NULL,    ID_NULL,      /*  4 */
   ID_HAYESARAH,           ID_NULL,    ID_NULL,      /*  5 */
   ID_TOLEDOTH,            ID_NULL,    ID_NULL,      /*  6 */
   ID_VAYETSE,             ID_NULL,    ID_NULL,      /*  7 */
   ID_VAYISHLAH,           ID_NULL,    ID_NULL,      /*  8 */
   ID_VAYESHEB,            ID_NULL,    ID_NULL,      /*  9 */
   ID_MIKKETS,             ID_NULL,    ID_NULL,      /* 10 */
   ID_VAYIGGASH,           ID_NULL,    ID_NULL,      /* 11 */
   ID_VAYHEE,              ID_NULL,    ID_NULL,      /* 12 */
   ID_SHEMOTH,             ID_NULL,    ID_NULL,      /* 13 */
   ID_VAERA,               ID_NULL,    ID_NULL,      /* 14 */
   ID_BO,                  ID_NULL,    ID_NULL,      /* 15 */
   ID_BESHALLAH,           ID_NULL,    ID_NULL,      /* 16 */
   ID_YITHRO,              ID_NULL,    ID_NULL,      /* 17 */
   ID_MISHPATIM,           ID_SHEKALIM,ID_NULL,      /* 18 */
   ID_TERUMAH,             ID_NULL,    ID_NULL,      /* 19 */
   ID_TETSAVVEH,           ID_ZAHOR,   ID_NULL,      /* 20 */
   ID_KITISSA,             ID_PARAH,   ID_NULL,      /* 21 */
   ID_VAYAKHEL,            ID_PEKUDE,  ID_HAHODESH,  /* 22 */
   ID_VAYIKRA,             ID_NULL,    ID_NULL,      /* 24 */
   ID_TSAV,                ID_HAGGADOL,ID_NULL,      /* 25 */
   ID_HOL_HAMOED_PESAH,    ID_NULL,    ID_NULL,      /* 26 */
   ID_SHEMINI,             ID_NULL,    ID_NULL,      /* 27 */
   ID_TAZRIANG,           ID_METSORANG,ID_NULL,      /* 28 */
   ID_AHAREMOTH,           ID_KEDOSHIM,ID_NULL,      /* 29 */
   ID_EMOR,                ID_NULL,    ID_NULL,      /* 30 */
   ID_BEHAR,            ID_BEHUKKOTHAI,ID_NULL,      /* 31 */
   ID_BEMIDBAR,            ID_NULL,    ID_NULL,      /* 32 */
   ID_NASO,                ID_NULL,    ID_NULL,      /* 33 */
   ID_BEHAALOTEHA,         ID_NULL,    ID_NULL,      /* 34 */
   ID_SHELAHLEHA,          ID_NULL,    ID_NULL,      /* 35 */
   ID_KORAH,               ID_NULL,    ID_NULL,      /* 36 */
   ID_HUKATH,              ID_NULL,    ID_NULL,      /* 37 */
   ID_BALAK,               ID_NULL,    ID_NULL,      /* 38 */
   ID_PINHAS,              ID_NULL,    ID_NULL,      /* 39 */
   ID_MATOTH,              ID_MASEH,   ID_NULL,      /* 40 */
   ID_DEBARIM,             ID_NULL,    ID_NULL,      /* 41 */
   ID_VAETHANAN,           ID_NULL,    ID_NULL,      /* 42 */
   ID_EKEB,                ID_NULL,    ID_NULL,      /* 43 */
   ID_REEH,                ID_NULL,    ID_NULL,      /* 44 */
   ID_SHOFETIM,            ID_NULL,    ID_NULL,      /* 45 */
   ID_KITETSE,             ID_NULL,    ID_NULL,      /* 46 */
   ID_KITABO,              ID_NULL,    ID_NULL,      /* 47 */
   ID_NITSABIM,            ID_VAYELEH, ID_NULL,      /* 48 */
   ID_HAAZINU,             ID_NULL,    ID_NULL,      /* 49 */
   ID_YOM_KIPPUR,          ID_NULL,    ID_NULL,      /* 50 */
   ID_HOL_HAMOED_SUCCOTH,  ID_NULL,    ID_NULL);     /* 51 */

  torahSectionsB = new Array
  (ID_BERESHITH,           ID_NULL,    ID_NULL,      /*  1 */
   ID_NOAH,                ID_NULL,    ID_NULL,      /*  2 */
   ID_LEHLEHA,             ID_NULL,    ID_NULL,      /*  3 */
   ID_VAYERA,              ID_NULL,    ID_NULL,      /*  4 */
   ID_HAYESARAH,           ID_NULL,    ID_NULL,      /*  5 */
   ID_TOLEDOTH,            ID_NULL,    ID_NULL,      /*  6 */
   ID_VAYETSE,             ID_NULL,    ID_NULL,      /*  7 */
   ID_VAYISHLAH,           ID_NULL,    ID_NULL,      /*  8 */
   ID_VAYESHEB,            ID_NULL,    ID_NULL,      /*  9 */
   ID_MIKKETS,             ID_NULL,    ID_NULL,      /* 10 */
   ID_VAYIGGASH,           ID_NULL,    ID_NULL,      /* 11 */
   ID_VAYHEE,              ID_NULL,    ID_NULL,      /* 12 */
   ID_SHEMOTH,             ID_NULL,    ID_NULL,      /* 13 */
   ID_VAERA,               ID_NULL,    ID_NULL,      /* 14 */
   ID_BO,                  ID_NULL,    ID_NULL,      /* 15 */
   ID_BESHALLAH,           ID_NULL,    ID_NULL,      /* 16 */
   ID_YITHRO,              ID_NULL,    ID_NULL,      /* 17 */
   ID_MISHPATIM,           ID_SHEKALIM,ID_NULL,      /* 18 */
   ID_TERUMAH,             ID_ZAHOR,   ID_NULL,      /* 19 */
   ID_TETSAVVEH,           ID_NULL,    ID_NULL,      /* 20 */
   ID_KITISSA,             ID_PARAH,   ID_NULL,      /* 21 */
   ID_VAYAKHEL,            ID_PEKUDE,  ID_HAHODESH,  /* 22 */
   ID_VAYIKRA,             ID_NULL,    ID_NULL,      /* 23 */
   ID_TSAV,                ID_HAGGADOL,ID_NULL,      /* 24 */
   ID_PESAH_VII,           ID_NULL,    ID_NULL,      /* 25 */
   ID_SHEMINI,             ID_NULL,    ID_NULL,      /* 26 */
   ID_TAZRIANG,           ID_METSORANG,ID_NULL,      /* 27 */
   ID_AHAREMOTH,           ID_KEDOSHIM,ID_NULL,      /* 28 */
   ID_EMOR,                ID_NULL,    ID_NULL,      /* 29 */
   ID_BEHAR,            ID_BEHUKKOTHAI,ID_NULL,      /* 30 */
   ID_BEMIDBAR,            ID_NULL,    ID_NULL,      /* 31 */
   ID_NASO,                ID_NULL,    ID_NULL,      /* 32 */
   ID_BEHAALOTEHA,         ID_NULL,    ID_NULL,      /* 33 */
   ID_SHELAHLEHA,          ID_NULL,    ID_NULL,      /* 34 */
   ID_KORAH,               ID_NULL,    ID_NULL,      /* 35 */
   ID_HUKATH,              ID_NULL,    ID_NULL,      /* 36 */
   ID_BALAK,               ID_NULL,    ID_NULL,      /* 37 */
   ID_PINHAS,              ID_NULL,    ID_NULL,      /* 38 */
   ID_MATOTH,              ID_MASEH,   ID_NULL,      /* 39 */
   ID_DEBARIM,             ID_NULL,    ID_NULL,      /* 40 */
   ID_VAETHANAN,           ID_NULL,    ID_NULL,      /* 41 */
   ID_EKEB,                ID_NULL,    ID_NULL,      /* 42 */
   ID_REEH,                ID_NULL,    ID_NULL,      /* 43 */
   ID_SHOFETIM,            ID_NULL,    ID_NULL,      /* 44 */
   ID_KITETSE,             ID_NULL,    ID_NULL,      /* 45 */
   ID_KITABO,              ID_NULL,    ID_NULL,      /* 46 */
   ID_NITSABIM,            ID_NULL,    ID_NULL,      /* 47 */
   ID_VAYELEH,             ID_NULL,    ID_NULL,      /* 48 */
   ID_HAAZINU,             ID_NULL,    ID_NULL,      /* 49 */
   ID_HOL_HAMOED_SUCCOTH,  ID_NULL,    ID_NULL);     /* 50 */

  torahSectionsCDiaspora = new Array
  (ID_BERESHITH,           ID_NULL,    ID_NULL,      /*  1 */
   ID_NOAH,                ID_NULL,    ID_NULL,      /*  2 */
   ID_LEHLEHA,             ID_NULL,    ID_NULL,      /*  3 */
   ID_VAYERA,              ID_NULL,    ID_NULL,      /*  4 */
   ID_HAYESARAH,           ID_NULL,    ID_NULL,      /*  5 */
   ID_TOLEDOTH,            ID_NULL,    ID_NULL,      /*  6 */
   ID_VAYETSE,             ID_NULL,    ID_NULL,      /*  7 */
   ID_VAYISHLAH,           ID_NULL,    ID_NULL,      /*  8 */
   ID_VAYESHEB,            ID_NULL,    ID_NULL,      /*  9 */
   ID_MIKKETS,             ID_NULL,    ID_NULL,      /* 10 */
   ID_VAYIGGASH,           ID_NULL,    ID_NULL,      /* 11 */
   ID_VAYHEE,              ID_NULL,    ID_NULL,      /* 12 */
   ID_SHEMOTH,             ID_NULL,    ID_NULL,      /* 13 */
   ID_VAERA,               ID_NULL,    ID_NULL,      /* 14 */
   ID_BO,                  ID_NULL,    ID_NULL,      /* 15 */
   ID_BESHALLAH,           ID_NULL,    ID_NULL,      /* 16 */
   ID_YITHRO,              ID_NULL,    ID_NULL,      /* 17 */
   ID_MISHPATIM,           ID_SHEKALIM,ID_NULL,      /* 18 */
   ID_TERUMAH,             ID_NULL,    ID_NULL,      /* 19 */
   ID_TETSAVVEH,           ID_ZAHOR,   ID_NULL,      /* 20 */
   ID_KITISSA,             ID_PARAH,   ID_NULL,      /* 21 */
   ID_VAYAKHEL,            ID_PEKUDE,  ID_HAHODESH,  /* 22 */
   ID_VAYIKRA,             ID_NULL,    ID_NULL,      /* 24 */
   ID_TSAV,                ID_HAGGADOL,ID_NULL,      /* 25 */
   ID_HOL_HAMOED_PESAH,    ID_NULL,    ID_NULL,      /* 26 */
   ID_SHEMINI,             ID_NULL,    ID_NULL,      /* 27 */
   ID_TAZRIANG,           ID_METSORANG,ID_NULL,      /* 28 */
   ID_AHAREMOTH,           ID_KEDOSHIM,ID_NULL,      /* 29 */
   ID_EMOR,                ID_NULL,    ID_NULL,      /* 30 */
   ID_BEHAR,            ID_BEHUKKOTHAI,ID_NULL,      /* 31 */
   ID_BEMIDBAR,            ID_NULL,    ID_NULL,      /* 32 */
   ID_SHAVUOTH_II,         ID_NULL,    ID_NULL,      /* 33 */
   ID_NASO,                ID_NULL,    ID_NULL,      /* 34 */
   ID_BEHAALOTEHA,         ID_NULL,    ID_NULL,      /* 35 */
   ID_SHELAHLEHA,          ID_NULL,    ID_NULL,      /* 36 */
   ID_KORAH,               ID_NULL,    ID_NULL,      /* 37 */
   ID_HUKATH,              ID_BALAK,   ID_NULL,      /* 38 */
   ID_PINHAS,              ID_NULL,    ID_NULL,      /* 39 */
   ID_MATOTH,              ID_MASEH,   ID_NULL,      /* 40 */
   ID_DEBARIM,             ID_NULL,    ID_NULL,      /* 41 */
   ID_VAETHANAN,           ID_NULL,    ID_NULL,      /* 42 */
   ID_EKEB,                ID_NULL,    ID_NULL,      /* 43 */
   ID_REEH,                ID_NULL,    ID_NULL,      /* 44 */
   ID_SHOFETIM,            ID_NULL,    ID_NULL,      /* 45 */
   ID_KITETSE,             ID_NULL,    ID_NULL,      /* 46 */
   ID_KITABO,              ID_NULL,    ID_NULL,      /* 47 */
   ID_NITSABIM,            ID_VAYELEH, ID_NULL,      /* 48 */
   ID_ROSH_HASHANAH_I,     ID_NULL,    ID_NULL,      /* 49 */
   ID_HAAZINU,             ID_NULL,    ID_NULL,      /* 50 */
   ID_SUCCOTH_I,           ID_NULL,    ID_NULL,      /* 51 */
   ID_SHEMINI_AZERETH,     ID_NULL,    ID_NULL);     /* 52 */

  torahSectionsCIsrael = new Array
  (ID_BERESHITH,           ID_NULL,    ID_NULL,      /*  1 */
   ID_NOAH,                ID_NULL,    ID_NULL,      /*  2 */
   ID_LEHLEHA,             ID_NULL,    ID_NULL,      /*  3 */
   ID_VAYERA,              ID_NULL,    ID_NULL,      /*  4 */
   ID_HAYESARAH,           ID_NULL,    ID_NULL,      /*  5 */
   ID_TOLEDOTH,            ID_NULL,    ID_NULL,      /*  6 */
   ID_VAYETSE,             ID_NULL,    ID_NULL,      /*  7 */
   ID_VAYISHLAH,           ID_NULL,    ID_NULL,      /*  8 */
   ID_VAYESHEB,            ID_NULL,    ID_NULL,      /*  9 */
   ID_MIKKETS,             ID_NULL,    ID_NULL,      /* 10 */
   ID_VAYIGGASH,           ID_NULL,    ID_NULL,      /* 11 */
   ID_VAYHEE,              ID_NULL,    ID_NULL,      /* 12 */
   ID_SHEMOTH,             ID_NULL,    ID_NULL,      /* 13 */
   ID_VAERA,               ID_NULL,    ID_NULL,      /* 14 */
   ID_BO,                  ID_NULL,    ID_NULL,      /* 15 */
   ID_BESHALLAH,           ID_NULL,    ID_NULL,      /* 16 */
   ID_YITHRO,              ID_NULL,    ID_NULL,      /* 17 */
   ID_MISHPATIM,           ID_SHEKALIM,ID_NULL,      /* 18 */
   ID_TERUMAH,             ID_NULL,    ID_NULL,      /* 19 */
   ID_TETSAVVEH,           ID_ZAHOR,   ID_NULL,      /* 20 */
   ID_KITISSA,             ID_PARAH,   ID_NULL,      /* 21 */
   ID_VAYAKHEL,            ID_PEKUDE,  ID_HAHODESH,  /* 22 */
   ID_VAYIKRA,             ID_NULL,    ID_NULL,      /* 24 */
   ID_TSAV,                ID_HAGGADOL,ID_NULL,      /* 25 */
   ID_HOL_HAMOED_PESAH,    ID_NULL,    ID_NULL,      /* 26 */
   ID_SHEMINI,             ID_NULL,    ID_NULL,      /* 27 */
   ID_TAZRIANG,           ID_METSORANG,ID_NULL,      /* 28 */
   ID_AHAREMOTH,           ID_KEDOSHIM,ID_NULL,      /* 29 */
   ID_EMOR,                ID_NULL,    ID_NULL,      /* 30 */
   ID_BEHAR,            ID_BEHUKKOTHAI,ID_NULL,      /* 31 */
   ID_BEMIDBAR,            ID_NULL,    ID_NULL,      /* 32 */
   ID_NASO,                ID_NULL,    ID_NULL,      /* 33 */
   ID_BEHAALOTEHA,         ID_NULL,    ID_NULL,      /* 34 */
   ID_SHELAHLEHA,          ID_NULL,    ID_NULL,      /* 35 */
   ID_KORAH,               ID_NULL,    ID_NULL,      /* 36 */
   ID_HUKATH,              ID_NULL,    ID_NULL,      /* 37 */
   ID_BALAK,               ID_NULL,    ID_NULL,      /* 38 */
   ID_PINHAS,              ID_NULL,    ID_NULL,      /* 39 */
   ID_MATOTH,              ID_MASEH,   ID_NULL,      /* 40 */
   ID_DEBARIM,             ID_NULL,    ID_NULL,      /* 41 */
   ID_VAETHANAN,           ID_NULL,    ID_NULL,      /* 42 */
   ID_EKEB,                ID_NULL,    ID_NULL,      /* 43 */
   ID_REEH,                ID_NULL,    ID_NULL,      /* 44 */
   ID_SHOFETIM,            ID_NULL,    ID_NULL,      /* 45 */
   ID_KITETSE,             ID_NULL,    ID_NULL,      /* 46 */
   ID_KITABO,              ID_NULL,    ID_NULL,      /* 47 */
   ID_NITSABIM,            ID_VAYELEH, ID_NULL,      /* 48 */
   ID_ROSH_HASHANAH_I,     ID_NULL,    ID_NULL,      /* 49 */
   ID_HAAZINU,             ID_NULL,    ID_NULL,      /* 50 */
   ID_SUCCOTH_I,           ID_NULL,    ID_NULL,      /* 51 */
   ID_SHEMINI_AZERETH,     ID_NULL,    ID_NULL);     /* 52 */

  torahSectionsDDiaspora = new Array
  (ID_BERESHITH,           ID_NULL,    ID_NULL,      /*  1 */
   ID_NOAH,                ID_NULL,    ID_NULL,      /*  2 */
   ID_LEHLEHA,             ID_NULL,    ID_NULL,      /*  3 */
   ID_VAYERA,              ID_NULL,    ID_NULL,      /*  4 */
   ID_HAYESARAH,           ID_NULL,    ID_NULL,      /*  5 */
   ID_TOLEDOTH,            ID_NULL,    ID_NULL,      /*  6 */
   ID_VAYETSE,             ID_NULL,    ID_NULL,      /*  7 */
   ID_VAYISHLAH,           ID_NULL,    ID_NULL,      /*  8 */
   ID_VAYESHEB,            ID_NULL,    ID_NULL,      /*  9 */
   ID_MIKKETS,             ID_NULL,    ID_NULL,      /* 10 */
   ID_VAYIGGASH,           ID_NULL,    ID_NULL,      /* 11 */
   ID_VAYHEE,              ID_NULL,    ID_NULL,      /* 12 */
   ID_SHEMOTH,             ID_NULL,    ID_NULL,      /* 13 */
   ID_VAERA,               ID_NULL,    ID_NULL,      /* 14 */
   ID_BO,                  ID_NULL,    ID_NULL,      /* 15 */
   ID_BESHALLAH,           ID_NULL,    ID_NULL,      /* 16 */
   ID_YITHRO,              ID_NULL,    ID_NULL,      /* 17 */
   ID_MISHPATIM,           ID_SHEKALIM,ID_NULL,      /* 18 */
   ID_TERUMAH,             ID_NULL,    ID_NULL,      /* 19 */
   ID_TETSAVVEH,           ID_ZAHOR,   ID_NULL,      /* 20 */
   ID_KITISSA,             ID_NULL,    ID_NULL,      /* 21 */
   ID_VAYAKHEL,            ID_PEKUDE,  ID_PARAH,     /* 22 */
   ID_VAYIKRA,             ID_HAHODESH,ID_NULL,      /* 23 */
   ID_TSAV,                ID_HAGGADOL,ID_NULL,      /* 24 */
   ID_PESAH_I,             ID_NULL,    ID_NULL,      /* 25 */
   ID_PESAH_VIII,          ID_NULL,    ID_NULL,      /* 26 */
   ID_SHEMINI,             ID_NULL,    ID_NULL,      /* 27 */
   ID_TAZRIANG,           ID_METSORANG,ID_NULL,      /* 28 */
   ID_AHAREMOTH,           ID_KEDOSHIM,ID_NULL,      /* 29 */
   ID_EMOR,                ID_NULL,    ID_NULL,      /* 30 */
   ID_BEHAR,            ID_BEHUKKOTHAI,ID_NULL,      /* 31 */
   ID_BEMIDBAR,            ID_NULL,    ID_NULL,      /* 32 */
   ID_NASO,                ID_NULL,    ID_NULL,      /* 33 */
   ID_BEHAALOTEHA,         ID_NULL,    ID_NULL,      /* 34 */
   ID_SHELAHLEHA,          ID_NULL,    ID_NULL,      /* 35 */
   ID_KORAH,               ID_NULL,    ID_NULL,      /* 36 */
   ID_HUKATH,              ID_NULL,    ID_NULL,      /* 37 */
   ID_BALAK,               ID_NULL,    ID_NULL,      /* 38 */
   ID_PINHAS,              ID_NULL,    ID_NULL,      /* 39 */
   ID_MATOTH,              ID_MASEH,   ID_NULL,      /* 40 */
   ID_DEBARIM,             ID_NULL,    ID_NULL,      /* 41 */
   ID_VAETHANAN,           ID_NULL,    ID_NULL,      /* 42 */
   ID_EKEB,                ID_NULL,    ID_NULL,      /* 43 */
   ID_REEH,                ID_NULL,    ID_NULL,      /* 44 */
   ID_SHOFETIM,            ID_NULL,    ID_NULL,      /* 45 */
   ID_KITETSE,             ID_NULL,    ID_NULL,      /* 46 */
   ID_KITABO,              ID_NULL,    ID_NULL,      /* 47 */
   ID_NITSABIM,            ID_NULL,    ID_NULL,      /* 48 */
   ID_VAYELEH,             ID_NULL,    ID_NULL,      /* 49 */
   ID_HAAZINU,             ID_NULL,    ID_NULL,      /* 50 */
   ID_HOL_HAMOED_SUCCOTH,  ID_NULL,    ID_NULL);     /* 51 */

  torahSectionsDIsrael = new Array
  (ID_BERESHITH,           ID_NULL,    ID_NULL,      /*  1 */
   ID_NOAH,                ID_NULL,    ID_NULL,      /*  2 */
   ID_LEHLEHA,             ID_NULL,    ID_NULL,      /*  3 */
   ID_VAYERA,              ID_NULL,    ID_NULL,      /*  4 */
   ID_HAYESARAH,           ID_NULL,    ID_NULL,      /*  5 */
   ID_TOLEDOTH,            ID_NULL,    ID_NULL,      /*  6 */
   ID_VAYETSE,             ID_NULL,    ID_NULL,      /*  7 */
   ID_VAYISHLAH,           ID_NULL,    ID_NULL,      /*  8 */
   ID_VAYESHEB,            ID_NULL,    ID_NULL,      /*  9 */
   ID_MIKKETS,             ID_NULL,    ID_NULL,      /* 10 */
   ID_VAYIGGASH,           ID_NULL,    ID_NULL,      /* 11 */
   ID_VAYHEE,              ID_NULL,    ID_NULL,      /* 12 */
   ID_SHEMOTH,             ID_NULL,    ID_NULL,      /* 13 */
   ID_VAERA,               ID_NULL,    ID_NULL,      /* 14 */
   ID_BO,                  ID_NULL,    ID_NULL,      /* 15 */
   ID_BESHALLAH,           ID_NULL,    ID_NULL,      /* 16 */
   ID_YITHRO,              ID_NULL,    ID_NULL,      /* 17 */
   ID_MISHPATIM,           ID_SHEKALIM,ID_NULL,      /* 18 */
   ID_TERUMAH,             ID_NULL,    ID_NULL,      /* 19 */
   ID_TETSAVVEH,           ID_ZAHOR,   ID_NULL,      /* 20 */
   ID_KITISSA,             ID_NULL,    ID_NULL,      /* 21 */
   ID_VAYAKHEL,            ID_PEKUDE,  ID_PARAH,     /* 22 */
   ID_VAYIKRA,             ID_HAHODESH,ID_NULL,      /* 23 */
   ID_TSAV,                ID_HAGGADOL,ID_NULL,      /* 24 */
   ID_PESAH_I,             ID_NULL,    ID_NULL,      /* 25 */
   ID_SHEMINI,             ID_NULL,    ID_NULL,      /* 26 */
   ID_TAZRIANG,           ID_METSORANG,ID_NULL,      /* 27 */
   ID_AHAREMOTH,           ID_KEDOSHIM,ID_NULL,      /* 28 */
   ID_EMOR,                ID_NULL,    ID_NULL,      /* 29 */
   ID_BEHAR,               ID_NULL,    ID_NULL,      /* 30 */
   ID_BEHUKKOTHAI,         ID_NULL,    ID_NULL,      /* 31 */
   ID_BEMIDBAR,            ID_NULL,    ID_NULL,      /* 32 */
   ID_NASO,                ID_NULL,    ID_NULL,      /* 33 */
   ID_BEHAALOTEHA,         ID_NULL,    ID_NULL,      /* 34 */
   ID_SHELAHLEHA,          ID_NULL,    ID_NULL,      /* 35 */
   ID_KORAH,               ID_NULL,    ID_NULL,      /* 36 */
   ID_HUKATH,              ID_NULL,    ID_NULL,      /* 37 */
   ID_BALAK,               ID_NULL,    ID_NULL,      /* 38 */
   ID_PINHAS,              ID_NULL,    ID_NULL,      /* 39 */
   ID_MATOTH,              ID_MASEH,   ID_NULL,      /* 40 */
   ID_DEBARIM,             ID_NULL,    ID_NULL,      /* 41 */
   ID_VAETHANAN,           ID_NULL,    ID_NULL,      /* 42 */
   ID_EKEB,                ID_NULL,    ID_NULL,      /* 43 */
   ID_REEH,                ID_NULL,    ID_NULL,      /* 44 */
   ID_SHOFETIM,            ID_NULL,    ID_NULL,      /* 45 */
   ID_KITETSE,             ID_NULL,    ID_NULL,      /* 46 */
   ID_KITABO,              ID_NULL,    ID_NULL,      /* 47 */
   ID_NITSABIM,            ID_NULL,    ID_NULL,      /* 48 */
   ID_VAYELEH,             ID_NULL,    ID_NULL,      /* 49 */
   ID_HAAZINU,             ID_NULL,    ID_NULL,      /* 50 */
   ID_HOL_HAMOED_SUCCOTH,  ID_NULL,    ID_NULL);     /* 51 */

  torahSectionsEDiaspora = new Array
  (ID_BERESHITH,           ID_NULL,    ID_NULL,      /*  1 */
   ID_NOAH,                ID_NULL,    ID_NULL,      /*  2 */
   ID_LEHLEHA,             ID_NULL,    ID_NULL,      /*  3 */
   ID_VAYERA,              ID_NULL,    ID_NULL,      /*  4 */
   ID_HAYESARAH,           ID_NULL,    ID_NULL,      /*  5 */
   ID_TOLEDOTH,            ID_NULL,    ID_NULL,      /*  6 */
   ID_VAYETSE,             ID_NULL,    ID_NULL,      /*  7 */
   ID_VAYISHLAH,           ID_NULL,    ID_NULL,      /*  8 */
   ID_VAYESHEB,            ID_NULL,    ID_NULL,      /*  9 */
   ID_MIKKETS,             ID_NULL,    ID_NULL,      /* 10 */
   ID_VAYIGGASH,           ID_NULL,    ID_NULL,      /* 11 */
   ID_VAYHEE,              ID_NULL,    ID_NULL,      /* 12 */
   ID_SHEMOTH,             ID_NULL,    ID_NULL,      /* 13 */
   ID_VAERA,               ID_NULL,    ID_NULL,      /* 14 */
   ID_BO,                  ID_NULL,    ID_NULL,      /* 15 */
   ID_BESHALLAH,           ID_NULL,    ID_NULL,      /* 16 */
   ID_YITHRO,              ID_NULL,    ID_NULL,      /* 17 */
   ID_MISHPATIM,           ID_SHEKALIM,ID_NULL,      /* 18 */
   ID_TERUMAH,             ID_NULL,    ID_NULL,      /* 19 */
   ID_TETSAVVEH,           ID_ZAHOR,   ID_NULL,      /* 20 */
   ID_KITISSA,             ID_PARAH,   ID_NULL,      /* 21 */
   ID_VAYAKHEL,            ID_PEKUDE,  ID_HAHODESH,  /* 22 */
   ID_VAYIKRA,             ID_NULL,    ID_NULL,      /* 23 */
   ID_TSAV,                ID_HAGGADOL,ID_NULL,      /* 24 */
   ID_HOL_HAMOED_PESAH,    ID_NULL,    ID_NULL,      /* 26 */
   ID_SHEMINI,             ID_NULL,    ID_NULL,      /* 27 */
   ID_TAZRIANG,           ID_METSORANG,ID_NULL,      /* 28 */
   ID_AHAREMOTH,           ID_KEDOSHIM,ID_NULL,      /* 29 */
   ID_EMOR,                ID_NULL,    ID_NULL,      /* 30 */
   ID_BEHAR,            ID_BEHUKKOTHAI,ID_NULL,      /* 31 */
   ID_BEMIDBAR,            ID_NULL,    ID_NULL,      /* 32 */
   ID_SHAVUOTH_II,         ID_NULL,    ID_NULL,      /* 33 */
   ID_NASO,                ID_NULL,    ID_NULL,      /* 34 */
   ID_BEHAALOTEHA,         ID_NULL,    ID_NULL,      /* 35 */
   ID_SHELAHLEHA,          ID_NULL,    ID_NULL,      /* 36 */
   ID_KORAH,               ID_NULL,    ID_NULL,      /* 37 */
   ID_HUKATH,              ID_BALAK,   ID_NULL,      /* 38 */
   ID_PINHAS,              ID_NULL,    ID_NULL,      /* 39 */
   ID_MATOTH,              ID_MASEH,   ID_NULL,      /* 40 */
   ID_DEBARIM,             ID_NULL,    ID_NULL,      /* 41 */
   ID_VAETHANAN,           ID_NULL,    ID_NULL,      /* 42 */
   ID_EKEB,                ID_NULL,    ID_NULL,      /* 43 */
   ID_REEH,                ID_NULL,    ID_NULL,      /* 44 */
   ID_SHOFETIM,            ID_NULL,    ID_NULL,      /* 45 */
   ID_KITETSE,             ID_NULL,    ID_NULL,      /* 46 */
   ID_KITABO,              ID_NULL,    ID_NULL,      /* 47 */
   ID_NITSABIM,            ID_VAYELEH, ID_NULL,      /* 48 */
   ID_ROSH_HASHANAH_I,     ID_NULL,    ID_NULL,      /* 49 */
   ID_HAAZINU,             ID_NULL,    ID_NULL,      /* 50 */
   ID_SUCCOTH_I,           ID_NULL,    ID_NULL,      /* 51 */
   ID_SHEMINI_AZERETH,     ID_NULL,    ID_NULL);     /* 52 */

  torahSectionsEIsrael = new Array
  (ID_BERESHITH,           ID_NULL,    ID_NULL,      /*  1 */
   ID_NOAH,                ID_NULL,    ID_NULL,      /*  2 */
   ID_LEHLEHA,             ID_NULL,    ID_NULL,      /*  3 */
   ID_VAYERA,              ID_NULL,    ID_NULL,      /*  4 */
   ID_HAYESARAH,           ID_NULL,    ID_NULL,      /*  5 */
   ID_TOLEDOTH,            ID_NULL,    ID_NULL,      /*  6 */
   ID_VAYETSE,             ID_NULL,    ID_NULL,      /*  7 */
   ID_VAYISHLAH,           ID_NULL,    ID_NULL,      /*  8 */
   ID_VAYESHEB,            ID_NULL,    ID_NULL,      /*  9 */
   ID_MIKKETS,             ID_NULL,    ID_NULL,      /* 10 */
   ID_VAYIGGASH,           ID_NULL,    ID_NULL,      /* 11 */
   ID_VAYHEE,              ID_NULL,    ID_NULL,      /* 12 */
   ID_SHEMOTH,             ID_NULL,    ID_NULL,      /* 13 */
   ID_VAERA,               ID_NULL,    ID_NULL,      /* 14 */
   ID_BO,                  ID_NULL,    ID_NULL,      /* 15 */
   ID_BESHALLAH,           ID_NULL,    ID_NULL,      /* 16 */
   ID_YITHRO,              ID_NULL,    ID_NULL,      /* 17 */
   ID_MISHPATIM,           ID_SHEKALIM,ID_NULL,      /* 18 */
   ID_TERUMAH,             ID_NULL,    ID_NULL,      /* 19 */
   ID_TETSAVVEH,           ID_ZAHOR,   ID_NULL,      /* 20 */
   ID_KITISSA,             ID_PARAH,   ID_NULL,      /* 21 */
   ID_VAYAKHEL,            ID_PEKUDE,  ID_HAHODESH,  /* 22 */
   ID_VAYIKRA,             ID_NULL,    ID_NULL,      /* 23 */
   ID_TSAV,                ID_HAGGADOL,ID_NULL,      /* 24 */
   ID_HOL_HAMOED_PESAH,    ID_NULL,    ID_NULL,      /* 26 */
   ID_SHEMINI,             ID_NULL,    ID_NULL,      /* 27 */
   ID_TAZRIANG,           ID_METSORANG,ID_NULL,      /* 28 */
   ID_AHAREMOTH,           ID_KEDOSHIM,ID_NULL,      /* 29 */
   ID_EMOR,                ID_NULL,    ID_NULL,      /* 30 */
   ID_BEHAR,            ID_BEHUKKOTHAI,ID_NULL,      /* 31 */
   ID_BEMIDBAR,            ID_NULL,    ID_NULL,      /* 32 */
   ID_SHAVUOTH_II,         ID_NULL,    ID_NULL,      /* 33 */
   ID_NASO,                ID_NULL,    ID_NULL,      /* 34 */
   ID_BEHAALOTEHA,         ID_NULL,    ID_NULL,      /* 35 */
   ID_SHELAHLEHA,          ID_NULL,    ID_NULL,      /* 36 */
   ID_KORAH,               ID_NULL,    ID_NULL,      /* 37 */
   ID_HUKATH,              ID_BALAK,   ID_NULL,      /* 38 */
   ID_PINHAS,              ID_NULL,    ID_NULL,      /* 39 */
   ID_MATOTH,              ID_MASEH,   ID_NULL,      /* 40 */
   ID_DEBARIM,             ID_NULL,    ID_NULL,      /* 41 */
   ID_VAETHANAN,           ID_NULL,    ID_NULL,      /* 42 */
   ID_EKEB,                ID_NULL,    ID_NULL,      /* 43 */
   ID_REEH,                ID_NULL,    ID_NULL,      /* 44 */
   ID_SHOFETIM,            ID_NULL,    ID_NULL,      /* 45 */
   ID_KITETSE,             ID_NULL,    ID_NULL,      /* 46 */
   ID_KITABO,              ID_NULL,    ID_NULL,      /* 47 */
   ID_NITSABIM,            ID_VAYELEH, ID_NULL,      /* 48 */
   ID_ROSH_HASHANAH_I,     ID_NULL,    ID_NULL,      /* 49 */
   ID_HAAZINU,             ID_NULL,    ID_NULL,      /* 50 */
   ID_SUCCOTH_I,           ID_NULL,    ID_NULL,      /* 51 */
   ID_SHEMINI_AZERETH,     ID_NULL,    ID_NULL);     /* 52 */

  torahSectionsF = new Array
  (ID_BERESHITH,           ID_NULL,    ID_NULL,      /*  1 */
   ID_NOAH,                ID_NULL,    ID_NULL,      /*  2 */
   ID_LEHLEHA,             ID_NULL,    ID_NULL,      /*  3 */
   ID_VAYERA,              ID_NULL,    ID_NULL,      /*  4 */
   ID_HAYESARAH,           ID_NULL,    ID_NULL,      /*  5 */
   ID_TOLEDOTH,            ID_NULL,    ID_NULL,      /*  6 */
   ID_VAYETSE,             ID_NULL,    ID_NULL,      /*  7 */
   ID_VAYISHLAH,           ID_NULL,    ID_NULL,      /*  8 */
   ID_VAYESHEB,            ID_NULL,    ID_NULL,      /*  9 */
   ID_MIKKETS,             ID_NULL,    ID_NULL,      /* 10 */
   ID_VAYIGGASH,           ID_NULL,    ID_NULL,      /* 11 */
   ID_VAYHEE,              ID_NULL,    ID_NULL,      /* 12 */
   ID_SHEMOTH,             ID_NULL,    ID_NULL,      /* 13 */
   ID_VAERA,               ID_NULL,    ID_NULL,      /* 14 */
   ID_BO,                  ID_NULL,    ID_NULL,      /* 15 */
   ID_BESHALLAH,           ID_NULL,    ID_NULL,      /* 16 */
   ID_YITHRO,              ID_NULL,    ID_NULL,      /* 17 */
   ID_MISHPATIM,           ID_NULL,    ID_NULL,      /* 18 */
   ID_TERUMAH,             ID_SHEKALIM,ID_NULL,      /* 19 */
   ID_TETSAVVEH,           ID_ZAHOR,   ID_NULL,      /* 20 */
   ID_KITISSA,             ID_NULL,    ID_NULL,      /* 21 */
   ID_VAYAKHEL,            ID_PARAH,   ID_NULL,      /* 22 */
   ID_PEKUDE,              ID_HAHODESH,ID_NULL,      /* 23 */
   ID_VAYIKRA,             ID_NULL,    ID_NULL,      /* 24 */
   ID_TSAV,                ID_HAGGADOL,ID_NULL,      /* 25 */
   ID_PESAH_VII,           ID_NULL,    ID_NULL,      /* 26 */
   ID_SHEMINI,             ID_NULL,    ID_NULL,      /* 27 */
   ID_TAZRIANG,           ID_METSORANG,ID_NULL,      /* 28 */
   ID_AHAREMOTH,           ID_KEDOSHIM,ID_NULL,      /* 29 */
   ID_EMOR,                ID_NULL,    ID_NULL,      /* 30 */
   ID_BEHAR,            ID_BEHUKKOTHAI,ID_NULL,      /* 31 */
   ID_BEMIDBAR,            ID_NULL,    ID_NULL,      /* 32 */
   ID_NASO,                ID_NULL,    ID_NULL,      /* 34 */
   ID_BEHAALOTEHA,         ID_NULL,    ID_NULL,      /* 35 */
   ID_SHELAHLEHA,          ID_NULL,    ID_NULL,      /* 36 */
   ID_KORAH,               ID_NULL,    ID_NULL,      /* 37 */
   ID_HUKATH,              ID_NULL,    ID_NULL,      /* 38 */
   ID_BALAK,               ID_NULL,    ID_NULL,      /* 39 */
   ID_PINHAS,              ID_NULL,    ID_NULL,      /* 40 */
   ID_MATOTH,              ID_MASEH,   ID_NULL,      /* 41 */
   ID_DEBARIM,             ID_NULL,    ID_NULL,      /* 42 */
   ID_VAETHANAN,           ID_NULL,    ID_NULL,      /* 43 */
   ID_EKEB,                ID_NULL,    ID_NULL,      /* 44 */
   ID_REEH,                ID_NULL,    ID_NULL,      /* 45 */
   ID_SHOFETIM,            ID_NULL,    ID_NULL,      /* 46 */
   ID_KITETSE,             ID_NULL,    ID_NULL,      /* 47 */
   ID_KITABO,              ID_NULL,    ID_NULL,      /* 48 */
   ID_NITSABIM,            ID_NULL,    ID_NULL,      /* 49 */
   ID_VAYELEH,             ID_NULL,    ID_NULL,      /* 50 */
   ID_HAAZINU,             ID_NULL,    ID_NULL,      /* 51 */
   ID_HOL_HAMOED_SUCCOTH,  ID_NULL,    ID_NULL);     /* 52 */

  torahSectionsG = new Array
  (ID_BERESHITH,           ID_NULL,    ID_NULL,      /*  1 */
   ID_NOAH,                ID_NULL,    ID_NULL,      /*  2 */
   ID_LEHLEHA,             ID_NULL,    ID_NULL,      /*  3 */
   ID_VAYERA,              ID_NULL,    ID_NULL,      /*  4 */
   ID_HAYESARAH,           ID_NULL,    ID_NULL,      /*  5 */
   ID_TOLEDOTH,            ID_NULL,    ID_NULL,      /*  6 */
   ID_VAYETSE,             ID_NULL,    ID_NULL,      /*  7 */
   ID_VAYISHLAH,           ID_NULL,    ID_NULL,      /*  8 */
   ID_VAYESHEB,            ID_NULL,    ID_NULL,      /*  9 */
   ID_MIKKETS,             ID_NULL,    ID_NULL,      /* 10 */
   ID_VAYIGGASH,           ID_NULL,    ID_NULL,      /* 11 */
   ID_VAYHEE,              ID_NULL,    ID_NULL,      /* 12 */
   ID_SHEMOTH,             ID_NULL,    ID_NULL,      /* 13 */
   ID_VAERA,               ID_NULL,    ID_NULL,      /* 14 */
   ID_BO,                  ID_NULL,    ID_NULL,      /* 15 */
   ID_BESHALLAH,           ID_NULL,    ID_NULL,      /* 16 */
   ID_YITHRO,              ID_NULL,    ID_NULL,      /* 17 */
   ID_MISHPATIM,           ID_SHEKALIM,ID_NULL,      /* 18 */
   ID_TERUMAH,             ID_NULL,    ID_NULL,      /* 19 */
   ID_TETSAVVEH,           ID_ZAHOR,   ID_NULL,      /* 20 */
   ID_KITISSA,             ID_PARAH,   ID_NULL,      /* 21 */
   ID_VAYAKHEL,            ID_PEKUDE,  ID_HAHODESH,  /* 22 */
   ID_VAYIKRA,             ID_NULL,    ID_NULL,      /* 24 */
   ID_TSAV,                ID_HAGGADOL,ID_NULL,      /* 25 */
   ID_HOL_HAMOED_PESAH,    ID_NULL,    ID_NULL,      /* 26 */
   ID_SHEMINI,             ID_NULL,    ID_NULL,      /* 27 */
   ID_TAZRIANG,           ID_METSORANG,ID_NULL,      /* 28 */
   ID_AHAREMOTH,           ID_KEDOSHIM,ID_NULL,      /* 29 */
   ID_EMOR,                ID_NULL,    ID_NULL,      /* 30 */
   ID_BEHAR,            ID_BEHUKKOTHAI,ID_NULL,      /* 31 */
   ID_BEMIDBAR,            ID_NULL,    ID_NULL,      /* 32 */
   ID_NASO,                ID_NULL,    ID_NULL,      /* 33 */
   ID_BEHAALOTEHA,         ID_NULL,    ID_NULL,      /* 34 */
   ID_SHELAHLEHA,          ID_NULL,    ID_NULL,      /* 35 */
   ID_KORAH,               ID_NULL,    ID_NULL,      /* 36 */
   ID_HUKATH,              ID_NULL,    ID_NULL,      /* 37 */
   ID_BALAK,               ID_NULL,    ID_NULL,      /* 38 */
   ID_PINHAS,              ID_NULL,    ID_NULL,      /* 39 */
   ID_MATOTH,              ID_MASEH,   ID_NULL,      /* 40 */
   ID_DEBARIM,             ID_NULL,    ID_NULL,      /* 41 */
   ID_VAETHANAN,           ID_NULL,    ID_NULL,      /* 42 */
   ID_EKEB,                ID_NULL,    ID_NULL,      /* 43 */
   ID_REEH,                ID_NULL,    ID_NULL,      /* 44 */
   ID_SHOFETIM,            ID_NULL,    ID_NULL,      /* 45 */
   ID_KITETSE,             ID_NULL,    ID_NULL,      /* 46 */
   ID_KITABO,              ID_NULL,    ID_NULL,      /* 47 */
   ID_NITSABIM,            ID_VAYELEH, ID_NULL,      /* 48 */
   ID_HAAZINU,             ID_NULL,    ID_NULL,      /* 49 */
   ID_YOM_KIPPUR,          ID_NULL,    ID_NULL,      /* 50 */
   ID_HOL_HAMOED_SUCCOTH,  ID_NULL,    ID_NULL);     /* 51 */

  torahSectionsHDiaspora = new Array
  (ID_BERESHITH,           ID_NULL,    ID_NULL,      /*  1 */
   ID_NOAH,                ID_NULL,    ID_NULL,      /*  2 */
   ID_LEHLEHA,             ID_NULL,    ID_NULL,      /*  3 */
   ID_VAYERA,              ID_NULL,    ID_NULL,      /*  4 */
   ID_HAYESARAH,           ID_NULL,    ID_NULL,      /*  5 */
   ID_TOLEDOTH,            ID_NULL,    ID_NULL,      /*  6 */
   ID_VAYETSE,             ID_NULL,    ID_NULL,      /*  7 */
   ID_VAYISHLAH,           ID_NULL,    ID_NULL,      /*  8 */
   ID_VAYESHEB,            ID_NULL,    ID_NULL,      /*  9 */
   ID_MIKKETS,             ID_NULL,    ID_NULL,      /* 10 */
   ID_VAYIGGASH,           ID_NULL,    ID_NULL,      /* 11 */
   ID_VAYHEE,              ID_NULL,    ID_NULL,      /* 12 */
   ID_SHEMOTH,             ID_NULL,    ID_NULL,      /* 13 */
   ID_VAERA,               ID_NULL,    ID_NULL,      /* 14 */
   ID_BO,                  ID_NULL,    ID_NULL,      /* 15 */
   ID_BESHALLAH,           ID_NULL,    ID_NULL,      /* 16 */
   ID_YITHRO,              ID_NULL,    ID_NULL,      /* 17 */
   ID_MISHPATIM,           ID_NULL,    ID_NULL,      /* 18 */
   ID_TERUMAH,             ID_NULL,    ID_NULL,      /* 19 */
   ID_TETSAVVEH,           ID_NULL,    ID_NULL,      /* 20 */
   ID_KITISSA,             ID_NULL,    ID_NULL,      /* 21 */
   ID_VAYAKHEL,            ID_SHEKALIM,ID_NULL,      /* 22 */
   ID_PEKUDE,              ID_NULL,    ID_NULL,      /* 23 */
   ID_VAYIKRA,             ID_ZAHOR,   ID_NULL,      /* 24 */
   ID_TSAV,                ID_PARAH,   ID_NULL,      /* 25 */
   ID_SHEMINI,             ID_HAHODESH,ID_NULL,      /* 26 */
   ID_TAZRIANG,            ID_NULL,    ID_NULL,      /* 27 */
   ID_METSORANG,           ID_HAGGADOL,ID_NULL,      /* 28 */
   ID_HOL_HAMOED_PESAH,    ID_NULL,    ID_NULL,      /* 29 */
   ID_AHAREMOTH,           ID_NULL,    ID_NULL,      /* 30 */
   ID_KEDOSHIM,            ID_NULL,    ID_NULL,      /* 31 */
   ID_EMOR,                ID_NULL,    ID_NULL,      /* 32 */
   ID_BEHAR,               ID_NULL,    ID_NULL,      /* 33 */
   ID_BEHUKKOTHAI,         ID_NULL,    ID_NULL,      /* 34 */
   ID_BEMIDBAR,            ID_NULL,    ID_NULL,      /* 35 */
   ID_SHAVUOTH_II,         ID_NULL,    ID_NULL,      /* 36 */
   ID_NASO,                ID_NULL,    ID_NULL,      /* 37 */
   ID_BEHAALOTEHA,         ID_NULL,    ID_NULL,      /* 38 */
   ID_SHELAHLEHA,          ID_NULL,    ID_NULL,      /* 39 */
   ID_KORAH,               ID_NULL,    ID_NULL,      /* 40 */
   ID_HUKATH,              ID_BALAK,   ID_NULL,      /* 41 */
   ID_PINHAS,              ID_NULL,    ID_NULL,      /* 42 */
   ID_MATOTH,              ID_MASEH,   ID_NULL,      /* 43 */
   ID_DEBARIM,             ID_NULL,    ID_NULL,      /* 44 */
   ID_VAETHANAN,           ID_NULL,    ID_NULL,      /* 45 */
   ID_EKEB,                ID_NULL,    ID_NULL,      /* 46 */
   ID_REEH,                ID_NULL,    ID_NULL,      /* 47 */
   ID_SHOFETIM,            ID_NULL,    ID_NULL,      /* 48 */
   ID_KITETSE,             ID_NULL,    ID_NULL,      /* 49 */
   ID_KITABO,              ID_NULL,    ID_NULL,      /* 50 */
   ID_NITSABIM,            ID_VAYELEH, ID_NULL,      /* 51 */
   ID_ROSH_HASHANAH_I,     ID_NULL,    ID_NULL,      /* 52 */
   ID_HAAZINU,             ID_NULL,    ID_NULL,      /* 53 */
   ID_SUCCOTH_I,           ID_NULL,    ID_NULL,      /* 54 */
   ID_SHEMINI_AZERETH,     ID_NULL,    ID_NULL);     /* 55 */

  torahSectionsHIsrael = new Array
  (ID_BERESHITH,           ID_NULL,    ID_NULL,      /*  1 */
   ID_NOAH,                ID_NULL,    ID_NULL,      /*  2 */
   ID_LEHLEHA,             ID_NULL,    ID_NULL,      /*  3 */
   ID_VAYERA,              ID_NULL,    ID_NULL,      /*  4 */
   ID_HAYESARAH,           ID_NULL,    ID_NULL,      /*  5 */
   ID_TOLEDOTH,            ID_NULL,    ID_NULL,      /*  6 */
   ID_VAYETSE,             ID_NULL,    ID_NULL,      /*  7 */
   ID_VAYISHLAH,           ID_NULL,    ID_NULL,      /*  8 */
   ID_VAYESHEB,            ID_NULL,    ID_NULL,      /*  9 */
   ID_MIKKETS,             ID_NULL,    ID_NULL,      /* 10 */
   ID_VAYIGGASH,           ID_NULL,    ID_NULL,      /* 11 */
   ID_VAYHEE,              ID_NULL,    ID_NULL,      /* 12 */
   ID_SHEMOTH,             ID_NULL,    ID_NULL,      /* 13 */
   ID_VAERA,               ID_NULL,    ID_NULL,      /* 14 */
   ID_BO,                  ID_NULL,    ID_NULL,      /* 15 */
   ID_BESHALLAH,           ID_NULL,    ID_NULL,      /* 16 */
   ID_YITHRO,              ID_NULL,    ID_NULL,      /* 17 */
   ID_MISHPATIM,           ID_NULL,    ID_NULL,      /* 18 */
   ID_TERUMAH,             ID_NULL,    ID_NULL,      /* 19 */
   ID_TETSAVVEH,           ID_NULL,    ID_NULL,      /* 20 */
   ID_KITISSA,             ID_NULL,    ID_NULL,      /* 21 */
   ID_VAYAKHEL,            ID_SHEKALIM,ID_NULL,      /* 22 */
   ID_PEKUDE,              ID_NULL,    ID_NULL,      /* 23 */
   ID_VAYIKRA,             ID_ZAHOR,   ID_NULL,      /* 24 */
   ID_TSAV,                ID_PARAH,   ID_NULL,      /* 25 */
   ID_SHEMINI,             ID_HAHODESH,ID_NULL,      /* 26 */
   ID_TAZRIANG,            ID_NULL,    ID_NULL,      /* 27 */
   ID_METSORANG,           ID_HAGGADOL,ID_NULL,      /* 28 */
   ID_HOL_HAMOED_PESAH,    ID_NULL,    ID_NULL,      /* 29 */
   ID_AHAREMOTH,           ID_NULL,    ID_NULL,      /* 30 */
   ID_KEDOSHIM,            ID_NULL,    ID_NULL,      /* 31 */
   ID_EMOR,                ID_NULL,    ID_NULL,      /* 32 */
   ID_BEHAR,               ID_NULL,    ID_NULL,      /* 33 */
   ID_BEHUKKOTHAI,         ID_NULL,    ID_NULL,      /* 34 */
   ID_BEMIDBAR,            ID_NULL,    ID_NULL,      /* 35 */
   ID_NASO,                ID_NULL,    ID_NULL,      /* 36 */
   ID_BEHAALOTEHA,         ID_NULL,    ID_NULL,      /* 37 */
   ID_SHELAHLEHA,          ID_NULL,    ID_NULL,      /* 38 */
   ID_KORAH,               ID_NULL,    ID_NULL,      /* 39 */
   ID_HUKATH,              ID_NULL,    ID_NULL,      /* 40 */
   ID_BALAK,               ID_NULL,    ID_NULL,      /* 41 */
   ID_PINHAS,              ID_NULL,    ID_NULL,      /* 42 */
   ID_MATOTH,              ID_MASEH,   ID_NULL,      /* 43 */
   ID_DEBARIM,             ID_NULL,    ID_NULL,      /* 44 */
   ID_VAETHANAN,           ID_NULL,    ID_NULL,      /* 45 */
   ID_EKEB,                ID_NULL,    ID_NULL,      /* 46 */
   ID_REEH,                ID_NULL,    ID_NULL,      /* 47 */
   ID_SHOFETIM,            ID_NULL,    ID_NULL,      /* 48 */
   ID_KITETSE,             ID_NULL,    ID_NULL,      /* 49 */
   ID_KITABO,              ID_NULL,    ID_NULL,      /* 50 */
   ID_NITSABIM,            ID_VAYELEH, ID_NULL,      /* 51 */
   ID_ROSH_HASHANAH_I,     ID_NULL,    ID_NULL,      /* 52 */
   ID_HAAZINU,             ID_NULL,    ID_NULL,      /* 53 */
   ID_SUCCOTH_I,           ID_NULL,    ID_NULL,      /* 54 */
   ID_SHEMINI_AZERETH,     ID_NULL,    ID_NULL);     /* 55 */

  torahSectionsI = new Array
  (ID_BERESHITH,           ID_NULL,    ID_NULL,      /*  1 */
   ID_NOAH,                ID_NULL,    ID_NULL,      /*  2 */
   ID_LEHLEHA,             ID_NULL,    ID_NULL,      /*  3 */
   ID_VAYERA,              ID_NULL,    ID_NULL,      /*  4 */
   ID_HAYESARAH,           ID_NULL,    ID_NULL,      /*  5 */
   ID_TOLEDOTH,            ID_NULL,    ID_NULL,      /*  6 */
   ID_VAYETSE,             ID_NULL,    ID_NULL,      /*  7 */
   ID_VAYISHLAH,           ID_NULL,    ID_NULL,      /*  8 */
   ID_VAYESHEB,            ID_NULL,    ID_NULL,      /*  9 */
   ID_MIKKETS,             ID_NULL,    ID_NULL,      /* 10 */
   ID_VAYIGGASH,           ID_NULL,    ID_NULL,      /* 11 */
   ID_VAYHEE,              ID_NULL,    ID_NULL,      /* 12 */
   ID_SHEMOTH,             ID_NULL,    ID_NULL,      /* 13 */
   ID_VAERA,               ID_NULL,    ID_NULL,      /* 14 */
   ID_BO,                  ID_NULL,    ID_NULL,      /* 15 */
   ID_BESHALLAH,           ID_NULL,    ID_NULL,      /* 16 */
   ID_YITHRO,              ID_NULL,    ID_NULL,      /* 17 */
   ID_MISHPATIM,           ID_NULL,    ID_NULL,      /* 18 */
   ID_TERUMAH,             ID_NULL,    ID_NULL,      /* 19 */
   ID_TETSAVVEH,           ID_NULL,    ID_NULL,      /* 20 */
   ID_KITISSA,             ID_NULL,    ID_NULL,      /* 21 */
   ID_VAYAKHEL,            ID_NULL,    ID_NULL,      /* 22 */
   ID_PEKUDE,              ID_SHEKALIM,ID_NULL,      /* 23 */
   ID_VAYIKRA,             ID_ZAHOR,   ID_NULL,      /* 24 */
   ID_TSAV,                ID_NULL,    ID_NULL,      /* 25 */
   ID_SHEMINI,             ID_PARAH,   ID_NULL,      /* 26 */
   ID_TAZRIANG,            ID_HAHODESH,ID_NULL,      /* 27 */
   ID_METSORANG,           ID_NULL,    ID_NULL,      /* 28 */
   ID_AHAREMOTH,           ID_HAGGADOL,ID_NULL,      /* 29 */
   ID_PESAH_VII,           ID_NULL,    ID_NULL,      /* 30 */
   ID_KEDOSHIM,            ID_NULL,    ID_NULL,      /* 31 */
   ID_EMOR,                ID_NULL,    ID_NULL,      /* 32 */
   ID_BEHAR,               ID_NULL,    ID_NULL,      /* 33 */
   ID_BEHUKKOTHAI,         ID_NULL,    ID_NULL,      /* 34 */
   ID_BEMIDBAR,            ID_NULL,    ID_NULL,      /* 35 */
   ID_NASO,                ID_NULL,    ID_NULL,      /* 36 */
   ID_BEHAALOTEHA,         ID_NULL,    ID_NULL,      /* 37 */
   ID_SHELAHLEHA,          ID_NULL,    ID_NULL,      /* 38 */
   ID_KORAH,               ID_NULL,    ID_NULL,      /* 39 */
   ID_HUKATH,              ID_NULL,    ID_NULL,      /* 40 */
   ID_BALAK,               ID_NULL,    ID_NULL,      /* 41 */
   ID_PINHAS,              ID_NULL,    ID_NULL,      /* 42 */
   ID_MATOTH,              ID_NULL,    ID_NULL,      /* 43 */
   ID_MASEH,               ID_NULL,    ID_NULL,      /* 44 */
   ID_DEBARIM,             ID_NULL,    ID_NULL,      /* 45 */
   ID_VAETHANAN,           ID_NULL,    ID_NULL,      /* 46 */
   ID_EKEB,                ID_NULL,    ID_NULL,      /* 47 */
   ID_REEH,                ID_NULL,    ID_NULL,      /* 48 */
   ID_SHOFETIM,            ID_NULL,    ID_NULL,      /* 49 */
   ID_KITETSE,             ID_NULL,    ID_NULL,      /* 50 */
   ID_KITABO,              ID_NULL,    ID_NULL,      /* 51 */
   ID_NITSABIM,            ID_NULL,    ID_NULL,      /* 52 */
   ID_VAYELEH,             ID_NULL,    ID_NULL,      /* 53 */
   ID_HAAZINU,             ID_NULL,    ID_NULL,      /* 54 */
   ID_HOL_HAMOED_SUCCOTH,  ID_NULL,    ID_NULL);     /* 55 */

  torahSectionsJ = new Array
  (ID_BERESHITH,           ID_NULL,    ID_NULL,      /*  1 */
   ID_NOAH,                ID_NULL,    ID_NULL,      /*  2 */
   ID_LEHLEHA,             ID_NULL,    ID_NULL,      /*  3 */
   ID_VAYERA,              ID_NULL,    ID_NULL,      /*  4 */
   ID_HAYESARAH,           ID_NULL,    ID_NULL,      /*  5 */
   ID_TOLEDOTH,            ID_NULL,    ID_NULL,      /*  6 */
   ID_VAYETSE,             ID_NULL,    ID_NULL,      /*  7 */
   ID_VAYISHLAH,           ID_NULL,    ID_NULL,      /*  8 */
   ID_VAYESHEB,            ID_NULL,    ID_NULL,      /*  9 */
   ID_MIKKETS,             ID_NULL,    ID_NULL,      /* 10 */
   ID_VAYIGGASH,           ID_NULL,    ID_NULL,      /* 11 */
   ID_VAYHEE,              ID_NULL,    ID_NULL,      /* 12 */
   ID_SHEMOTH,             ID_NULL,    ID_NULL,      /* 13 */
   ID_VAERA,               ID_NULL,    ID_NULL,      /* 14 */
   ID_BO,                  ID_NULL,    ID_NULL,      /* 15 */
   ID_BESHALLAH,           ID_NULL,    ID_NULL,      /* 16 */
   ID_YITHRO,              ID_NULL,    ID_NULL,      /* 17 */
   ID_MISHPATIM,           ID_NULL,    ID_NULL,      /* 18 */
   ID_TERUMAH,             ID_NULL,    ID_NULL,      /* 19 */
   ID_TETSAVVEH,           ID_NULL,    ID_NULL,      /* 20 */
   ID_KITISSA,             ID_NULL,    ID_NULL,      /* 21 */
   ID_VAYAKHEL,            ID_SHEKALIM,ID_NULL,      /* 22 */
   ID_PEKUDE,              ID_NULL,    ID_NULL,      /* 23 */
   ID_VAYIKRA,             ID_ZAHOR,   ID_NULL,      /* 24 */
   ID_TSAV,                ID_PARAH,   ID_NULL,      /* 25 */
   ID_SHEMINI,             ID_HAHODESH,ID_NULL,      /* 26 */
   ID_TAZRIANG,            ID_NULL,    ID_NULL,      /* 27 */
   ID_METSORANG,           ID_HAGGADOL,ID_NULL,      /* 28 */
   ID_HOL_HAMOED_PESAH,    ID_NULL,    ID_NULL,      /* 29 */
   ID_AHAREMOTH,           ID_NULL,    ID_NULL,      /* 30 */
   ID_KEDOSHIM,            ID_NULL,    ID_NULL,      /* 31 */
   ID_EMOR,                ID_NULL,    ID_NULL,      /* 32 */
   ID_BEHAR,               ID_NULL,    ID_NULL,      /* 33 */
   ID_BEHUKKOTHAI,         ID_NULL,    ID_NULL,      /* 34 */
   ID_BEMIDBAR,            ID_NULL,    ID_NULL,      /* 35 */
   ID_NASO,                ID_NULL,    ID_NULL,      /* 36 */
   ID_BEHAALOTEHA,         ID_NULL,    ID_NULL,      /* 37 */
   ID_SHELAHLEHA,          ID_NULL,    ID_NULL,      /* 38 */
   ID_KORAH,               ID_NULL,    ID_NULL,      /* 39 */
   ID_HUKATH,              ID_NULL,    ID_NULL,      /* 40 */
   ID_BALAK,               ID_NULL,    ID_NULL,      /* 41 */
   ID_PINHAS,              ID_NULL,    ID_NULL,      /* 42 */
   ID_MATOTH,              ID_MASEH,   ID_NULL,      /* 43 */
   ID_DEBARIM,             ID_NULL,    ID_NULL,      /* 44 */
   ID_VAETHANAN,           ID_NULL,    ID_NULL,      /* 45 */
   ID_EKEB,                ID_NULL,    ID_NULL,      /* 46 */
   ID_REEH,                ID_NULL,    ID_NULL,      /* 47 */
   ID_SHOFETIM,            ID_NULL,    ID_NULL,      /* 48 */
   ID_KITETSE,             ID_NULL,    ID_NULL,      /* 49 */
   ID_KITABO,              ID_NULL,    ID_NULL,      /* 50 */
   ID_NITSABIM,            ID_VAYELEH, ID_NULL,      /* 51 */
   ID_HAAZINU,             ID_NULL,    ID_NULL,      /* 52 */
   ID_YOM_KIPPUR,          ID_NULL,    ID_NULL,      /* 53 */
   ID_HOL_HAMOED_SUCCOTH,  ID_NULL,    ID_NULL);     /* 54 */

  torahSectionsKDiaspora = new Array
  (ID_BERESHITH,           ID_NULL,    ID_NULL,      /*  1 */
   ID_NOAH,                ID_NULL,    ID_NULL,      /*  2 */
   ID_LEHLEHA,             ID_NULL,    ID_NULL,      /*  3 */
   ID_VAYERA,              ID_NULL,    ID_NULL,      /*  4 */
   ID_HAYESARAH,           ID_NULL,    ID_NULL,      /*  5 */
   ID_TOLEDOTH,            ID_NULL,    ID_NULL,      /*  6 */
   ID_VAYETSE,             ID_NULL,    ID_NULL,      /*  7 */
   ID_VAYISHLAH,           ID_NULL,    ID_NULL,      /*  8 */
   ID_VAYESHEB,            ID_NULL,    ID_NULL,      /*  9 */
   ID_MIKKETS,             ID_NULL,    ID_NULL,      /* 10 */
   ID_VAYIGGASH,           ID_NULL,    ID_NULL,      /* 11 */
   ID_VAYHEE,              ID_NULL,    ID_NULL,      /* 12 */
   ID_SHEMOTH,             ID_NULL,    ID_NULL,      /* 13 */
   ID_VAERA,               ID_NULL,    ID_NULL,      /* 14 */
   ID_BO,                  ID_NULL,    ID_NULL,      /* 15 */
   ID_BESHALLAH,           ID_NULL,    ID_NULL,      /* 16 */
   ID_YITHRO,              ID_NULL,    ID_NULL,      /* 17 */
   ID_MISHPATIM,           ID_NULL,    ID_NULL,      /* 18 */
   ID_TERUMAH,             ID_NULL,    ID_NULL,      /* 19 */
   ID_TETSAVVEH,           ID_NULL,    ID_NULL,      /* 20 */
   ID_KITISSA,             ID_NULL,    ID_NULL,      /* 21 */
   ID_VAYAKHEL,            ID_SHEKALIM,ID_NULL,      /* 22 */
   ID_PEKUDE,              ID_NULL,    ID_NULL,      /* 23 */
   ID_VAYIKRA,             ID_ZAHOR,   ID_NULL,      /* 24 */
   ID_TSAV,                ID_NULL,    ID_NULL,      /* 25 */
   ID_SHEMINI,             ID_PARAH,   ID_NULL,      /* 26 */
   ID_TAZRIANG,            ID_HAHODESH,ID_NULL,      /* 27 */
   ID_METSORANG,           ID_HAGGADOL,ID_NULL,      /* 28 */
   ID_PESAH_I,             ID_NULL,    ID_NULL,      /* 29 */
   ID_PESAH_VIII,          ID_NULL,    ID_NULL,      /* 30 */
   ID_AHAREMOTH,           ID_NULL,    ID_NULL,      /* 31 */
   ID_KEDOSHIM,            ID_NULL,    ID_NULL,      /* 32 */
   ID_EMOR,                ID_NULL,    ID_NULL,      /* 33 */
   ID_BEHAR,               ID_NULL,    ID_NULL,      /* 34 */
   ID_BEHUKKOTHAI,         ID_NULL,    ID_NULL,      /* 35 */
   ID_BEMIDBAR,            ID_NULL,    ID_NULL,      /* 36 */
   ID_NASO,                ID_NULL,    ID_NULL,      /* 37 */
   ID_BEHAALOTEHA,         ID_NULL,    ID_NULL,      /* 38 */
   ID_SHELAHLEHA,          ID_NULL,    ID_NULL,      /* 39 */
   ID_KORAH,               ID_NULL,    ID_NULL,      /* 40 */
   ID_HUKATH,              ID_NULL,    ID_NULL,      /* 41 */
   ID_BALAK,               ID_NULL,    ID_NULL,      /* 42 */
   ID_PINHAS,              ID_NULL,    ID_NULL,      /* 43 */
   ID_MATOTH,              ID_MASEH,   ID_NULL,      /* 44 */
   ID_DEBARIM,             ID_NULL,    ID_NULL,      /* 45 */
   ID_VAETHANAN,           ID_NULL,    ID_NULL,      /* 46 */
   ID_EKEB,                ID_NULL,    ID_NULL,      /* 47 */
   ID_REEH,                ID_NULL,    ID_NULL,      /* 48 */
   ID_SHOFETIM,            ID_NULL,    ID_NULL,      /* 49 */
   ID_KITETSE,             ID_NULL,    ID_NULL,      /* 50 */
   ID_KITABO,              ID_NULL,    ID_NULL,      /* 51 */
   ID_NITSABIM,            ID_NULL,    ID_NULL,      /* 52 */
   ID_VAYELEH,             ID_NULL,    ID_NULL,      /* 53 */
   ID_HAAZINU,             ID_NULL,    ID_NULL,      /* 54 */
   ID_HOL_HAMOED_SUCCOTH,  ID_NULL,    ID_NULL);     /* 55 */

  torahSectionsKIsrael = new Array
  (ID_BERESHITH,           ID_NULL,    ID_NULL,      /*  1 */
   ID_NOAH,                ID_NULL,    ID_NULL,      /*  2 */
   ID_LEHLEHA,             ID_NULL,    ID_NULL,      /*  3 */
   ID_VAYERA,              ID_NULL,    ID_NULL,      /*  4 */
   ID_HAYESARAH,           ID_NULL,    ID_NULL,      /*  5 */
   ID_TOLEDOTH,            ID_NULL,    ID_NULL,      /*  6 */
   ID_VAYETSE,             ID_NULL,    ID_NULL,      /*  7 */
   ID_VAYISHLAH,           ID_NULL,    ID_NULL,      /*  8 */
   ID_VAYESHEB,            ID_NULL,    ID_NULL,      /*  9 */
   ID_MIKKETS,             ID_NULL,    ID_NULL,      /* 10 */
   ID_VAYIGGASH,           ID_NULL,    ID_NULL,      /* 11 */
   ID_VAYHEE,              ID_NULL,    ID_NULL,      /* 12 */
   ID_SHEMOTH,             ID_NULL,    ID_NULL,      /* 13 */
   ID_VAERA,               ID_NULL,    ID_NULL,      /* 14 */
   ID_BO,                  ID_NULL,    ID_NULL,      /* 15 */
   ID_BESHALLAH,           ID_NULL,    ID_NULL,      /* 16 */
   ID_YITHRO,              ID_NULL,    ID_NULL,      /* 17 */
   ID_MISHPATIM,           ID_NULL,    ID_NULL,      /* 18 */
   ID_TERUMAH,             ID_NULL,    ID_NULL,      /* 19 */
   ID_TETSAVVEH,           ID_NULL,    ID_NULL,      /* 20 */
   ID_KITISSA,             ID_NULL,    ID_NULL,      /* 21 */
   ID_VAYAKHEL,            ID_SHEKALIM,ID_NULL,      /* 22 */
   ID_PEKUDE,              ID_NULL,    ID_NULL,      /* 23 */
   ID_VAYIKRA,             ID_ZAHOR,   ID_NULL,      /* 24 */
   ID_TSAV,                ID_NULL,    ID_NULL,      /* 25 */
   ID_SHEMINI,             ID_PARAH,   ID_NULL,      /* 26 */
   ID_TAZRIANG,            ID_HAHODESH,ID_NULL,      /* 27 */
   ID_METSORANG,           ID_HAGGADOL,ID_NULL,      /* 28 */
   ID_PESAH_I,             ID_NULL,    ID_NULL,      /* 29 */
   ID_AHAREMOTH,           ID_NULL,    ID_NULL,      /* 30 */
   ID_KEDOSHIM,            ID_NULL,    ID_NULL,      /* 31 */
   ID_EMOR,                ID_NULL,    ID_NULL,      /* 32 */
   ID_BEHAR,               ID_NULL,    ID_NULL,      /* 33 */
   ID_BEHUKKOTHAI,         ID_NULL,    ID_NULL,      /* 34 */
   ID_BEMIDBAR,            ID_NULL,    ID_NULL,      /* 35 */
   ID_NASO,                ID_NULL,    ID_NULL,      /* 36 */
   ID_BEHAALOTEHA,         ID_NULL,    ID_NULL,      /* 37 */
   ID_SHELAHLEHA,          ID_NULL,    ID_NULL,      /* 38 */
   ID_KORAH,               ID_NULL,    ID_NULL,      /* 39 */
   ID_HUKATH,              ID_NULL,    ID_NULL,      /* 40 */
   ID_BALAK,               ID_NULL,    ID_NULL,      /* 41 */
   ID_PINHAS,              ID_NULL,    ID_NULL,      /* 42 */
   ID_MATOTH,              ID_NULL,    ID_NULL,      /* 43 */
   ID_MASEH,               ID_NULL,    ID_NULL,      /* 44 */
   ID_DEBARIM,             ID_NULL,    ID_NULL,      /* 45 */
   ID_VAETHANAN,           ID_NULL,    ID_NULL,      /* 46 */
   ID_EKEB,                ID_NULL,    ID_NULL,      /* 47 */
   ID_REEH,                ID_NULL,    ID_NULL,      /* 48 */
   ID_SHOFETIM,            ID_NULL,    ID_NULL,      /* 49 */
   ID_KITETSE,             ID_NULL,    ID_NULL,      /* 50 */
   ID_KITABO,              ID_NULL,    ID_NULL,      /* 51 */
   ID_NITSABIM,            ID_NULL,    ID_NULL,      /* 52 */
   ID_VAYELEH,             ID_NULL,    ID_NULL,      /* 53 */
   ID_HAAZINU,             ID_NULL,    ID_NULL,      /* 54 */
   ID_HOL_HAMOED_SUCCOTH,  ID_NULL,    ID_NULL);     /* 55 */

  torahSectionsLDiaspora = new Array
  (ID_BERESHITH,           ID_NULL,    ID_NULL,      /*  1 */
   ID_NOAH,                ID_NULL,    ID_NULL,      /*  2 */
   ID_LEHLEHA,             ID_NULL,    ID_NULL,      /*  3 */
   ID_VAYERA,              ID_NULL,    ID_NULL,      /*  4 */
   ID_HAYESARAH,           ID_NULL,    ID_NULL,      /*  5 */
   ID_TOLEDOTH,            ID_NULL,    ID_NULL,      /*  6 */
   ID_VAYETSE,             ID_NULL,    ID_NULL,      /*  7 */
   ID_VAYISHLAH,           ID_NULL,    ID_NULL,      /*  8 */
   ID_VAYESHEB,            ID_NULL,    ID_NULL,      /*  9 */
   ID_MIKKETS,             ID_NULL,    ID_NULL,      /* 10 */
   ID_VAYIGGASH,           ID_NULL,    ID_NULL,      /* 11 */
   ID_VAYHEE,              ID_NULL,    ID_NULL,      /* 12 */
   ID_SHEMOTH,             ID_NULL,    ID_NULL,      /* 13 */
   ID_VAERA,               ID_NULL,    ID_NULL,      /* 14 */
   ID_BO,                  ID_NULL,    ID_NULL,      /* 15 */
   ID_BESHALLAH,           ID_NULL,    ID_NULL,      /* 16 */
   ID_YITHRO,              ID_NULL,    ID_NULL,      /* 17 */
   ID_MISHPATIM,           ID_NULL,    ID_NULL,      /* 18 */
   ID_TERUMAH,             ID_NULL,    ID_NULL,      /* 19 */
   ID_TETSAVVEH,           ID_NULL,    ID_NULL,      /* 20 */
   ID_KITISSA,             ID_NULL,    ID_NULL,      /* 21 */
   ID_VAYAKHEL,            ID_SHEKALIM,ID_NULL,      /* 22 */
   ID_PEKUDE,              ID_NULL,    ID_NULL,      /* 23 */
   ID_VAYIKRA,             ID_ZAHOR,  ID_NULL,      /* 24 */
   ID_TSAV,                ID_NULL,    ID_NULL,      /* 25 */
   ID_SHEMINI,             ID_PARAH,   ID_NULL,      /* 26 */
   ID_TAZRIANG,            ID_HAHODESH,ID_NULL,      /* 27 */
   ID_METSORANG,           ID_HAGGADOL,ID_NULL,      /* 28 */
   ID_PESAH_I,             ID_NULL,    ID_NULL,      /* 29 */
   ID_PESAH_VIII,          ID_NULL,    ID_NULL,      /* 30 */
   ID_AHAREMOTH,           ID_NULL,    ID_NULL,      /* 31 */
   ID_KEDOSHIM,            ID_NULL,    ID_NULL,      /* 32 */
   ID_EMOR,                ID_NULL,    ID_NULL,      /* 33 */
   ID_BEHAR,               ID_NULL,    ID_NULL,      /* 34 */
   ID_BEHUKKOTHAI,         ID_NULL,    ID_NULL,      /* 35 */
   ID_BEMIDBAR,            ID_NULL,    ID_NULL,      /* 36 */
   ID_NASO,                ID_NULL,    ID_NULL,      /* 37 */
   ID_BEHAALOTEHA,         ID_NULL,    ID_NULL,      /* 38 */
   ID_SHELAHLEHA,          ID_NULL,    ID_NULL,      /* 39 */
   ID_KORAH,               ID_NULL,    ID_NULL,      /* 40 */
   ID_HUKATH,              ID_NULL,    ID_NULL,      /* 41 */
   ID_BALAK,               ID_NULL,    ID_NULL,      /* 42 */
   ID_PINHAS,              ID_NULL,    ID_NULL,      /* 43 */
   ID_MATOTH,              ID_MASEH,   ID_NULL,      /* 44 */
   ID_DEBARIM,             ID_NULL,    ID_NULL,      /* 45 */
   ID_VAETHANAN,           ID_NULL,    ID_NULL,      /* 46 */
   ID_EKEB,                ID_NULL,    ID_NULL,      /* 47 */
   ID_REEH,                ID_NULL,    ID_NULL,      /* 48 */
   ID_SHOFETIM,            ID_NULL,    ID_NULL,      /* 49 */
   ID_KITETSE,             ID_NULL,    ID_NULL,      /* 50 */
   ID_KITABO,              ID_NULL,    ID_NULL,      /* 51 */
   ID_NITSABIM,            ID_NULL,    ID_NULL,      /* 52 */
   ID_VAYELEH,             ID_NULL,    ID_NULL,      /* 53 */
   ID_HAAZINU,             ID_NULL,    ID_NULL,      /* 54 */
   ID_HOL_HAMOED_SUCCOTH,  ID_NULL,    ID_NULL);     /* 55 */

  torahSectionsLIsrael = new Array
  (ID_BERESHITH,           ID_NULL,    ID_NULL,      /*  1 */
   ID_NOAH,                ID_NULL,    ID_NULL,      /*  2 */
   ID_LEHLEHA,             ID_NULL,    ID_NULL,      /*  3 */
   ID_VAYERA,              ID_NULL,    ID_NULL,      /*  4 */
   ID_HAYESARAH,           ID_NULL,    ID_NULL,      /*  5 */
   ID_TOLEDOTH,            ID_NULL,    ID_NULL,      /*  6 */
   ID_VAYETSE,             ID_NULL,    ID_NULL,      /*  7 */
   ID_VAYISHLAH,           ID_NULL,    ID_NULL,      /*  8 */
   ID_VAYESHEB,            ID_NULL,    ID_NULL,      /*  9 */
   ID_MIKKETS,             ID_NULL,    ID_NULL,      /* 10 */
   ID_VAYIGGASH,           ID_NULL,    ID_NULL,      /* 11 */
   ID_VAYHEE,              ID_NULL,    ID_NULL,      /* 12 */
   ID_SHEMOTH,             ID_NULL,    ID_NULL,      /* 13 */
   ID_VAERA,               ID_NULL,    ID_NULL,      /* 14 */
   ID_BO,                  ID_NULL,    ID_NULL,      /* 15 */
   ID_BESHALLAH,           ID_NULL,    ID_NULL,      /* 16 */
   ID_YITHRO,              ID_NULL,    ID_NULL,      /* 17 */
   ID_MISHPATIM,           ID_NULL,    ID_NULL,      /* 18 */
   ID_TERUMAH,             ID_NULL,    ID_NULL,      /* 19 */
   ID_TETSAVVEH,           ID_NULL,    ID_NULL,      /* 20 */
   ID_KITISSA,             ID_NULL,    ID_NULL,      /* 21 */
   ID_VAYAKHEL,            ID_SHEKALIM,ID_NULL,      /* 22 */
   ID_PEKUDE,              ID_NULL,    ID_NULL,      /* 23 */
   ID_VAYIKRA,             ID_ZAHOR,  ID_NULL,      /* 24 */
   ID_TSAV,                ID_NULL,    ID_NULL,      /* 25 */
   ID_SHEMINI,             ID_PARAH,   ID_NULL,      /* 26 */
   ID_TAZRIANG,            ID_HAHODESH,ID_NULL,      /* 27 */
   ID_METSORANG,           ID_HAGGADOL,ID_NULL,      /* 28 */
   ID_PESAH_I,             ID_NULL,    ID_NULL,      /* 29 */
   ID_AHAREMOTH,           ID_NULL,    ID_NULL,      /* 30 */
   ID_KEDOSHIM,            ID_NULL,    ID_NULL,      /* 31 */
   ID_EMOR,                ID_NULL,    ID_NULL,      /* 32 */
   ID_BEHAR,               ID_NULL,    ID_NULL,      /* 33 */
   ID_BEHUKKOTHAI,         ID_NULL,    ID_NULL,      /* 34 */
   ID_BEMIDBAR,            ID_NULL,    ID_NULL,      /* 35 */
   ID_NASO,                ID_NULL,    ID_NULL,      /* 36 */
   ID_BEHAALOTEHA,         ID_NULL,    ID_NULL,      /* 37 */
   ID_SHELAHLEHA,          ID_NULL,    ID_NULL,      /* 38 */
   ID_KORAH,               ID_NULL,    ID_NULL,      /* 39 */
   ID_HUKATH,              ID_NULL,    ID_NULL,      /* 40 */
   ID_BALAK,               ID_NULL,    ID_NULL,      /* 41 */
   ID_PINHAS,              ID_NULL,    ID_NULL,      /* 42 */
   ID_MATOTH,              ID_NULL,    ID_NULL,      /* 43 */
   ID_MASEH,               ID_NULL,    ID_NULL,      /* 44 */
   ID_DEBARIM,             ID_NULL,    ID_NULL,      /* 45 */
   ID_VAETHANAN,           ID_NULL,    ID_NULL,      /* 46 */
   ID_EKEB,                ID_NULL,    ID_NULL,      /* 47 */
   ID_REEH,                ID_NULL,    ID_NULL,      /* 48 */
   ID_SHOFETIM,            ID_NULL,    ID_NULL,      /* 49 */
   ID_KITETSE,             ID_NULL,    ID_NULL,      /* 50 */
   ID_KITABO,              ID_NULL,    ID_NULL,      /* 51 */
   ID_NITSABIM,            ID_NULL,    ID_NULL,      /* 52 */
   ID_VAYELEH,             ID_NULL,    ID_NULL,      /* 53 */
   ID_HAAZINU,             ID_NULL,    ID_NULL,      /* 54 */
   ID_HOL_HAMOED_SUCCOTH,  ID_NULL,    ID_NULL);     /* 55 */

  torahSectionsM = new Array
  (ID_BERESHITH,           ID_NULL,    ID_NULL,      /*  1 */
   ID_NOAH,                ID_NULL,    ID_NULL,      /*  2 */
   ID_LEHLEHA,             ID_NULL,    ID_NULL,      /*  3 */
   ID_VAYERA,              ID_NULL,    ID_NULL,      /*  4 */
   ID_HAYESARAH,           ID_NULL,    ID_NULL,      /*  5 */
   ID_TOLEDOTH,            ID_NULL,    ID_NULL,      /*  6 */
   ID_VAYETSE,             ID_NULL,    ID_NULL,      /*  7 */
   ID_VAYISHLAH,           ID_NULL,    ID_NULL,      /*  8 */
   ID_VAYESHEB,            ID_NULL,    ID_NULL,      /*  9 */
   ID_MIKKETS,             ID_NULL,    ID_NULL,      /* 10 */
   ID_VAYIGGASH,           ID_NULL,    ID_NULL,      /* 11 */
   ID_VAYHEE,              ID_NULL,    ID_NULL,      /* 12 */
   ID_SHEMOTH,             ID_NULL,    ID_NULL,      /* 13 */
   ID_VAERA,               ID_NULL,    ID_NULL,      /* 14 */
   ID_BO,                  ID_NULL,    ID_NULL,      /* 15 */
   ID_BESHALLAH,           ID_NULL,    ID_NULL,      /* 16 */
   ID_YITHRO,              ID_NULL,    ID_NULL,      /* 17 */
   ID_MISHPATIM,           ID_NULL,    ID_NULL,      /* 18 */
   ID_TERUMAH,             ID_NULL,    ID_NULL,      /* 19 */
   ID_TETSAVVEH,           ID_NULL,    ID_NULL,      /* 20 */
   ID_KITISSA,             ID_NULL,    ID_NULL,      /* 21 */
   ID_VAYAKHEL,            ID_NULL,    ID_NULL,      /* 22 */
   ID_PEKUDE,              ID_SHEKALIM,ID_NULL,      /* 23 */
   ID_VAYIKRA,             ID_NULL,    ID_NULL,      /* 24 */
   ID_TSAV,                ID_ZAHOR,   ID_NULL,      /* 25 */
   ID_SHEMINI,             ID_PARAH,   ID_NULL,      /* 26 */
   ID_TAZRIANG,            ID_HAHODESH,ID_NULL,      /* 27 */
   ID_METSORANG,           ID_NULL,    ID_NULL,      /* 28 */
   ID_AHAREMOTH,           ID_HAGGADOL,ID_NULL,      /* 29 */
   ID_HOL_HAMOED_PESAH,    ID_NULL,    ID_NULL,      /* 30 */
   ID_KEDOSHIM,            ID_NULL,    ID_NULL,      /* 31 */
   ID_EMOR,                ID_NULL,    ID_NULL,      /* 32 */
   ID_BEHAR,               ID_NULL,    ID_NULL,      /* 33 */
   ID_BEHUKKOTHAI,         ID_NULL,    ID_NULL,      /* 34 */
   ID_BEMIDBAR,            ID_NULL,    ID_NULL,      /* 35 */
   ID_NASO,                ID_NULL,    ID_NULL,      /* 36 */
   ID_BEHAALOTEHA,         ID_NULL,    ID_NULL,      /* 37 */
   ID_SHELAHLEHA,          ID_NULL,    ID_NULL,      /* 38 */
   ID_KORAH,               ID_NULL,    ID_NULL,      /* 39 */
   ID_HUKATH,              ID_NULL,    ID_NULL,      /* 40 */
   ID_BALAK,               ID_NULL,    ID_NULL,      /* 41 */
   ID_PINHAS,              ID_NULL,    ID_NULL,      /* 42 */
   ID_MATOTH,              ID_NULL,    ID_NULL,      /* 43 */
   ID_MASEH,               ID_NULL,    ID_NULL,      /* 44 */
   ID_DEBARIM,             ID_NULL,    ID_NULL,      /* 45 */
   ID_VAETHANAN,           ID_NULL,    ID_NULL,      /* 46 */
   ID_EKEB,                ID_NULL,    ID_NULL,      /* 47 */
   ID_REEH,                ID_NULL,    ID_NULL,      /* 48 */
   ID_SHOFETIM,            ID_NULL,    ID_NULL,      /* 49 */
   ID_KITETSE,             ID_NULL,    ID_NULL,      /* 50 */
   ID_KITABO,              ID_NULL,    ID_NULL,      /* 51 */
   ID_NITSABIM,            ID_VAYELEH, ID_NULL,      /* 52 */
   ID_HAAZINU,             ID_NULL,    ID_NULL,      /* 53 */
   ID_YOM_KIPPUR,          ID_NULL,    ID_NULL,      /* 54 */
   ID_HOL_HAMOED_SUCCOTH,  ID_NULL,    ID_NULL);     /* 55 */

  torahSectionsNDiaspora = new Array
  (ID_BERESHITH,           ID_NULL,    ID_NULL,      /*  1 */
   ID_NOAH,                ID_NULL,    ID_NULL,      /*  2 */
   ID_LEHLEHA,             ID_NULL,    ID_NULL,      /*  3 */
   ID_VAYERA,              ID_NULL,    ID_NULL,      /*  4 */
   ID_HAYESARAH,           ID_NULL,    ID_NULL,      /*  5 */
   ID_TOLEDOTH,            ID_NULL,    ID_NULL,      /*  6 */
   ID_VAYETSE,             ID_NULL,    ID_NULL,      /*  7 */
   ID_VAYISHLAH,           ID_NULL,    ID_NULL,      /*  8 */
   ID_VAYESHEB,            ID_NULL,    ID_NULL,      /*  9 */
   ID_MIKKETS,             ID_NULL,    ID_NULL,      /* 10 */
   ID_VAYIGGASH,           ID_NULL,    ID_NULL,      /* 11 */
   ID_VAYHEE,              ID_NULL,    ID_NULL,      /* 12 */
   ID_SHEMOTH,             ID_NULL,    ID_NULL,      /* 13 */
   ID_VAERA,               ID_NULL,    ID_NULL,      /* 14 */
   ID_BO,                  ID_NULL,    ID_NULL,      /* 15 */
   ID_BESHALLAH,           ID_NULL,    ID_NULL,      /* 16 */
   ID_YITHRO,              ID_NULL,    ID_NULL,      /* 17 */
   ID_MISHPATIM,           ID_NULL,    ID_NULL,      /* 18 */
   ID_TERUMAH,             ID_NULL,    ID_NULL,      /* 19 */
   ID_TETSAVVEH,           ID_NULL,    ID_NULL,      /* 20 */
   ID_KITISSA,             ID_NULL,    ID_NULL,      /* 21 */
   ID_VAYAKHEL,            ID_SHEKALIM,ID_NULL,      /* 22 */
   ID_PEKUDE,              ID_NULL,    ID_NULL,      /* 23 */
   ID_VAYIKRA,             ID_ZAHOR,   ID_NULL,      /* 24 */
   ID_TSAV,                ID_PARAH,   ID_NULL,      /* 25 */
   ID_SHEMINI,             ID_HAHODESH,ID_NULL,      /* 26 */
   ID_TAZRIANG,            ID_NULL,    ID_NULL,      /* 27 */
   ID_METSORANG,           ID_HAGGADOL,ID_NULL,      /* 28 */
   ID_HOL_HAMOED_PESAH,    ID_NULL,    ID_NULL,      /* 29 */
   ID_AHAREMOTH,           ID_NULL,    ID_NULL,      /* 30 */
   ID_KEDOSHIM,            ID_NULL,    ID_NULL,      /* 31 */
   ID_EMOR,                ID_NULL,    ID_NULL,      /* 32 */
   ID_BEHAR,               ID_NULL,    ID_NULL,      /* 33 */
   ID_BEHUKKOTHAI,         ID_NULL,    ID_NULL,      /* 34 */
   ID_BEMIDBAR,            ID_NULL,    ID_NULL,      /* 35 */
   ID_SHAVUOTH_II,         ID_NULL,    ID_NULL,      /* 36 */
   ID_NASO,                ID_NULL,    ID_NULL,      /* 37 */
   ID_BEHAALOTEHA,         ID_NULL,    ID_NULL,      /* 38 */
   ID_SHELAHLEHA,          ID_NULL,    ID_NULL,      /* 39 */
   ID_KORAH,               ID_NULL,    ID_NULL,      /* 40 */
   ID_HUKATH,              ID_BALAK,   ID_NULL,      /* 41 */
   ID_PINHAS,              ID_NULL,    ID_NULL,      /* 42 */
   ID_MATOTH,              ID_MASEH,   ID_NULL,      /* 43 */
   ID_DEBARIM,             ID_NULL,    ID_NULL,      /* 44 */
   ID_VAETHANAN,           ID_NULL,    ID_NULL,      /* 45 */
   ID_EKEB,                ID_NULL,    ID_NULL,      /* 46 */
   ID_REEH,                ID_NULL,    ID_NULL,      /* 47 */
   ID_SHOFETIM,            ID_NULL,    ID_NULL,      /* 48 */
   ID_KITETSE,             ID_NULL,    ID_NULL,      /* 49 */
   ID_KITABO,              ID_NULL,    ID_NULL,      /* 50 */
   ID_NITSABIM,            ID_VAYELEH, ID_NULL,      /* 51 */
   ID_ROSH_HASHANAH_I,     ID_NULL,    ID_NULL,      /* 52 */
   ID_HAAZINU,             ID_NULL,    ID_NULL,      /* 53 */
   ID_SUCCOTH_I,           ID_NULL,    ID_NULL,      /* 54 */
   ID_SHEMINI_AZERETH,     ID_NULL,    ID_NULL);     /* 55 */

  torahSectionsNIsrael = new Array
  (ID_BERESHITH,           ID_NULL,    ID_NULL,      /*  1 */
   ID_NOAH,                ID_NULL,    ID_NULL,      /*  2 */
   ID_LEHLEHA,             ID_NULL,    ID_NULL,      /*  3 */
   ID_VAYERA,              ID_NULL,    ID_NULL,      /*  4 */
   ID_HAYESARAH,           ID_NULL,    ID_NULL,      /*  5 */
   ID_TOLEDOTH,            ID_NULL,    ID_NULL,      /*  6 */
   ID_VAYETSE,             ID_NULL,    ID_NULL,      /*  7 */
   ID_VAYISHLAH,           ID_NULL,    ID_NULL,      /*  8 */
   ID_VAYESHEB,            ID_NULL,    ID_NULL,      /*  9 */
   ID_MIKKETS,             ID_NULL,    ID_NULL,      /* 10 */
   ID_VAYIGGASH,           ID_NULL,    ID_NULL,      /* 11 */
   ID_VAYHEE,              ID_NULL,    ID_NULL,      /* 12 */
   ID_SHEMOTH,             ID_NULL,    ID_NULL,      /* 13 */
   ID_VAERA,               ID_NULL,    ID_NULL,      /* 14 */
   ID_BO,                  ID_NULL,    ID_NULL,      /* 15 */
   ID_BESHALLAH,           ID_NULL,    ID_NULL,      /* 16 */
   ID_YITHRO,              ID_NULL,    ID_NULL,      /* 17 */
   ID_MISHPATIM,           ID_NULL,    ID_NULL,      /* 18 */
   ID_TERUMAH,             ID_NULL,    ID_NULL,      /* 19 */
   ID_TETSAVVEH,           ID_NULL,    ID_NULL,      /* 20 */
   ID_KITISSA,             ID_NULL,    ID_NULL,      /* 21 */
   ID_VAYAKHEL,            ID_SHEKALIM,ID_NULL,      /* 22 */
   ID_PEKUDE,              ID_NULL,    ID_NULL,      /* 23 */
   ID_VAYIKRA,             ID_ZAHOR,   ID_NULL,      /* 24 */
   ID_TSAV,                ID_PARAH,   ID_NULL,      /* 25 */
   ID_SHEMINI,             ID_HAHODESH,ID_NULL,      /* 26 */
   ID_TAZRIANG,            ID_NULL,    ID_NULL,      /* 27 */
   ID_METSORANG,           ID_HAGGADOL,ID_NULL,      /* 28 */
   ID_HOL_HAMOED_PESAH,    ID_NULL,    ID_NULL,      /* 29 */
   ID_AHAREMOTH,           ID_NULL,    ID_NULL,      /* 30 */
   ID_KEDOSHIM,            ID_NULL,    ID_NULL,      /* 31 */
   ID_EMOR,                ID_NULL,    ID_NULL,      /* 32 */
   ID_BEHAR,               ID_NULL,    ID_NULL,      /* 33 */
   ID_BEHUKKOTHAI,         ID_NULL,    ID_NULL,      /* 34 */
   ID_BEMIDBAR,            ID_NULL,    ID_NULL,      /* 35 */
   ID_NASO,                ID_NULL,    ID_NULL,      /* 36 */
   ID_BEHAALOTEHA,         ID_NULL,    ID_NULL,      /* 37 */
   ID_SHELAHLEHA,          ID_NULL,    ID_NULL,      /* 38 */
   ID_KORAH,               ID_NULL,    ID_NULL,      /* 39 */
   ID_HUKATH,              ID_NULL,    ID_NULL,      /* 40 */
   ID_BALAK,               ID_NULL,    ID_NULL,      /* 41 */
   ID_PINHAS,              ID_NULL,    ID_NULL,      /* 42 */
   ID_MATOTH,              ID_MASEH,   ID_NULL,      /* 43 */
   ID_DEBARIM,             ID_NULL,    ID_NULL,      /* 44 */
   ID_VAETHANAN,           ID_NULL,    ID_NULL,      /* 45 */
   ID_EKEB,                ID_NULL,    ID_NULL,      /* 46 */
   ID_REEH,                ID_NULL,    ID_NULL,      /* 47 */
   ID_SHOFETIM,            ID_NULL,    ID_NULL,      /* 48 */
   ID_KITETSE,             ID_NULL,    ID_NULL,      /* 49 */
   ID_KITABO,              ID_NULL,    ID_NULL,      /* 50 */
   ID_NITSABIM,            ID_VAYELEH, ID_NULL,      /* 51 */
   ID_ROSH_HASHANAH_I,     ID_NULL,    ID_NULL,      /* 52 */
   ID_HAAZINU,             ID_NULL,    ID_NULL,      /* 53 */
   ID_SUCCOTH_I,           ID_NULL,    ID_NULL,      /* 54 */
   ID_SHEMINI_AZERETH,     ID_NULL,    ID_NULL);     /* 55 */
}

function getYearType(year) {
  year = new Number(year);
  rhWeekday = getWeekday(absoluteFromHebrew(1, 7, year));
  
  lengthOfYear = absoluteFromHebrew(1, 7, year+1) - absoluteFromHebrew(1, 7, year);
  
  pesWeekday = getWeekday(absoluteFromHebrew(1, 1, year));
  
  

  if ((rhWeekday == 1) && (lengthOfYear == 353) && (pesWeekday == 2)) return 1;
  if ((rhWeekday == 6) && (lengthOfYear == 353) && (pesWeekday == 0)) return 2;
  if ((rhWeekday == 2) && (lengthOfYear == 354) && (pesWeekday == 4)) return 3;
  if ((rhWeekday == 4) && (lengthOfYear == 354) && (pesWeekday == 6)) return 4;
  if ((rhWeekday == 1) && (lengthOfYear == 355) && (pesWeekday == 4)) return 5;
  if ((rhWeekday == 4) && (lengthOfYear == 355) && (pesWeekday == 0)) return 6;
  if ((rhWeekday == 6) && (lengthOfYear == 355) && (pesWeekday == 2)) return 7;

  if ((rhWeekday == 1) && (lengthOfYear == 383) && (pesWeekday == 4)) return 8;
  if ((rhWeekday == 4) && (lengthOfYear == 383) && (pesWeekday == 0)) return 9;
  if ((rhWeekday == 6) && (lengthOfYear == 383) && (pesWeekday == 2)) return 10;
  if ((rhWeekday == 2) && (lengthOfYear == 384) && (pesWeekday == 6)) return 11;
  if ((rhWeekday == 1) && (lengthOfYear == 385) && (pesWeekday == 6)) return 12;
  if ((rhWeekday == 4) && (lengthOfYear == 385) && (pesWeekday == 2)) return 13;
  if ((rhWeekday == 6) && (lengthOfYear == 385) && (pesWeekday == 4)) return 14;

  return 0;
}

function determineBereshith(year) {
  simchatTorah = absoluteFromHebrew(23, 7, year);
  while (getWeekday(simchatTorah) != 6) {
    simchatTorah++;
  }
  return (simchatTorah);
}

function getTorahSections(hebrewDay, hebrewMonth, hebrewYear) {
  hebrewDay = new Number(hebrewDay);
  hebrewMonth = new Number(hebrewMonth);
  hebrewYear = new Number(hebrewYear);
  
  shuvahDate = absoluteFromHebrew(1, 7, hebrewYear)+1;
 
  while (getWeekday(shuvahDate) != 6) {
    shuvahDate++;
  }
  
  
  torahDate = absoluteFromHebrew(hebrewDay, hebrewMonth, hebrewYear);
  
  if (getWeekday(torahDate) == 6) {
    
    bereshithDate = determineBereshith(hebrewYear);
    
    if (torahDate < bereshithDate)
      referenceYear = hebrewYear-1;
    else
      referenceYear = hebrewYear;

    yearType = getYearType(referenceYear);
    bereshithDate = determineBereshith(referenceYear);
    torahWeekNo = (torahDate-bereshithDate)/7;
    	
	
	
    returnTorahSection = "";
    idTorah1 = ID_NULL;
    idTorah2 = ID_NULL;
    idTorah3 = ID_NULL;
/*
allgemein: A, B, F, G, I, J, M
Israel/Diaspora: C, D, E, H, K, L, N
*/

    switch (yearType) {
      case 1: /* A */
        idTorah1 = torahSectionsA[torahWeekNo * 3 + 0];
        idTorah2 = torahSectionsA[torahWeekNo * 3 + 1];
        idTorah3 = torahSectionsA[torahWeekNo * 3 + 2];
        break;
      case 2: /* B */
        idTorah1 = torahSectionsB[torahWeekNo * 3 + 0];
        idTorah2 = torahSectionsB[torahWeekNo * 3 + 1];
        idTorah3 = torahSectionsB[torahWeekNo * 3 + 2];
        break;
      case 3: /* C */
        if (isDiaspora()) {
          idTorah1 = torahSectionsCDiaspora[torahWeekNo * 3 + 0];
          idTorah2 = torahSectionsCDiaspora[torahWeekNo * 3 + 1];
          idTorah3 = torahSectionsCDiaspora[torahWeekNo * 3 + 2];
        } else {
          idTorah1 = torahSectionsCIsrael[torahWeekNo * 3 + 0];
          idTorah2 = torahSectionsCIsrael[torahWeekNo * 3 + 1];
          idTorah3 = torahSectionsCIsrael[torahWeekNo * 3 + 2];
        }
        break;
      case 4: /* D */
        if (isDiaspora()) {
          idTorah1 = torahSectionsDDiaspora[torahWeekNo * 3 + 0];
          idTorah2 = torahSectionsDDiaspora[torahWeekNo * 3 + 1];
          idTorah3 = torahSectionsDDiaspora[torahWeekNo * 3 + 2];
        } else {
          idTorah1 = torahSectionsDIsrael[torahWeekNo * 3 + 0];
          idTorah2 = torahSectionsDIsrael[torahWeekNo * 3 + 1];
          idTorah3 = torahSectionsDIsrael[torahWeekNo * 3 + 2];
        }
        break;
      case 5: /* E */
        if (isDiaspora()) {
          idTorah1 = torahSectionsEDiaspora[torahWeekNo * 3 + 0];
          idTorah2 = torahSectionsEDiaspora[torahWeekNo * 3 + 1];
          idTorah3 = torahSectionsEDiaspora[torahWeekNo * 3 + 2];
        } else {
          idTorah1 = torahSectionsEIsrael[torahWeekNo * 3 + 0];
          idTorah2 = torahSectionsEIsrael[torahWeekNo * 3 + 1];
          idTorah3 = torahSectionsEIsrael[torahWeekNo * 3 + 2];
        }
        break;
      case 6: /* F */
        idTorah1 = torahSectionsF[torahWeekNo * 3 + 0];
        idTorah2 = torahSectionsF[torahWeekNo * 3 + 1];
        idTorah3 = torahSectionsF[torahWeekNo * 3 + 2];
        break;
      case 7: /* G */
        idTorah1 = torahSectionsG[torahWeekNo * 3 + 0];
        idTorah2 = torahSectionsG[torahWeekNo * 3 + 1];
        idTorah3 = torahSectionsG[torahWeekNo * 3 + 2];
        break;
      case 8: /* H */
        if (isDiaspora()) {
          idTorah1 = torahSectionsHDiaspora[torahWeekNo * 3 + 0];
          idTorah2 = torahSectionsHDiaspora[torahWeekNo * 3 + 1];
          idTorah3 = torahSectionsHDiaspora[torahWeekNo * 3 + 2];
        } else {
          idTorah1 = torahSectionsHIsrael[torahWeekNo * 3 + 0];
          idTorah2 = torahSectionsHIsrael[torahWeekNo * 3 + 1];
          idTorah3 = torahSectionsHIsrael[torahWeekNo * 3 + 2];
        }
        break;
      case 9: /* I */
        idTorah1 = torahSectionsI[torahWeekNo * 3 + 0];
        idTorah2 = torahSectionsI[torahWeekNo * 3 + 1];
        idTorah3 = torahSectionsI[torahWeekNo * 3 + 2];
        break;
      case 10: /* J */
        idTorah1 = torahSectionsJ[torahWeekNo * 3 + 0];
        idTorah2 = torahSectionsJ[torahWeekNo * 3 + 1];
        idTorah3 = torahSectionsJ[torahWeekNo * 3 + 2];
        break;
      case 11: /* K */
        if (isDiaspora()) {
          idTorah1 = torahSectionsKDiaspora[torahWeekNo * 3 + 0];
          idTorah2 = torahSectionsKDiaspora[torahWeekNo * 3 + 1];
          idTorah3 = torahSectionsKDiaspora[torahWeekNo * 3 + 2];
        } else {
          idTorah1 = torahSectionsKIsrael[torahWeekNo * 3 + 0];
          idTorah2 = torahSectionsKIsrael[torahWeekNo * 3 + 1];
          idTorah3 = torahSectionsKIsrael[torahWeekNo * 3 + 2];
        }
        break;
      case 12: /* L */
        if (isDiaspora()) {
          idTorah1 = torahSectionsLDiaspora[torahWeekNo * 3 + 0];
          idTorah2 = torahSectionsLDiaspora[torahWeekNo * 3 + 1];
          idTorah3 = torahSectionsLDiaspora[torahWeekNo * 3 + 2];
        } else {
          idTorah1 = torahSectionsLIsrael[torahWeekNo * 3 + 0];
          idTorah2 = torahSectionsLIsrael[torahWeekNo * 3 + 1];
          idTorah3 = torahSectionsLIsrael[torahWeekNo * 3 + 2];
        }
        break;
      case 13: /* M */
        idTorah1 = torahSectionsM[torahWeekNo * 3 + 0];
        idTorah2 = torahSectionsM[torahWeekNo * 3 + 1];
        idTorah3 = torahSectionsM[torahWeekNo * 3 + 2];
        break;
      case 14: /* N */
        if (isDiaspora()) {
          idTorah1 = torahSectionsNDiaspora[torahWeekNo * 3 + 0];
          idTorah2 = torahSectionsNDiaspora[torahWeekNo * 3 + 1];
          idTorah3 = torahSectionsNDiaspora[torahWeekNo * 3 + 2];
        } else {
          idTorah1 = torahSectionsNIsrael[torahWeekNo * 3 + 0];
          idTorah2 = torahSectionsNIsrael[torahWeekNo * 3 + 1];
          idTorah3 = torahSectionsNIsrael[torahWeekNo * 3 + 2];
        }
        break;
    }

    if (idTorah1 != ID_NULL) {
      torahSection = getTorahSectionName(idTorah1);
      if (torahSection != "") {
        if (returnTorahSection != "")
          returnTorahSection = returnTorahSection + ", ";
        returnTorahSection = returnTorahSection + torahSection;
      }
    }
    if (idTorah2 != ID_NULL) {
      torahSection = getTorahSectionName(idTorah2);
      if (torahSection != "") {
        if (returnTorahSection != "")
          returnTorahSection = returnTorahSection + ", ";
        returnTorahSection = returnTorahSection + torahSection;
      }
    }
    if (idTorah3 != ID_NULL) {
      torahSection = getTorahSectionName(idTorah3);
      if (torahSection != "") {
        if (returnTorahSection != "")
          returnTorahSection = returnTorahSection + ", ";
        returnTorahSection = returnTorahSection + torahSection;
      }
    }
    if (torahDate == shuvahDate) {
      if (returnTorahSection != "")
        returnTorahSection = returnTorahSection + ", ";
      returnTorahSection = returnTorahSection + getTorahSectionName(ID_SHUVA);
    }

    return (returnTorahSection);
  } else {
    return "";
  }
}







function getTorahSectionNameEnglish(section) {
  if (section == ID_BERESHITH) return "Bereshith";
  if (section == ID_NOAH) return "Noah";
  if (section == ID_LEHLEHA) return "Le'h Leha";
  if (section == ID_VAYERA) return "Vayera";
  if (section == ID_HAYESARAH) return "Haye Sarah";
  if (section == ID_TOLEDOTH) return "Toledoth";
  if (section == ID_VAYETSE) return "Vayetse";
  if (section == ID_VAYISHLAH) return "Vayishlah";
  if (section == ID_VAYESHEB) return "Vayesheb";
  if (section == ID_MIKKETS) return "Mikkets";
  if (section == ID_VAYIGGASH) return "Vayiggash";
  if (section == ID_VAYHEE) return "Vayhee";
  if (section == ID_SHEMOTH) return "Shemoth";
  if (section == ID_VAERA) return "Vaera";
  if (section == ID_BO) return "Bo";
  if (section == ID_BESHALLAH) return "Beshallah, Shabbat Shirah";
  if (section == ID_YITHRO) return "Yithro";
  if (section == ID_MISHPATIM) return "Mishpatim";
  if (section == ID_TERUMAH) return "Terumah";
  if (section == ID_TETSAVVEH) return "Tetsavveh";
  if (section == ID_KITISSA) return "Ki Tissa";
  if (section == ID_VAYAKHEL) return "Vayakhel";
  if (section == ID_PEKUDE) return "Pekude";
  if (section == ID_VAYIKRA) return "Vayikra";
  if (section == ID_TSAV) return "Tsav";
  if (section == ID_SHEMINI) return "Shemini";
  if (section == ID_TAZRIANG) return "Tazria";
  if (section == ID_METSORANG) return "Metsora";
  if (section == ID_AHAREMOTH) return "Aharemoth";
  if (section == ID_KEDOSHIM) return "Kedoshim";
  if (section == ID_EMOR) return "Emor";
  if (section == ID_BEHAR) return "Behar";
  if (section == ID_BEHUKKOTHAI) return "Behukkothai";
  if (section == ID_BEMIDBAR) return "Bemidbar";
  if (section == ID_NASO) return "Naso";
  if (section == ID_BEHAALOTEHA) return "Behaaloteha";
  if (section == ID_SHELAHLEHA) return "Shelah Leha";
  if (section == ID_KORAH) return "Korah";
  if (section == ID_HUKATH) return "Hukath";
  if (section == ID_BALAK) return "Balak";
  if (section == ID_PINHAS) return "Pinhas";
  if (section == ID_MATOTH) return "Matoth";
  if (section == ID_MASEH) return "Maseh";
  if (section == ID_DEBARIM) return "Debarim, Shabbat Hazon";
  if (section == ID_VAETHANAN) return "Vaethanan, Shabbat Nahamu";
  if (section == ID_EKEB) return "Ekeb";
  if (section == ID_REEH) return "Reeh";
  if (section == ID_SHOFETIM) return "Shofetim";
  if (section == ID_KITETSE) return "Ki Tetse";
  if (section == ID_KITABO) return "Ki Tabo";
  if (section == ID_NITSABIM) return "Nitsabim";
  if (section == ID_VAYELEH) return "Vayeleh";
  if (section == ID_HAAZINU) return "Haazinu";

  if (section == ID_SHEKALIM) return "Shabbat Shekalim";
  if (section == ID_ZAHOR) return "Shabbat Za'hor";
  if (section == ID_PARAH) return "Shabbat Parah";
  if (section == ID_HAHODESH) return "Shabbat Hahodesh";
  if (section == ID_SHUVA) return "Shabbat Shuva";

  return "";
}



function getTorahSectionName(section) {
  if (section == ID_BERESHITH) return "בראשית";
  if (section == ID_NOAH) return "נח";
  if (section == ID_LEHLEHA) return "לך לך";
  if (section == ID_VAYERA) return "וירא";
  if (section == ID_HAYESARAH) return "חיי שרה";
  if (section == ID_TOLEDOTH) return "תולדות";
  if (section == ID_VAYETSE) return "ויצא";
  if (section == ID_VAYISHLAH) return "וישלח";
  if (section == ID_VAYESHEB) return "וישב";
  if (section == ID_MIKKETS) return "מקץ";
  if (section == ID_VAYIGGASH) return "ויגש";
  if (section == ID_VAYHEE) return "ויחי";
  if (section == ID_SHEMOTH) return "שמות";
  if (section == ID_VAERA) return "וארא";
  if (section == ID_BO) return "בא";
  if (section == ID_BESHALLAH) return "בשלח ,שבת שירה";
  if (section == ID_YITHRO) return "יתרו";
  if (section == ID_MISHPATIM) return "משפטים";
  if (section == ID_TERUMAH) return "תרומה";
  if (section == ID_TETSAVVEH) return "תצוה";
  if (section == ID_KITISSA) return "כי תשא";
  if (section == ID_VAYAKHEL) return "ויקהל";
  if (section == ID_PEKUDE) return "פקודי";
  if (section == ID_VAYIKRA) return "ויקרא";
  if (section == ID_TSAV) return "צו";
  if (section == ID_SHEMINI) return "שמיני";
  if (section == ID_TAZRIANG) return "תזריע";
  if (section == ID_METSORANG) return "מצרע";
  if (section == ID_AHAREMOTH) return "אחרי מות";
  if (section == ID_KEDOSHIM) return "קדשים";
  if (section == ID_EMOR) return "אמר";
  if (section == ID_BEHAR) return "בהר";
  if (section == ID_BEHUKKOTHAI) return "בחקתי";
  if (section == ID_BEMIDBAR) return "במדבר";
  if (section == ID_NASO) return "נשא";
  if (section == ID_BEHAALOTEHA) return "בהעלתך";
  if (section == ID_SHELAHLEHA) return "שלח לך";
  if (section == ID_KORAH) return "קרח";
  if (section == ID_HUKATH) return "חקת";
  if (section == ID_BALAK) return "בלק";
  if (section == ID_PINHAS) return "פינחס";
  if (section == ID_MATOTH) return "מטות";
  if (section == ID_MASEH) return "מסעי";
  if (section == ID_DEBARIM) return "דברים ,שבת חזון";
  if (section == ID_VAETHANAN) return "ואתחנן ,שבת נחמו";
  if (section == ID_EKEB) return "עקב";
  if (section == ID_REEH) return "ראה";
  if (section == ID_SHOFETIM) return "שפטים";
  if (section == ID_KITETSE) return "כי תצא";
  if (section == ID_KITABO) return "כי תבוא";
  if (section == ID_NITSABIM) return "נצבים";
  if (section == ID_VAYELEH) return "וילך";
  if (section == ID_HAAZINU) return "האזינו";

  if (section == ID_SHEKALIM) return "שבת שקלים";
  if (section == ID_ZAHOR) return "שבת זכור";
  if (section == ID_PARAH) return "שבת פרה";
  if (section == ID_HAHODESH) return "שבת החודש";
  if (section == ID_SHUVA) return "שבת שובה";

  return "";
}


