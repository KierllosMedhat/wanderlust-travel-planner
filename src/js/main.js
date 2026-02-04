// Data
let countriesData;
let holidaysData;
let eventsData;
let weatherData;
let longWeekendData;
let sunTimesData;
let currGlobalCountry;

let myPlans = localStorage.getItem("myPlans")
	? JSON.parse(localStorage.getItem("myPlans"))
	: [];

setup();

// Classes
class Country {
	constructor(code, name) {
		this.code = code;
		this.name = name;
	}
}

class savedData {
	constructor(type, name, date, location) {
		this.type = type;
		this.content = {
			name: name,
			date: date,
			location: location
		};
	}
}

// Sections
const dashboardView = document.querySelector("#dashboard-view");
const holidaysView = document.querySelector("#holidays-view");
const holidaysContent = document.querySelector("#holidays-content");
const eventsView = document.querySelector("#events-view");
const eventsContent = document.querySelector("#events-content");
const weatherView = document.querySelector("#weather-view");
const longWeekendsView = document.querySelector("#long-weekends-view");
const currencyView = document.querySelector("#currency-view");
const sunTimesView = document.querySelector("#sun-times-view");
const myPlansView = document.querySelector("#my-plans-view");

// Navlinks
const dashboardNav = document.querySelector("#dashboard-nav");
const holidaysNav = document.querySelector("#holidays-nav");
const eventsNav = document.querySelector("#events-nav");
const weatherNav = document.querySelector("#weather-nav");
const longWeekendsNav = document.querySelector("#long-weekends-nav");
const currencyNav = document.querySelector("#currency-nav");
const sunTimesNav = document.querySelector("#sun-times-nav");
const myPlansNav = document.querySelector("#my-plans-nav");

// Dashboard Items
const globalCountry = document.querySelector("#global-country");
const globalCity = document.querySelector("#global-city");
const selectedDestination = document.querySelector("#selected-destination");
const globalSearchBtn = document.querySelector("#global-search-btn");
const countryInfoSection = document.querySelector(
	"#dashboard-country-info-section"
);
const globalYear = document.querySelector("#global-year");
const menuBtn = document.querySelector("#mobile-menu-btn");
const sidebar = document.querySelector("#sidebar");
const sidebarOverlay = document.querySelector("#sidebar-overlay");

// Currency Items
const currencyAmount = document.querySelector("#currency-amount");
const currencyFrom = document.querySelector("#currency-from");
const currencyTo = document.querySelector("#currency-to");
const convertBtn = document.querySelector("#convert-btn");
const currencyResult = document.querySelector("#currency-result");
const swapCurrenciesBtn = document.querySelector("#swap-currencies-btn");

const clearAllPlansBtn = document.querySelector("#clear-all-plans-btn");

// Event Listeners
globalSearchBtn.addEventListener("click", async () => {
	await displayDestinationData();
	await getCapital();
	await getHolidays();
	await getEvents();
	await getWeather();
	await getLongWeekend();
	await getSunTimes();
});

menuBtn.addEventListener("click", () => {
	sidebar.classList.add("open");
	sidebarOverlay.classList.replace("hidden", "active");
});

sidebarOverlay.addEventListener("click", () => {
	sidebar.classList.remove("open");
	sidebarOverlay.classList.replace("active", "hidden");
});

dashboardNav.addEventListener("click", () => {
	hideAllSections();
	disableAllNavs();
	dashboardNav.classList.add("active");
	dashboardView.classList.add("active");
	sidebar.classList.remove("open");
	sidebarOverlay.classList.replace("active", "hidden");
});

holidaysNav.addEventListener("click", () => {
	hideAllSections();
	disableAllNavs();
	holidaysNav.classList.add("active");
	holidaysView.classList.add("active");
	sidebar.classList.remove("open");
	sidebarOverlay.classList.replace("active", "hidden");
	displayHolidays();
});

eventsNav.addEventListener("click", () => {
	hideAllSections();
	disableAllNavs();
	eventsNav.classList.add("active");
	eventsView.classList.add("active");
	sidebar.classList.remove("open");
	sidebarOverlay.classList.replace("active", "hidden");
	displayEvents();
});

weatherNav.addEventListener("click", () => {
	hideAllSections();
	disableAllNavs();
	weatherNav.classList.add("active");
	weatherView.classList.add("active");
	sidebar.classList.remove("open");
	sidebarOverlay.classList.replace("active", "hidden");
	displayWeather();
});

