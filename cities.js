const CITIES_DATA = `
name|lat|long|tz|elevation|candlelighting|diaspora
ירושלים|31.766666|-35.233333|2|0|40|0
אבי הנחל|31.605181|-35.218303|2|0|18|0
אילת|29.55|-34.9333333|2|0|18|0
אלון שבות|31.651756|-35.126424|2|0|18|0
אלון שבות 1|31.651756|-35.126424|2|800|18|0
באר שבע|31.25|-34.783333|2|0|18|0
בית וגן|31.766666|-35.183333|2|830|40|0
בית שמש|31.75|-34.98|2|0|18|0
ביתר B|31.700991|-35.114605|2|700|40|0
חיפה|32.816666|-34.983333|2|0|18|0
חברון|31.6|-35.883333|2|0|18|0
טבריה|32.8|-35.5|2|0|18|0
ירושלים, עיר העתיקה|31.778533|-35.234265|2|750|40|0
יריחו|31.866666|-35.45|2|0|18|0
מיצד|31.582552|-35.189306|2|970|40|0
נחליאל|31.975147|-35.137508|2|550|20|0
נתניה|32.3333|-34.85|2|0|18|0
עין בוקק|31.200726|-35.3629369|2|-450|18|0
פתח תקוה|32.083333|-34.766666|2|0|40|0
צפת|33|-35.5|2|0|18|0
קרני שומרון|32.166666|-35.1|2|0|18|0
רבבה|32.118718|-35.128738|2|770|18|0
רבוצקי 8|32.178885|-34.884406|2|0|18|0
שילה|32.05|-35.2833|2|0|18|0
שכם|32.2|-35.3|2|0|18|0
תל אביב|32.083333|-34.766666|2|0|18|0
תל ציון|31.878839|-35.239093|2|770|18|0
Amsterdam|52.38|-4.89|1|0|18|1
Anchorage, AK|61.22|149|-9|0|18|1
Ankara|40.13|-33|2|0|18|1
Antwerpen, Belgium|51.216666|-4.4166666|1|0|18|1
Athens|37.97|-23.72|1|0|18|1
Atlanta, GA|33.75|84.39|-5|0|18|1
Auckland|-36.85448|-174.760727|12|37|18|2
Baltimore, MD|39.29|76.61|-5|0|18|1
Bangkok|13.2|-100.5|7|0|18|1
Beijing|39.91|-116.47|8|0|18|1
Belgrade|44.83|-20.46|2|0|18|1
Berlin, Germany|52.516666|-13.4|2|0|18|1
Birmingham, AL|33.52|86.81|-6|0|18|1
Birmingham, England|52.4796|1.9030|0|0|18|1
Bismarck, ND|46.81|100.78|-6|0|18|1
Borough Park|40.630729|73.98381|-5|0|18|1
Boston, MA|42.35|71.05|-5|0|18|1
Bridgeport, CT|41.17|73.2|-5|0|18|1
Brussels, Belgium|51.85|-4.35|1|0|18|1
Bucharest|44.5|-26.1|2|0|18|1
Budapest|47.49|-19.06|1|0|18|1
Buenos Aires|-34.6|58.45|-3|0|18|1
Cairo, Egypt|30|-31.283333|2|0|18|1
Cape Town|-33.94|-18.49|2|0|18|1
Caracas|10.5|66.93|-4|0|18|1
Chicago, IL|41.866666|86.366666|-6|0|18|1
Christchurch|-43.521578|-172.633737|12|4|18|2
Cleveland, OH|41.5|81.7|-5|0|18|1
Concord, NH|43.21|71.54|-5|0|18|1
Copenhagen, Denmark|55.716666|-12.45|1|0|18|1
Dallas, TX|32.78|96.8|-6|0|18|1
Deerfield Beach|26.3110878|80.1328235|-5|0|18|1
Denver, CO|39.733333|-104.983333|-7|0|18|1
Des Moines, IA|41.6|93.61|-6|0|18|1
Detroit, MI|42.33|83.05|-5|0|18|1
Dublin|53.39|6.34|0|0|18|1
Eagle Lake|32.524504|-91.013699|0|0|18|0
Edinburgh|55.95|3.1|0|0|18|1
Eugene, OR|44.05|123.09|-8|0|18|1
Far Rockaway|40.605163|73.744076|-5|0|18|1
Flatbush|40.613713|73.965219|-5|0|18|1
Fort Knox, KY|37.91|85.97|-5|0|18|1
Fort Lauderdale, FL|26.12|80.14|-5|0|18|1
Geneva|46.2|-6.15|1|0|18|1
Green Bay, WI|44.52|88.02|-6|0|18|1
Helena, MT|46.59|112.04|-7|0|18|1
Helsinki|60.16|-24.96|2|0|18|1
Hong Kong, China|22.166666|-114.3|8|0|18|1
Honolulu, HI|21.3061|157.86|-10|0|18|1
Indianapolis, IN|39.77|86.16|-5|0|18|
Jackson, WY|43.61|110.73|-6|0|18|1
Jakarta|-6.17|-106.8|7|0|18|1
Kassel|51.32|-9.5|1|0|18|1
Kiev|50.45|-30.3|2|0|18|1
Kobe, Japan|34.67|-135.1755|9|0|18|1
Kyoto, Japan|35|-135.8|9|0|18|1
Lima|-12.05|77.05|-5|0|18|1
Lisbon|38.71|9.19|-1|0|18|1
London, England|51.5|-0.116667|0|0|18|1
Los Angeles, CA|34.05|118.2333333|-8|0|18|1
Luxembourg|49.6|-6.2|1|0|18|1
Madrid|40.41|3.69|1|0|18|1
Mainz|50|-8.27|1|0|18|1
Manchester|53.3936908|2.2292513|0|0|18|1
Melbourne, Australia|-37.866666|-145.133333|10|0|18|1
Memphis, TN|35.15|90.05|-6|0|18|1
Minneapolis, MN|44.98|93.26|-6|0|18|1
Montreal, Quebec|45.51666667|73.55|-5|0|18|1
Moscow, Russia|55.75|-37.616667|3|0|18|1
Ner Israel, Baltimore|39.386036|76.754658|-5|144|18|1
New Orleans, LA|29.95|90.07|-6|0|18|1
New York, NY|40.908647|74.0094|-5|0|18|1
Nicosia|35.17|-33.37|2|0|18|1
Palma de Mallorca|39.57|-2.65|1|0|18|1
Paris|48.84|-2.34|1|0|18|1
Passaic, NJ|40.850514|74.123648|-5|0|18|1
Philadelphia, PA|39.95|75.16|-5|0|18|1
Phoenix, AZ|33.3|112.03|-7|0|18|1
Pittsburgh, PA|40.433333|80|-5|0|18|1
Port Elizabeth|-33.953657|-25.591284|2|0|18|1
Prague|50.09|-14.42|1|0|18|1
Raleigh, NC|35.78|78.64|-5|0|18|1
Reno, NV|39.52|119.81|-8|0|18|1
Reykjavik|64.15|21.92|0|0|18|1
Riga|56.95|-24.1|2|0|18|1
Rio de Janeiro|-22.88|43.28|-3|0|18|1
Rome, Italy|41.9|-12.48|1|0|18|1
Rostock|54.08|-12.13|1|0|18|1
Saint Louis, MS|38.63|90.18|-6|0|18|1
Salt Lake City, UT|40.77|111.88|-7|0|18|1
San Francisco, CA|37.783333|122.416666|-8|0|18|1
Santa Fe, NM|35.69|105.94|-7|0|18|1
Santiago|-33.45|70.67|-6|0|18|1
Silver Spring, MD|39|77|-5|0|18|1
Singapore|1.27|-116.47|8|0|18|1
Skopje|42|-21.43|1|0|18|1
Soest|51.58|-8.12|1|0|18|1
Sofia|42.7|-23.45|2|0|18|1
Staten Island, NY|40.599235|74.135838|-5|60|18|1
Stockholm|59.34|-18.06|1|0|18|1
Sydney, Australia|-33.87|-151.22|10|0|18|1
Tallinn|59.43|-24.73|2|0|18|1
Teaneck, NJ|40.908467|74.00944|-5|0|18|1
Tirana|41.2|-19.9|1|0|18|1
Tokyo, Japan|35.7|-139.77|9|0|18|1
Topeka, KS|39.05|95.67|-6|0|18|1
Toronto|43.7188182733902|79.4238097445503|-5|0|18|1
Uman|48.75|-30.22222|2|166|18|1
Upper West Side|40.793298|73.967275|-5|0|18|1
Vancouver, BC|45.8|123.08|-8|0|18|1
Vienna|48.21|-16.38|1|0|18|1
Vilnius|54.68|-25.32|2|0|18|1
Warsaw, Poland|52.25|-21.083333|1|0|18|1
Washington, DC|38.9|77|-5|0|18|1
Waterbury, CT|41.568505|73.044866|-5|0|18|1
West Orange, NJ|40.816244|74.256238|-5|0|18|1
Winnipeg|49.88|97.17|-6|0|18|1
Zagreb|45.8|-15.98|1|0|18|1
Zurich|47.383333|-8.55|1|0|18|1
Kaplan House|40.599235|74.135838|-5|0|18|1
Yaron's House|34.171106|118.630283|-8|0|18|1
`.trim();

