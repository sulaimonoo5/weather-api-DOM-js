const apiKey = "4f2492004f114c0a9fd132407240212";

const searchSvg = document.querySelector("#vector");
const input = document.querySelector("#search");
const form = document.querySelector("#formInput");
const header = document.querySelector("#head");
const contentContainerSidebar = document.querySelector(
  "#contentContainerSidebar"
);

const weatherIconsMap = {
  "sunny": "img/svg/01_sunny.svg",
  "clear night": "img/svg/02_clear_night.svg",
  "partly cloudy day": "img/svg/03_partly_cloudy_day.svg",
  "cloud": "img/svg/04_cloud.svg",
  "light rain": "img/svg/05_light_rain.svg",
  "moderate rain": "img/svg/06_moderate_rain.svg",
  "heavy rain": "img/svg/07_heavy_rain.svg",
  "thunder rain": "img/svg/08_thunder_rain.svg",
  "snow": "img/svg/09_snow.svg",
  "fog": "img/svg/11_fog.svg",
  "mist": "img/svg/12_mist.svg",
  "windy": "img/svg/13_windy.svg",
  "hail": "img/svg/14_hail.svg",
  "sleet": "img/svg/15_sleet.svg",
  "thunder": "img/svg/16_thunder.svg",
  "sun cloud rain": "img/svg/17_sun_cloud_rain.svg",
  "moon cloud": "img/svg/18_moon_cloud.svg",
  "night cloud rain": "img/svg/19_night_cloud_rain.svg",
  "drizzle": "img/svg/20_drizzle.svg",
  "cloudy day": "img/svg/21_cloudy_day.svg",
  "overcast": "img/svg/22_overcast.svg",
  "sunrise": "img/svg/23_sunrise.svg",
  "sunset": "img/svg/24_sunset.svg",
  "cloud with snow": "img/svg/25_cloud_with_snow.svg",
  "moon": "img/svg/26_moon.svg",
  "night clear": "img/svg/27_night_clear.svg",
  "night cloud": "img/svg/28_night_cloud.svg",
  "thunder night": "img/svg/29_thunder_night.svg",
  "default": "img/svg/30_default.svg"
};


let city;

// < --- Определение местоположения пользователя --- .
window.onload = () => {
  const savedCity = localStorage.getItem("lastCity");

  if (savedCity) {
    // если город уже сохранён, показываем его
    city = savedCity;
    input.value = city;
    getWeather(city);
  } else if (navigator.geolocation) {
    // иначе пробуем определить местоположение
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        // запрос погоды по координатам
        const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}`;

        fetch(url)
          .then((res) => res.json())
          .then((data) => {
            city = data.location.name;
            input.value = city;
            localStorage.setItem("lastCity", city);
            getWeather(city);
          })
          .catch((error) => {
            console.error("Ошибка при определении геопозиции:", error);
          });
      },
      (error) => {
        console.warn("Геолокация отклонена:", error.message);
        city = "Find a city in the search";
        input.value = city;
        getWeather(city);
      }
    );
  } else {
    city = "Find a city in the search";
    input.value = city;
    getWeather(city);
  }
};

// < --- Обработка формы поиска --- >
form.onsubmit = function (event) {
  event.preventDefault();
  city = input.value.trim();
  if (city) {
    localStorage.setItem("lastCity", city);
    getWeather(city);
  }
};

// < --- Основная функция получения данных о погоде --- >
function getWeather(city) {
  const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      // Удаляем старые данные
      const prevCondition = document.querySelector("#condition");
      if (prevCondition) prevCondition.remove();

      const prevWeatherInfo = document.querySelector(".weatherInfo");
      if (prevWeatherInfo) prevWeatherInfo.remove();

      // Получаем правильную иконку
      const conditionText = data.current.condition.text.toLowerCase();
      const iconSrc = weatherIconsMap[conditionText] || "img/svg/default.svg";

      // --- Основная карточка погоды ---
      const html = `
        <section class="condition" id="condition">
          <div class="content">
            <h1>${Math.round(data.current.temp_c)}<sup>°</sup></h1>
          </div>
          <div class="contentInside">
            <h3>${data.location.name}</h3>
            <p>${data.location.localtime}</p>
          </div>
          <img src="${iconSrc}" alt="${data.current.condition.text}" class="imgIcon" {
            constructor(parameters) {
                
            }
          } />
        </section>
      `;

      //< --- Дополнительные данные --- >
      const html2 = `
        <section class="weatherInfo">
          <div class="weatherBox">
            <div class="weatherContent">
              <h1>Weather details</h1>
            </div>
            <div class="weatherConditionMain">
              <div class="weatherType">
                <h1>${data.current.condition.text}</h1>
              </div>
              <div class="weatherCondition">
                <ul class="ulStyle">
                  <li>Temp max</li>
                  <li>Feels like</li>
                  <li>Humidity</li>
                  <li>Cloudiness</li>
                  <li>Wind</li>
                </ul>
                <div class="weatherIcons">
                  <div class="iconItem">
                    <p>${Math.round(data.current.temp_c)}°</p>
                    <img src="img/max_temp.svg" alt="temp max" />
                  </div>
                  <div class="iconItem">
                    <p>${Math.round(data.current.feelslike_c)}°</p>
                    <img src="img/temp_min.svg" alt="feels like" />
                  </div>
                  <div class="iconItem">
                    <p>${Math.round(data.current.humidity)}%</p>
                    <img src="img/humadity.svg" alt="humidity" />
                  </div>
                  <div class="iconItem">
                    <p>${data.current.cloud}%</p>
                    <img src="img/cloudness.svg" alt="cloudy" />
                  </div>
                  <div class="iconItem">
                    <p>${data.current.wind_kph} km/h</p>
                    <img src="img/wind.svg" alt="wind" />
                  </div>
                </div>
              </div>
            </div>
            <div class="mainEndLine">
              <div class="endLine"></div>
            </div>
          </div>
        </section>
      `;

      // Вставляем карточки
      header.insertAdjacentHTML("afterend", html2);
      if (contentContainerSidebar) {
        contentContainerSidebar.insertAdjacentHTML("afterend", html);
      } else {
        header.insertAdjacentHTML("afterend", html);
      }
    })
    .catch((error) => {
      console.error("Ошибка при получении данных:", error);
    });
}

// < --- Перезагрузка по Enter --- >
document.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    location.reload();
  }
});