longWeekendsNav.addEventListener("click", () => {
	hideAllSections();
	disableAllNavs();
	longWeekendsNav.classList.add("active");
	longWeekendsView.classList.add("active");
	sidebar.classList.remove("open");
	sidebarOverlay.classList.replace("active", "hidden");
	displayLongWeekend();
});

currencyNav.addEventListener("click", () => {
	hideAllSections();
	disableAllNavs();
	currencyNav.classList.add("active");
	currencyView.classList.add("active");
	sidebar.classList.remove("open");
	sidebarOverlay.classList.replace("active", "hidden");
});

sunTimesNav.addEventListener("click", () => {
	hideAllSections();
	disableAllNavs();
	sunTimesNav.classList.add("active");
	sunTimesView.classList.add("active");
	sidebar.classList.remove("open");
	sidebarOverlay.classList.replace("active", "hidden");
	displaySunTimes();
});

myPlansNav.addEventListener("click", () => {
	hideAllSections();
	disableAllNavs();
	myPlansNav.classList.add("active");
	myPlansView.classList.add("active");
	sidebar.classList.remove("open");
	sidebarOverlay.classList.replace("active", "hidden");
	displayMyPlans();
});

convertBtn.addEventListener("click", async () => {
	await convertCurrency();
});

swapCurrenciesBtn.addEventListener("click", () => {
	const temp = currencyFrom.value;
	currencyFrom.value = currencyTo.value;
	currencyTo.value = temp;
});

clearAllPlansBtn.addEventListener("click", () => {
	myPlans = [];

	localStorage.setItem("myPlans", JSON.stringify(myPlans));
	displayMyPlans();
});

// Functions
async function setup() {
	await getCountries();
	let globalCountryHtml = globalCountry.innerHTML;
	countriesData.forEach(async (country) => {
		country = await getCountryByCode(country.countryCode);
		country = country[0];
		globalCountryHtml += `
        <option value="${country.cca2}">${country.flag} ${country.name.common}</option>
        `;
		globalCountry.innerHTML = globalCountryHtml;
	});

	await displayDestinationData();
	await getCapital();
	await getHolidays();
	await getEvents();
	await getWeather();
	await getLongWeekend();
	await getSunTimes();
}

window.saveData = function (type, name, date, location) {
	myPlans.push(new savedData(type, name, date, location));
	localStorage.setItem("myPlans", JSON.stringify(myPlans));
};

async function getCountries() {
	const countries = await fetch(
		"https://date.nager.at/api/v3/AvailableCountries"
	)
		.then((response) => response)
		.catch((error) => console.log("Error", error));
	countriesData = await countries.json();
}

async function getCountryByCode(code) {
	const countryData = await fetch(
		`https://restcountries.com/v3.1/alpha/${code}`
	)
		.then((response) => response)
		.catch((error) => console.log("error", error));
	const jsonData = await countryData.json();
	return jsonData;
}

async function getCapital() {
	let currCountry = await getCountryByCode(globalCountry.value);
	currCountry = currCountry[0];
	let capital = currCountry.capital[0];
	globalCity.innerHTML = `
        <option value="${capital}" selected>${capital}</option>
    `;
	displayDestinationData();
}