function loadCities() {
    // Cache DOM elements
    const locationSelect = document.querySelector('select[name="location"]');
    
    // Clear existing options
    locationSelect.innerHTML = '';

    // Add cities
    const cities = CITIES_DATA
        .split('\n')
        .slice(1) // Skip header row
        .filter(line => line.trim())
        .map(line => {
            const [name, lat, long, tz, elevation, candlelighting, diaspora] = line.split('|');
            return {
                name,
                lat: parseFloat(lat),
                long: parseFloat(long),
                tz: parseInt(tz),
                elevation: parseInt(elevation),
                candlelighting: parseInt(candlelighting),
                diaspora: parseInt(diaspora)
            };    
        });    
    cities.forEach(city => {
        const value = `${city.lat}/${city.long}/${city.tz}/${city.elevation}/${city.candlelighting}/${city.diaspora}*${city.name}`;
        const option = new Option(city.name, value);
        locationSelect.add(option);
    });
    
    // Add user input option
    const userOption = new Option('הקלטת משמש', '0.00/0.00/0/0/18/1*');
    locationSelect.add(userOption);
}

function setUserInput() {
    const locationSelect = document.querySelector('select[name="location"]');
    locationSelect.selectedIndex = locationSelect.options.length - 1;
}

function getLocation() {
    const locationSelect = document.querySelector('select[name="location"]');
    const LocationStr = locationSelect.value;
    const match = LocationStr.match(/^\s*([^/]+)\/([^/]+)\/([^/]+)\/([^/]+)\/([^/]+)\/([^*]+)\*(.*)\s*$/);
    const lat = match ? Number(match[1]) : 0;
    const long = match ? Number(match[2]) : 0;
    const locOffset = match ? match[3] : "0";
    const hite = match ? match[4] : "0";
    const nerot = match ? match[5] : "18";
    diaspora = match ? Number(match[6]) : 1;

    const form = document.forms['myform1'];
	form.latitude.value = Math.abs(lat);
	form.NorthSouth.selectedIndex = (lat >= 0 ? 0 : 1);
	form.longitude.value = Math.abs(long);
	form.EastWest.selectedIndex = (long <= 0 ? 0 : 1);
	
	const tzOptions = Array.from(form.timezone.options);
    tzOptions.find(option => option.value == locOffset).selected = true;
    
    form.hite.value = hite;
	form.nerot.value = nerot;
	form.diaspora.checked = Boolean(diaspora);
}

function getLocationName() {
    const locationSelect = document.querySelector('select[name="location"]');
    const LocationStr = locationSelect.value;
	const match = LocationStr.match(/\*([\s\S]*)$/);
	return match ? match[1] : '';
}
