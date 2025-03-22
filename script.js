//weather api
const apiKey = "efc34a021fbbfa0078319a6ec9678631";
const apiUrl =
  "https://api.openweathermap.org/data/2.5/weather?&units=metric&q=";
//DOM handling
const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");


//location
document.addEventListener("DOMContentLoaded", () => {
  getLocation();
});

//fetch weather using api
async function checkWeather(city) {
  const response = await fetch(`${apiUrl}${city}&appid=${apiKey}`);

  //invalid city name
  if (response.status == 404) {
    document.querySelector(".error").style.display = "block";
    document.querySelector(".weather").style.display = "none";
  } else {
    let data = await response.json();
    console.log(data);
    //save to local storage (weather history and user location)
    localStorage.setItem("weatherHist", JSON.stringify(data));
    localStorage.setItem("prevCoord", JSON.stringify(data.coord));

    display(data);
  }
}

//get user location
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        //loading lat ang lon from api obj
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        localStorage.setItem("prevCoord", JSON.stringify({ lat, lon }));
        weatherByCoord(lat, lon);
      },
      () => {
        //default if permission denied
        loadPrev();
      }
    );
  } else {
    //no location support
    loadPrev();
  }
}

//display using loacation
async function weatherByCoord(lat, lon) {
  const response = await fetch(apiUrl + `&lat=${lat}&lon=${lon}&appid=${apiKey}`);

  if(response.status === 404){
    loadPrev();
  } else {
  const data = await response.json();

  localStorage.setItem('weatherHist',JSON.stringify(data));
  display(data);
  }
}

//display history
function loadPrev(){
  const hist = localStorage.getItem("weatherHist");

  if (hist) {
    display(JSON.parse(hist));
  } else {
    document.querySelector(".weather").style.display = "none";
  }
}

//display weather function
function display(data) {
  //weather details
  document.querySelector(".main").innerHTML = data.weather[0].main;
  document.querySelector(".city").innerHTML = data.name;
  document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°c";
  document.querySelector(".feels-like").innerHTML = "Feels like " + Math.round(data.main.feels_like) + "°";
  document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
  document.querySelector(".wind").innerHTML = data.wind.speed + " Km/h";
  document.querySelector(".sunrise").innerHTML = con(data.sys.sunrise);
  document.querySelector(".sunset").innerHTML = con(data.sys.sunset);

  //weather icon
  const icon =data.weather[0].icon;
  weatherIcon.src = `https://openweathermap.org/img/wn/${icon}@2x.png`

  document.querySelector(".weather").style.display = "block";
  document.querySelector(".error").style.display = "none";
}

function con(time) {
  const date = new Date(time * 1000);
  return date.toLocaleTimeString([],{
    hour:'2-digit', minute: '2-digit', hour12: true
  });
}

searchBtn.addEventListener("click", () => {
  checkWeather(searchBox.value);
});
searchBox.addEventListener('keydown',(event)=>{
  if(event.key === 'Enter'){
    checkWeather(searchBox.value);
  }
});