async function displayDestinationData() {
	currGlobalCountry = await getCountryByCode(globalCountry.value);
	currGlobalCountry = currGlobalCountry[0];

	selectedDestination.innerHTML = `
        <div id="selected-destination" class="selected-destination">
            <div class="selected-flag">
                <img id="selected-country-flag" src="${currGlobalCountry.flags.svg}" alt="${currGlobalCountry.flags.alt}">
            </div>
            <div class="selected-info">
                <span class="selected-country-name" id="selected-country-name">${currGlobalCountry.name.common}</span>
            </div>
            <button class="clear-selection-btn" id="clear-selection-btn">
                <i class="fa-solid fa-xmark"></i>
            </button>
        </div>
    `;

	countryInfoSection.innerHTML = `
    <div class="section-header">
              <h2><i class="fa-solid fa-flag"></i> Country Information</h2>
            </div>
            <div id="dashboard-country-info" class="dashboard-country-info">
              
              <div class="dashboard-country-header">
                <img src="${currGlobalCountry.flags.png}" alt="${currGlobalCountry.cca2}" class="dashboard-country-flag">
                <div class="dashboard-country-title">
                  <h3>${currGlobalCountry.name.common}</h3>
                  <p class="official-name">${currGlobalCountry.name.official}</p>
                  <span class="region"><i class="fa-solid fa-location-dot"></i> ${currGlobalCountry.region} • ${currGlobalCountry.subregion}</span>
                </div>
              </div>
              
              <div class="dashboard-local-time">
                <div class="local-time-display">
                  <i class="fa-solid fa-clock"></i>
                  <span class="local-time-value" id="country-local-time">08:30:45 AM</span>
                  <span class="local-time-zone">${currGlobalCountry.timezones[0]}</span>
                </div>
              </div>
              
              <div class="dashboard-country-grid">
                <div class="dashboard-country-detail">
                  <i class="fa-solid fa-building-columns"></i>
                  <span class="label">Capital</span>
                  <span class="value">${currGlobalCountry.capital[0]}</span>
                </div>
                <div class="dashboard-country-detail">
                  <i class="fa-solid fa-users"></i>
                  <span class="label">Population</span>
                  <span class="value">${currGlobalCountry.population}</span>
                </div>
                <div class="dashboard-country-detail">
                  <i class="fa-solid fa-ruler-combined"></i>
                  <span class="label">Area</span>
                  <span class="value">${currGlobalCountry.area} km²</span>
                </div>
                <div class="dashboard-country-detail">
                  <i class="fa-solid fa-globe"></i>
                  <span class="label">Continent</span>
                  <span class="value">${currGlobalCountry.continents[0]}</span>
                </div>
                <div class="dashboard-country-detail">
                  <i class="fa-solid fa-phone"></i>
                  <span class="label">Calling Code</span>
                  <span class="value">${currGlobalCountry.idd.root}</span>
                </div>
                <div class="dashboard-country-detail">
                  <i class="fa-solid fa-car"></i>
                  <span class="label">Driving Side</span>
                  <span class="value">Right</span>
                </div>
                <div class="dashboard-country-detail">
                  <i class="fa-solid fa-calendar-week"></i>
                  <span class="label">Week Starts</span>
                  <span class="value">${currGlobalCountry.startOfWeek}</span>
                </div>
              </div>
              
              <div class="dashboard-country-extras">
                <div class="dashboard-country-extra">
                  <h4><i class="fa-solid fa-coins"></i> Currency</h4>
                  <div class="extra-tags">
                    <span class="extra-tag">${Object.values(currGlobalCountry.currencies)[0].name} (${Object.keys(currGlobalCountry.currencies)[0]} ${Object.values(currGlobalCountry.currencies)[0].symbol})</span>
                  </div>
                </div>
                <div class="dashboard-country-extra">
                  <h4><i class="fa-solid fa-language"></i> Languages</h4>
                  <div class="extra-tags">
                    <span class="extra-tag">${Object.values(currGlobalCountry.languages)[0]}</span>
                  </div>
                </div>
                <div class="dashboard-country-extra">
                  <h4><i class="fa-solid fa-map-location-dot"></i> Neighbors</h4>
                  <div class="extra-tags">
                    <span class="extra-tag border-tag">${currGlobalCountry.borders[0]}</span>
                    <span class="extra-tag border-tag">${currGlobalCountry.borders[1]}</span>
                    <span class="extra-tag border-tag">${currGlobalCountry.borders[2]}</span>
                    <span class="extra-tag border-tag">${currGlobalCountry.borders[3]}</span>
                  </div>
                </div>
              </div>
              
              <div class="dashboard-country-actions">
                <a href="${currGlobalCountry.maps.googleMaps}" target="_blank" class="btn-map-link">
                  <i class="fa-solid fa-map"></i> View on Google Maps
                </a>
              </div>
              
            </div>
    `;
}

function hideAllSections() {
	dashboardView.classList.remove("active");
	holidaysView.classList.remove("active");
	eventsView.classList.remove("active");
	weatherView.classList.remove("active");
	longWeekendsView.classList.remove("active");
	currencyView.classList.remove("active");
	sunTimesView.classList.remove("active");
	myPlansView.classList.remove("active");
}

function disableAllNavs() {
	dashboardNav.classList.remove("active");
	holidaysNav.classList.remove("active");
	eventsNav.classList.remove("active");
	weatherNav.classList.remove("active");
	longWeekendsNav.classList.remove("active");
	currencyNav.classList.remove("active");
	sunTimesNav.classList.remove("active");
	myPlansNav.classList.remove("active");
}

async function getHolidays() {
	const holidays = await fetch(
		`https://date.nager.at/api/v3/PublicHolidays/${globalYear.value}/${globalCountry.value}`
	)
		.then((response) => response)
		.catch((error) => console.log("Error", error));

	holidaysData = await holidays.json();
}

