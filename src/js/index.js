import icons from './icons';
import { format } from "date-fns"
import '../css/styles.scss';
import '../css/nextWeather.scss';

const tempMetric = document.querySelector(".celsus-fahrenheit-menu")
const search = document.querySelector(".search");
const temper = document.querySelector(".temper")
const nextHours = document.querySelector(".next-hours")
const nextDays = document.querySelector(".next-days");
const todayConditions = document.querySelector(".today-conditions")
const currentDate = new Date;
const formateDate = format(currentDate, 'EEE, d MMM');
const todayForecast = [];
const hours = [];
const days = []

const apiKey = process.env.weather_API_KEY;
const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/london?key=${apiKey}`;
let forecast = await getForecast(url);

function convertorTemper(temperature) {
  let degress;
  const changeScale = document.querySelector(".current-metric")

  if (changeScale.classList.contains("celsus")) {
    degress = (temperature - 32) * 5 / 9;
    return degress.toFixed() + "°C"
  } else {
    degress = (temperature * 9 / 5) + 32;
    return degress.toFixed() + "°F"
  }
}

async function getForecast(url, city) {
  const response = await fetch(url);
  const dados = await response.json();

  return dados;
}

function showForecast(dados) {
  days.length = 0 
  const date = document.querySelector(".date");
  date.textContent = formateDate;
  handleCityCountryName(dados.resolvedAddress);

  todayForecast.push(dados.days[0]);
  days.push(dados.days)

  const vpWidth = temper.clientWidth
  todayForecast[0].hours.forEach((hour, index) => {
    if (parseInt(hour.datetime) > currentDate.getHours()) {
      if (hours.length > 5 ) return;
      hours.push(hour)
    }
  })

  setTemper(temper)
  forecastPerHour()
  nextDaysForecast(days[0])

}


function nextDaysForecast(days) {
  const daysArr = days.slice(2, 8)

  let date = [];
  daysArr.forEach((day) => {
    date.push(format(day.datetime, 'EEE, d '));
  })
  nextDays.innerHTML = ''
  nextDays.innerHTML += daysArr.map(({ tempmax, tempmin, icon }, index) => `
    <li>
  <div class="day">
      <p>${date[index]}</p>
      <div class="day-temper">
          <p class="max">${convertorTemper(tempmax)}</p>/
          <p class="min">${convertorTemper(tempmin)}</p>
          <img src=${icons.find(img => img.name == icon).src} alt="">
      </div>
  </div>
</li>
  `).join('')
}

function forecastPerHour() {
  nextHours.innerHTML = hours.map(({ datetime, icon, temp }) => `
    <div class="next-hour">
<p class="hour">${datetime.slice(0, 5)} <span class="period">${parseInt(datetime) >= 12 ? "PM" : "AM"}</span></p>
<img class="weather-icon" src=${icons.find(img => img.name == icon).src}  alt="">
<p class="degress">${convertorTemper(temp)}°</p>
</div>  
  `).join('')


}

function setTemper(temperContainer) {
  temperContainer.innerHTML = ''
  temperContainer.innerHTML = todayForecast.map(({ feelslike, icon, temp, conditions, tempmax, tempmin }) =>
    `
    <img class="current-forecast-icon" src=${icons.find(img => img.name == icon).src}  alt="weather-icon">
     <div class="description">
         <div class="celsus-fahrenheit">
            <p class="degress">${convertorTemper(temp)}</p>
            <p class="current-condition">${conditions}</p>
         </div>
        <div class="min-max-condition">                                
           <p>Feels like: ${convertorTemper(feelslike)}°</p>
           <span class="feels-max">${convertorTemper(tempmax)}°</span>/
           <span class="feels-min">${convertorTemper(tempmin)}°</span>
       </div>
    </div>
 `
  ).join('')

  todayConditions.innerHTML = todayForecast.map(({ humidity, sunrise, sunset, uvindex, visibility, windspeed }) => `
      <p class="conditions">Conditions</p>
                            <ul class="weather-conditions">
                                <li>
                                    <div class="conditions-icon">
                                        <i class="fa-solid fa-wind"></i>
                                        <p>Wind Speed</p>
                                    </div>
                                    <span class="wind condition-value">${windspeed}km</span>
                                </li>
                                <li>
                                    <div class="conditions-icon">
                                        <i class="fa-solid fa-droplet"></i>
                                        <p>Humidity</p>
                                    </div>
                                    <span class="humidity condition-value">${humidity}%</span>
                                </li>
                                <li>
                                    <div class="conditions-icon">
                                        <i class="fa-solid fa-sun"></i>
                                        <p>UV index</p>
                                    </div>
                                    <span class="uv-index">${uvindex}</span>
                                </li>
                                <li>
                                    <div class="conditions-icon">
                                        <i class="fa-solid fa-eye-low-vision"></i>
                                        <p>Visibility</p>
                                    </div>
                                    <span class="visibility condition-value">${visibility}</span>
                                </li>
                                <li>
                                    <div class="conditions-icon">
                                        <i class="fa-regular fa-sun"></i>
                                        <p>Sunrise</p>
                                    </div>
                                    <span class="sunrise condition-value">${sunrise.length > 5 ? sunrise.slice(0, 5) : sunrise}</span>
                                </li>
                                <li>
                                  <div class="conditions-icon">
                                        <i class="fa-regular fa-sun"></i>
                                        <p>Sunset</p>
                                    </div>
                                  <span class="sunset condition-value">${sunset.length > 5 ? sunset.slice(0, 5) : sunset}</span>
                              </li>
               </ul>
  `).join("")

}


function handleCityCountryName(address) {
  const currentCity = document.querySelector(".city")
  const currentCountry = document.querySelector(".country");
  const regex = /(\p{L}+(?:[-\s’]\p{L}+)*),\s*(\p{L}+(?:[-\s’]\p{L}+)*)/iu;

  const [ city, country] = address.match(regex)
  currentCity.textContent = city + ",";
  currentCountry.textContent = country

}


tempMetric.addEventListener("click", (e) => {
  const metric = document.querySelector(".current-metric")
  if (metric.classList.contains("celsus") || metric.classList.contains("fahrenheit")) {
    metric.classList.toggle("celsus")
    metric.classList.toggle("fahrenheit")
  }

  forecastPerHour()
  setTemper(temper)
  nextDaysForecast(days[0])
})

search.addEventListener("click", async() => {
  const city = document.querySelector(".search-input")

  if (!city.value) return;
  
  if (todayForecast.length > 0) {
    todayForecast.splice(0, 1)
    hours.splice(0, 6)
  }

  const urlCity = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city.value}?key=${apiKey}`

   forecast = await getForecast(urlCity, city.valuel);
  console.log(forecast);
  
  showForecast(forecast, city.value)
  city.value = '';
})

window.addEventListener("resize", () => {
  const vpWidth = temper.clientWidth

  if (vpWidth <= 461 && hours.length > 5) {
    hours.pop()
  } else if (vpWidth > 700) {
    todayForecast[0].hours.forEach((hour, index) => {
      if (parseInt(hour.datetime) > parseInt(hours[hours.length - 1].datetime)) {
        if (hours.length > 5) return;
        hours.push(hour)
      }
      forecastPerHour()

    })
  }


})

showForecast(forecast)

