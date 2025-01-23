import icons  from './icons';
import { format } from "date-fns"
import '../css/styles.scss';
import '../css/nextHours.scss';
// import logo from  '../assets/img/cloudy.svg'

const tempMetric = document.querySelector(".celsus-fahrenheit-menu")
const search = document.querySelector(".search");
const currentDate = new Date;
const formateDate = format(currentDate, 'EEE, d MMM');
const temper = document.querySelector(".temper")
const todayConditions = document.querySelector(".today-conditions") 
const weatherForecast = [];

const apiKey = process.env.weather_API_KEY;
const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/london?key=${apiKey}`;



tempMetric.addEventListener("click", (e) => {
  const metric = document.querySelector(".current-metric")
  if (metric.classList.contains("celsus") || metric.classList.contains("fahrenheit")) {
    metric.classList.toggle("celsus")
    metric.classList.toggle("fahrenheit")
  }

  setTemper(temper)
})

search.addEventListener("click", () => {
  const city = document.querySelector(".search-input")

  if (!city.value) return;

  if (weatherForecast.length > 0) {
    weatherForecast.splice(0, 1)
  }


  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city.value}?key=${apiKey}`

  getForecast(url, city.valuel);
  city.value = '';
})


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
  // return degress.toFixed();
}

async function getForecast(url, city) {
  const response = await fetch(url);
  const dados = await response.json();
  console.log(dados);

  showForecast(dados, city);
}

function showForecast(dados) {
  const date = document.querySelector(".date");
  date.textContent = formateDate;
  handleCityCountryName(dados.resolvedAddress);

  weatherForecast.push(dados.days[0])
  console.log(weatherForecast);


  setTemper(temper)


}


function setTemper(temperContainer) {
  console.log(weatherForecast);
  temperContainer.innerHTML = ''
  temperContainer.innerHTML = weatherForecast.map(({ feelslike, icon, temp,conditions ,tempmax, tempmin }) =>
    `
    <img class="current-forecast-icon" src=${icons.find(img => img.name == icon).src }  alt="weather-icon">
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
  );

  todayConditions.innerHTML = weatherForecast.map(({humidity, sunrise, sunset, uvindex, visibility, windspeed }) => `
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
  `)

}


function handleCityCountryName(address) {
  const currentCity = document.querySelector(".city")
  const currentCountry = document.querySelector(".country");
  const regex = /(\p{L}+(?:[-\s’]\p{L}+)*),\s*(\p{L}+(?:[-\s’]\p{L}+)*)/iu;

  const [, city, country] = address.match(regex)
  currentCity.textContent = city + ",";
  currentCountry.textContent = country

}

getForecast(url)