function displayHolidays() {
	let holidaysContentHTML = "";

	holidaysData.forEach((holiday) => {
		holidaysContentHTML += `
        <div class="holiday-card">
              <div class="holiday-card-header">
                <div class="holiday-date-box"><span class="day">${holiday.date}</span></div>
                <button class="holiday-action-btn" onclick="saveData('holiday', '${holiday.name}', '${holiday.date}', '${currGlobalCountry.name.common}')"><i class="fa-regular fa-heart"></i></button>
              </div>
              <h3>${holiday.name}</h3>
              <p class="holiday-name">${holiday.localName}</p>
              <div class="holiday-card-footer">
                <span class="holiday-day-badge"><i class="fa-regular fa-calendar"></i></span>
                <span class="holiday-type-badge">Public</span>
              </div>
            </div>`;
	});

	holidaysView.innerHTML =
		`
    <div class="view-header-card gradient-green">
            <div class="view-header-icon"><i class="fa-solid fa-calendar-days"></i></div>
            <div class="view-header-content">
              <h2>Public Holidays Explorer</h2>
              <p>Browse public holidays for ${currGlobalCountry.name.common} and plan your trips around them</p>
            </div>
            <div class="view-header-selection" id="holidays-selection">
              <div class="current-selection-badge">
                <img src="${currGlobalCountry.flag.png}" alt="${currGlobalCountry.name.common}" class="selection-flag">
                <span>${currGlobalCountry.name.common}</span>
                <span class="selection-year">${globalYear.value}</span>
              </div>
            </div>
          </div>
    ` + holidaysContentHTML;
}

async function getEvents() {
	const events = await fetch(
		`https://app.ticketmaster.com/discovery/v2/events.json?apikey=jhoORuRnLBR8pKA8GnzOYY77gIJTdH2r&city=${globalCity.value}&countryCode=${globalCountry.value}&size=20`
	)
		.then((response) => response)
		.catch((error) => console.log("Error", error));

	eventsData = await events.json();
}

function displayEvents() {
	let eventsContentHTML = "";

	if (eventsData != null) {
		eventsData._embedded.events.forEach((event) => {
			eventsContentHTML += `
              <div class="event-card">
                <div class="event-card-image">
                  <img src="${event.url}" alt="${event.name}">
                  <span class="event-card-category">Music</span>
                  <button class="event-card-save" onclick="saveData('event', '${event.name}', '${event.dates.start.localDate}', '${currGlobalCountry.name.common}')"><i class="fa-regular fa-heart"></i></button>
                </div>
                <div class="event-card-body">
                  <h3>${event.name}</h3>
                  <div class="event-card-info">
                    <div><i class="fa-regular fa-calendar"></i>${event.dates.start.localDate} at ${event.dates.start.localTime}</div>
                    <div><i class="fa-solid fa-location-dot"></i>${event._embedded.venues[0].name}, ${event._embedded.venues[0].city.name}</div>
                  </div>
                  <div class="event-card-footer">
                    <button class="btn-event"><i class="fa-regular fa-heart"></i> Save</button>
                    <a href="#" class="btn-buy-ticket"><i class="fa-solid fa-ticket"></i> Buy Tickets</a>
                  </div>
                </div>
              </div>
          `;
		});
	}
	eventsContent.innerHTML = eventsContentHTML;

	eventsView.innerHTML =
		`
    <div class="view-header-card gradient-purple">
        <div class="view-header-icon"><i class="fa-solid fa-ticket"></i></div>
        <div class="view-header-content">
            <h2>Events Explorer</h2>
            <p>Discover concerts, sports, theatre and more in ${currGlobalCountry.name.common}</p>
        </div>
        <div class="view-header-selection">
            <div class="current-selection-badge">
            <img src="${currGlobalCountry.flag.png}" alt="${currGlobalCountry.name.common}" class="selection-flag">
            <span>${currGlobalCountry.name.common}</span>
            <span class="selection-city">• ${globalCity.value}</span>
            </div>
        </div>
    </div>
    ` + eventsContentHTML;
}

async function getWeather() {
	const weather = await fetch(
		"https://api.open-meteo.com/v1/forecast?latitude=40.7128&longitude=-74.006&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,uv_index&hourly=temperature_2m,weather_code,precipitation_probability&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,wind_direction_10m_dominant&timezone=auto"
	)
		.then((response) => response)
		.catch((error) => console.log("Error", error));
	weatherData = await weather.json();
}

