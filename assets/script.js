var key= 'a800ea7f8cc0702f015d7413dcbb5ddc';
var city ="Minneapolis"

//grabbing the current day and time
var date = dayjs().format('dddd, MMM DD, YYYY');
var dateTime = dayjs().format('YYYY-MM-DD HH:MM:SS');


var cityHistory = [];
$('.search').on("click", function (event){
    event.preventDefault();
    city = $(this).parent('.btnPar').siblings('textVal').val();
    if (city === "") {
        return;
    };

cityHistory.push(city);

localStorage.setItem('city', JSON.stringify(cityHistory));
fiveDayForecastEl.empty();
getHistory();
getWeatherToday();

});

// Makes buttons based on search history

var contHistoryEl = $('.cityHistory');
// ...

function getHistory() {
    contHistoryEl.empty();
    for (let i = 0; i < cityHistory.length; i++) {
      var btnEl = $('<button>').text(`${cityHistory[i]}`);
      var rowEl = $('<row>');
  
      rowEl.addClass('row histBtnRow'); // Fix: use addClass instead of addclass
      btnEl.addClass('btn btn-outline-secondary histBtn'); // Fix: use addClass instead of addclass
      btnEl.attr('type', 'button'); // Fix: use attr to set the attribute
  
      contHistoryEl.prepend(rowEl);
      rowEl.append(btnEl);
    }
    if (!city) {
      return;
    }
    // give the history button a search function
    $('.histBtn').on('click', function (event) {
      event.preventDefault();
      city = $(this).text();
      fiveDayForecastEl.empty();
      getWeatherToday();
    });
  }
  
  // ...
  
  function initload() {
    var cityHistStore = JSON.parse(localStorage.getItem('city')); // Fix: use JSON.parse instead of json.parse
  
    if (cityHistStore !== null) {
      cityHistory = cityHistStore; // Fix: correct variable name
    }
    getHistory();
    getWeatherToday();
  }
  
  // ...
  





var cardTodayBody = $('.cardBodyToday')

function getWeatherToday () {
    var getUrl = 'https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${key}'
$(cardTodayBody).empty()

fetch(getUrl)
.then(response => {
    if (!response.ok) {
        throw new Error ('Error');
    }
    return response.json()
})
.then(response =>{
    $('cardTodaycityName').text(response.name);
    $('.cardTodayDate').text(date);
    $('.icons').attr('src',`https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`)

//displays temp, real feel, windspeed
var pEl = $('<p>').text(`Temperature: ${response.main.temp} °F`);
cardTodayBody.append(pEl);

var pElTemp = $('<p>').text(`Feels Like: ${response.main.feels_like} °F`);
      cardTodayBody.append(pElTemp)

      var pElWind = $('<p>').text(`Wind Speed: ${response.wind.speed} MPH`);
      cardTodayBody.append(pElWind);

      var cityLat = response.coord.lat;
      var citLon = response.coord.lon;

      var getUrlGlobal = `https://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLon}&exclude=hourly,daily,minutely&appid=${key}`;

      return fetch(getUrlGlobal);
})
.then(response =>{
    if (!response.ok) {
        throw new console.error('Error');
    }
    return response.json();
})
.then(response => {
    var pElUvi = $('<p>').text(`UV Index: `);
    var uviSpan = $('<span>').text(response.current.uvi);
    var uvi = response.current.uvi;
    pElUvi.append(uviSpan);
    cardTodayBody.append(pElUvi);
})

getFiveDayForecast();
};

var fiveForecastEl = $('.fiveForecast');

function getFiveDayForecast() {
  var getUrlFiveDay = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${key}`;

  fetch(getUrlFiveDay)
    .then(response => {
      if (!response.ok) {
        throw new Error('Error');
      }
      return response.json();
    })
    .then(response => {
      var fiveDayArray = response.list;
      var myWeather = [];

    
      fiveDayArray.forEach(value => {
        testObj = {
          date: value.dt_txt.split(' ')[0],
          time: value.dt_txt.split(' ')[1],
          temp: value.main.temp,
          feels_like: value.main.feels_like,
          icon: value.weather[0].icon,
          
        };

        if (value.dt_txt.split(' ')[1] === '12:00:00') {
          myWeather.push(testObj);
        }
      });

      // Inject the cards to the screen
      myWeather.forEach(weather => {
        var divElCard = $('<div>');
        divElCard.attr('class', 'card text-white bg-primary mb-3 cardOne');
        divElCard.attr('style', 'max-width: 200px;');
        fiveForecastEl.append(divElCard);

        var divElHeader = $('<div>');
        divElHeader.attr('class', 'card-header');
        var m = moment(`${weather.date}`).format('MM-DD-YYYY');
        divElHeader.text(m);
        divElCard.append(divElHeader);

        var divElBody = $('<div>');
        divElBody.attr('class', 'card-body');
        divElCard.append(divElBody);

        var divElIcon = $('<img>');
        divElIcon.attr('class', 'icons');
        divElIcon.attr('src', `https://openweathermap.org/img/wn/${weather.icon}@2x.png`);
        divElBody.append(divElIcon);

        // Temp
        var pElTemp = $('<p>').text(`Temperature: ${weather.temp} °F`);
        divElBody.append(pElTemp);
        // Feels Like
        var pElFeel = $('<p>').text(`Feels Like: ${weather.feels_like} °F`);
        divElBody.append(pElFeel);
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });
});
};
function initload () {
    var cityHistStore = json.parse(localStorage.getitem('city'));

    if  (cityHistStore !== null){
        cityhist = cityHistStore
    }
    getHistory();
    getWeatherToday();
};

initload();