function displayWeather() {
	weatherView.innerHTML = `
        div class="view-header-card gradient-blue">
            <div class="view-header-icon"><i class="fa-solid fa-cloud-sun"></i></div>
            <div class="view-header-content">
              <h2>Weather Forecast</h2>
              <p>Check 7-day weather forecasts for ${globalCity.value}</p>
            </div>
            <div class="view-header-selection">
              <div class="current-selection-badge">
                <img src="${currGlobalCountry.flag.png}" alt="${currGlobalCountry.name.common}" class="selection-flag">
                <span>${currGlobalCountry.name.common}</span>
                <span class="selection-city">• ${globalCity.value}</span>
              </div>
            </div>
          </div>
          
          <div id="weather-content" class="weather-layout">
            <!-- Current Weather Hero -->
            <div class="weather-hero-card weather-sunny">
              <div class="weather-location">
                <i class="fa-solid fa-location-dot"></i>
                <span>${globalCity.value}</span>
                <span class="weather-time">${weatherData.daily.time[0]}</span>
              </div>
              <div class="weather-hero-main">
                <div class="weather-hero-left">
                  <div class="weather-hero-icon"><i class="fa-solid fa-sun"></i></div>
                  <div class="weather-hero-temp">
                    <span class="temp-value">${weatherData.daily.temperature_2m_max[0]}</span>
                    <span class="temp-unit">°C</span>
                  </div>
                </div>
                <div class="weather-hero-right">
                  <div class="weather-condition">${weatherData.daily.weather_code[0]}</div>
                  <div class="weather-feels">Feels like ${weatherData.current.apparent_temperature}°C</div>
                  <div class="weather-high-low">
                    <span class="high"><i class="fa-solid fa-arrow-up"></i> ${weatherData.daily.temperature_2m_max[0]}°</span>
                    <span class="low"><i class="fa-solid fa-arrow-down"></i> ${weatherData.daily.temperature_2m_min[0]}°</span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Weather Details Grid -->
            <div class="weather-details-grid">
              <div class="weather-detail-card">
                <div class="detail-icon humidity"><i class="fa-solid fa-droplet"></i></div>
                <div class="detail-info">
                  <span class="detail-label">Humidity</span>
                  <span class="detail-value">${weatherData.current.relative_humidity_2m_max}%</span>
                </div>
              </div>
              <div class="weather-detail-card">
                <div class="detail-icon wind"><i class="fa-solid fa-wind"></i></div>
                <div class="detail-info">
                  <span class="detail-label">Wind</span>
                  <span class="detail-value">15 km/h</span>
                </div>
              </div>
              <div class="weather-detail-card">
                <div class="detail-icon uv"><i class="fa-solid fa-sun"></i></div>
                <div class="detail-info">
                  <span class="detail-label">UV Index</span>
                  <span class="detail-value">6</span>
                </div>
              </div>
              <div class="weather-detail-card">
                <div class="detail-icon precip"><i class="fa-solid fa-cloud-rain"></i></div>
                <div class="detail-info">
                  <span class="detail-label">Precipitation</span>
                  <span class="detail-value">0%</span>
                </div>
              </div>
            </div>
            
            <!-- Hourly Forecast -->
            <div class="weather-section">
              <h3 class="weather-section-title"><i class="fa-solid fa-clock"></i> Hourly Forecast</h3>
              <div class="hourly-scroll">
                <div class="hourly-item now">
                  <span class="hourly-time">Now</span>
                  <div class="hourly-icon"><i class="fa-solid fa-sun"></i></div>
                  <span class="hourly-temp">22°</span>
                </div>
                <div class="hourly-item">
                  <span class="hourly-time">10 AM</span>
                  <div class="hourly-icon"><i class="fa-solid fa-sun"></i></div>
                  <span class="hourly-temp">23°</span>
                </div>
                <div class="hourly-item">
                  <span class="hourly-time">11 AM</span>
                  <div class="hourly-icon"><i class="fa-solid fa-sun"></i></div>
                  <span class="hourly-temp">24°</span>
                </div>
                <div class="hourly-item">
                  <span class="hourly-time">12 PM</span>
                  <div class="hourly-icon"><i class="fa-solid fa-sun"></i></div>
                  <span class="hourly-temp">25°</span>
                </div>
                <div class="hourly-item">
                  <span class="hourly-time">1 PM</span>
                  <div class="hourly-icon"><i class="fa-solid fa-sun"></i></div>
                  <span class="hourly-temp">25°</span>
                </div>
                <div class="hourly-item">
                  <span class="hourly-time">2 PM</span>
                  <div class="hourly-icon"><i class="fa-solid fa-cloud-sun"></i></div>
                  <span class="hourly-temp">24°</span>
                </div>
                <div class="hourly-item">
                  <span class="hourly-time">3 PM</span>
                  <div class="hourly-icon"><i class="fa-solid fa-cloud-sun"></i></div>
                  <span class="hourly-temp">23°</span>
                </div>
                <div class="hourly-item">
                  <span class="hourly-time">4 PM</span>
                  <div class="hourly-icon"><i class="fa-solid fa-cloud"></i></div>
                  <span class="hourly-temp">21°</span>
                </div>
              </div>
            </div>
            
            <!-- 7-Day Forecast -->
            <div class="weather-section">
              <h3 class="weather-section-title"><i class="fa-solid fa-calendar-week"></i> 7-Day Forecast</h3>
              <div class="forecast-list">
                <div class="forecast-day today">
                  <div class="forecast-day-name"><span class="day-label">Today</span><span class="day-date">25 Jan</span></div>
                  <div class="forecast-icon"><i class="fa-solid fa-sun"></i></div>
                  <div class="forecast-temps"><span class="temp-max">25°</span><span class="temp-min">12°</span></div>
                  <div class="forecast-precip"></div>
                </div>
                <div class="forecast-day">
                  <div class="forecast-day-name"><span class="day-label">Sun</span><span class="day-date">26 Jan</span></div>
                  <div class="forecast-icon"><i class="fa-solid fa-sun"></i></div>
                  <div class="forecast-temps"><span class="temp-max">24°</span><span class="temp-min">11°</span></div>
                  <div class="forecast-precip"></div>
                </div>
                <div class="forecast-day">
                  <div class="forecast-day-name"><span class="day-label">Mon</span><span class="day-date">27 Jan</span></div>
                  <div class="forecast-icon"><i class="fa-solid fa-cloud-sun"></i></div>
                  <div class="forecast-temps"><span class="temp-max">23°</span><span class="temp-min">12°</span></div>
                  <div class="forecast-precip"><i class="fa-solid fa-droplet"></i><span>10%</span></div>
                </div>
                <div class="forecast-day">
                  <div class="forecast-day-name"><span class="day-label">Tue</span><span class="day-date">28 Jan</span></div>
                  <div class="forecast-icon"><i class="fa-solid fa-cloud"></i></div>
                  <div class="forecast-temps"><span class="temp-max">21°</span><span class="temp-min">10°</span></div>
                  <div class="forecast-precip"><i class="fa-solid fa-droplet"></i><span>20%</span></div>
                </div>
                <div class="forecast-day">
                  <div class="forecast-day-name"><span class="day-label">Wed</span><span class="day-date">29 Jan</span></div>
                  <div class="forecast-icon"><i class="fa-solid fa-sun"></i></div>
                  <div class="forecast-temps"><span class="temp-max">22°</span><span class="temp-min">11°</span></div>
                  <div class="forecast-precip"></div>
                </div>
                <div class="forecast-day">
                  <div class="forecast-day-name"><span class="day-label">Thu</span><span class="day-date">30 Jan</span></div>
                  <div class="forecast-icon"><i class="fa-solid fa-sun"></i></div>
                  <div class="forecast-temps"><span class="temp-max">24°</span><span class="temp-min">12°</span></div>
                  <div class="forecast-precip"></div>
                </div>
                <div class="forecast-day">
                  <div class="forecast-day-name"><span class="day-label">Fri</span><span class="day-date">31 Jan</span></div>
                  <div class="forecast-icon"><i class="fa-solid fa-sun"></i></div>
                  <div class="forecast-temps"><span class="temp-max">25°</span><span class="temp-min">13°</span></div>
                  <div class="forecast-precip"></div>
                </div>
              </div>
            </div>
          </div>
    `;
}

async function getLongWeekend() {
	const longWeekend = await fetch(
		`https://date.nager.at/api/v3/LongWeekend/${globalYear.value}/${globalCountry.value}`
	)
		.then((response) => response)
		.catch((error) => console.log("Error", error));
	longWeekendData = await longWeekend.json();
}

function displayLongWeekend() {
	let longWeekendsContentHTML = "";
	let i = 1;
	longWeekendData.forEach((longWeekend) => {
		longWeekendsContentHTML += `
        <div class="lw-card">
              <div class="lw-card-header">
                <span class="lw-badge"><i class="fa-solid fa-calendar-days"></i> ${longWeekend.dayCount} Days</span>
                <button class="holiday-action-btn" onclick="saveData('longWeekend', '${longWeekend.startDate} - ${longWeekend.endDate}', '${longWeekend.startDate}', '${currGlobalCountry.name.common}')"><i class="fa-regular fa-heart"></i></button>
              </div>
              <h3>Long Weekend #${i}</h3>
              <div class="lw-dates"><i class="fa-regular fa-calendar"></i> ${longWeekend.startDate} - ${longWeekend.endDate}</div>
              <div class="lw-info-box success"><i class="fa-solid fa-check-circle"></i> No extra days off needed!</div>
              <div class="lw-days-visual">
                <div class="lw-day"><span class="name">Thu</span><span class="num">1</span></div>
                <div class="lw-day weekend"><span class="name">Fri</span><span class="num">2</span></div>
                <div class="lw-day weekend"><span class="name">Sat</span><span class="num">3</span></div>
                <div class="lw-day weekend"><span class="name">Sun</span><span class="num">4</span></div>
              </div>
            </div>
        `;
		i++;
	});

	longWeekendsView.innerHTML =
		`
        <div class="view-header-card gradient-orange">
            <div class="view-header-icon"><i class="fa-solid fa-umbrella-beach"></i></div>
            <div class="view-header-content">
              <h2>Long Weekend Finder</h2>
              <p>Find holidays near weekends - perfect for planning mini-trips!</p>
            </div>
            <div class="view-header-selection">
              <div class="current-selection-badge">
                <img src="${currGlobalCountry.flags.png}" alt="${currGlobalCountry.name.common}" class="selection-flag">
                <span>${currGlobalCountry.name.common}</span>
                <span class="selection-year">${globalYear.value}</span>
              </div>
            </div>
        </div>
    ` + longWeekendsContentHTML;
}

async function getSunTimes() {
	const sunTimes = await fetch(`
    https://api.sunrise-sunset.org/json?lat=${currGlobalCountry.capitalInfo.latlng[0]}&lng=${currGlobalCountry.capitalInfo.latlng[1]}&formatted=0
    `)
		.then((response) => response)
		.catch((error) => console.log("Error", error));

	sunTimesData = await sunTimes.json();
}

function displaySunTimes() {
	const dateObject = new Date(sunTimesData.results.sunrise);
	const twilight = new Date(sunTimesData.results.civil_twilight_begin);
	const sunrise = new Date(sunTimesData.results.sunrise);
	const solarNoon = new Date(sunTimesData.results.solar_noon);
	const sunset = new Date(sunTimesData.results.sunset);
	const dusk = new Date(sunTimesData.results.civil_twilight_end);
	const dayLength = sunTimesData.results.day_length;
	sunTimesView.innerHTML = `
              <div class="view-header-card gradient-sunset">
            <div class="view-header-icon"><i class="fa-solid fa-sun"></i></div>
            <div class="view-header-content">
              <h2>Sunrise & Sunset Times</h2>
              <p>Plan your activities around golden hour - perfect for photographers</p>
            </div>
            <div class="view-header-selection">
              <div class="current-selection-badge">
                <img src="${currGlobalCountry.flags.png}" alt="${currGlobalCountry.name.common}" class="selection-flag">
                <span>${currGlobalCountry.name.common}</span>
                <span class="selection-city">• ${currGlobalCountry.capital}</span>
              </div>
            </div>
          </div>
          
          <div id="sun-times-content" class="sun-times-layout">
            <div class="sun-main-card">
              <div class="sun-main-header">
                <div class="sun-location">
                  <h2><i class="fa-solid fa-location-dot"></i> ${currGlobalCountry.capital}</h2>
                  <p>Sun times for your selected location</p>
                </div>
                <div class="sun-date-display">
                  <div class="date">${dateObject.toISOString().split("T")[0]}</div>
                  <div class="day">${dateObject.toLocaleDateString("en-US", { weekday: "long" })}</div>
                </div>
              </div>
              
              <div class="sun-times-grid">
                <div class="sun-time-card dawn">
                  <div class="icon"><i class="fa-solid fa-moon"></i></div>
                  <div class="label">Dawn</div>
                  <div class="time">${twilight.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</div>
                  <div class="sub-label">Civil Twilight</div>
                </div>
                <div class="sun-time-card sunrise">
                  <div class="icon"><i class="fa-solid fa-sun"></i></div>
                  <div class="label">Sunrise</div>
                  <div class="time">${sunrise.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</div>
                  <div class="sub-label">Golden Hour Start</div>
                </div>
                <div class="sun-time-card noon">
                  <div class="icon"><i class="fa-solid fa-sun"></i></div>
                  <div class="label">Solar Noon</div>
                  <div class="time">${solarNoon.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</div>
                  <div class="sub-label">Sun at Highest</div>
                </div>
                <div class="sun-time-card sunset">
                  <div class="icon"><i class="fa-solid fa-sun"></i></div>
                  <div class="label">Sunset</div>
                  <div class="time">${sunset.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</div>
                  <div class="sub-label">Golden Hour End</div>
                </div>
                <div class="sun-time-card dusk">
                  <div class="icon"><i class="fa-solid fa-moon"></i></div>
                  <div class="label">Dusk</div>
                  <div class="time">${dusk.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</div>
                  <div class="sub-label">Civil Twilight</div>
                </div>
                <div class="sun-time-card daylight">
                  <div class="icon"><i class="fa-solid fa-hourglass-half"></i></div>
                  <div class="label">Day Length</div>
                  <div class="time">${dayLength}</div>
                  <div class="sub-label">Total Daylight</div>
                </div>
              </div>
            </div>
            
            <div class="day-length-card">
              <h3><i class="fa-solid fa-chart-pie"></i> Daylight Distribution</h3>
              <div class="day-progress">
                <div class="day-progress-bar">
                  <div class="day-progress-fill" style="width: 44.6%"></div>
                </div>
              </div>
              <div class="day-length-stats">
                <div class="day-stat">
                  <div class="value">${dayLength}</div>
                  <div class="label">Daylight</div>
                </div>
                <div class="day-stat">
                  <div class="value">${((dayLength / 86400) * 100).toFixed(1)}%</div>
                  <div class="label">of 24 Hours</div>
                </div>
                <div class="day-stat">
                  <div class="value">${86400 - dayLength}</div>
                  <div class="label">Darkness</div>
                </div>
              </div>
            </div>
          </div>
  `;
}

async function convertCurrency() {
	const amount = await fetch(
		`https://v6.exchangerate-api.com/v6/9d61655eabb79ba790a2a986/pair/${currencyFrom.value}/${currencyTo.value}/${currencyAmount.value}`
	)
		.then((response) => response)
		.catch((error) => console.log("Error", error));

	let currencyData = await amount.json();
	console.log(currencyData);

	currencyResult.innerHTML = `
  <div id="currency-result" class="currency-result">
    <div class="conversion-display">
      <div class="conversion-from">
        <span class="amount">${currencyAmount.value}</span>
        <span class="currency-code">${currencyFrom.value}</span>
      </div>
      <div class="conversion-equals"><i class="fa-solid fa-equals"></i></div>
      <div class="conversion-to">
        <span class="amount">${currencyData.conversion_result}</span>
        <span class="currency-code">${currencyTo.value}</span>
      </div>
    </div>
    <div class="exchange-rate-info">
      <p>1 ${currencyFrom.value} = ${currencyData.conversion_rate} ${currencyTo.value}</p>
      <small>Last updated: January 25, 2026</small>
    </div>
  </div>
  `;
}

function displayMyPlans() {
	myPlansView.innerHTML = `
  <div class="view-header-card gradient-pink">
    <div class="view-header-icon"><i class="fa-solid fa-heart"></i></div>
    <div class="view-header-content">
      <h2>My Saved Plans</h2>
      <p>Your saved holidays, events, and trip ideas all in one place</p>
    </div>
    <div class="plans-actions">
      <button class="btn-white-outline" id="clear-all-plans-btn">
        <i class="fa-solid fa-trash"></i> Clear All
      </button>
    </div>
  </div>
    <div class="plans-filter-bar">
    <button class="plan-filter active" data-filter="all">
      <i class="fa-solid fa-layer-group"></i> All
      <span class="filter-count" id="filter-all-count">0</span>
    </button>
    <button class="plan-filter" data-filter="holiday">
      <i class="fa-solid fa-calendar-check"></i> Holidays
      <span class="filter-count" id="filter-holiday-count">0</span>
    </button>
    <button class="plan-filter" data-filter="event">
      <i class="fa-solid fa-ticket"></i> Events
      <span class="filter-count" id="filter-event-count">0</span>
    </button>
    <button class="plan-filter" data-filter="longweekend">
      <i class="fa-solid fa-umbrella-beach"></i> Long Weekends
      <span class="filter-count" id="filter-lw-count">0</span>
    </button>
  </div>
  `;
	let plansContentHTML = "";
	myPlans.forEach((plan) => {
		plansContentHTML += `
    <div class="plan-card">
      <div class="plan-card-header">
        <span class="plan-type-badge">${plan.type}</span>
        <button class="plan-delete-btn" onclick="deletePlan('${plan}')"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <h3>${plan.content.name}</h3>
      <p><i class="fa-regular fa-map-marker"></i> ${plan.content.location}</p>
      <div class="plan-date"><i class="fa-regular fa-calendar"></i> ${plan.content.date}</div> 
    </div>
    `;
	});
	myPlansView.innerHTML += plansContentHTML;
}

window.deletePlan = function (plan) {
	myPlans = myPlans.filter((p) => p != plan);

	localStorage.setItem("myPlans", JSON.stringify(myPlans));
	displayMyPlans();
};
