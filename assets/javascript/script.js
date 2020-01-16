var APIKey = "0234a5db053f0c8c1789c2487e8d0de2";
// var forecastUrl = "https://samples.openweathermap.org/data/2.5/forecast?lat=" + latitude + "&lon=" + longitude + "&appid=" + APIKey
var buttonDiv = $(".button-div")
var cityButtonArr = []

initialize();

$("#form").on('submit', function(e){
  e.preventDefault();
  var city=""
  city = $("#city-input").val()
  searchWeather(city, function(response) {


    const longitude = response.coord.lon
    var latitude = response.coord.lat
    var icon = `http://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`

    $('#icon').html(`<img src="${icon}">`); //  ES6

    
    console.log(longitude, latitude)
    displayWeatherInfo(response);
    var F = convertToFarenheit(response.main.temp); 
    $("#temperature").empty()
    $("#temperature").append("Temperature: " + F + "°")


    ///////////////////////////////////////////////////////
    forecastData();

    function forecastData(){
      var forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + latitude + "35&lon=" + longitude + "&units=imperial&APPID=0234a5db053f0c8c1789c2487e8d0de2"
      $.ajax({
        url: forecastUrl,
        method: "GET"
      }).then(function(response) {
        console.log(response)
        $(".forecast-div").empty()
        for(i=0; i<5; i++){
          var createDiv = $("<div>")
          createDiv.attr("class", "forecast-box")
          $(".forecast-div").append(createDiv)
        }
      })
    }
    ///////////////////////////////////////////////////////


    generateButton();
    clearForm();

    function generateButton() {
      $("#city-input").text("")
      var create = $("<button>")
      create.attr("class", "btn btn-outline-secondary")
      create.attr("type", "button")
      create.text(response.name)
      buttonDiv.prepend(create)
      var cityString = response.name
      cityButtonArr.push(cityString.toString())
      localStorage.setItem("cityStorage", JSON.stringify(cityButtonArr))};  
  });
});
loadData();

function loadData() {
    var loadData = localStorage.getItem("cityStorage")
    if (loadData == null || loadData == "") return;
    cityButtonArr = JSON.parse(loadData)
    for (i = 0; i < cityButtonArr.length; i++) {
        var create = $("<button>")
        create.attr("class", "btn btn-outline-secondary")
        create.attr("type", "button")
        create.text(cityButtonArr[i])
        buttonDiv.prepend(create)
    };
};

function searchWeather(city, callback) {
  var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;
  $.ajax({
    url: queryURL,
    method: "GET"
  })
  .then(function(response) {
      callback(response);
  })
  .catch()
}


function convertToFarenheit(num) {
  var convert = num;
  var F = (convert - 273.15) * 1.80 + 32
  F = F.toFixed(0)

  return F; // 0
}


function displayWeatherInfo(response) {

  $("#city-title").html(response.name)
  $(".city").attr("style", "font-weight: bold; font-size: 30px", )
  $("#wind-speed").html("Wind speed: " + response.wind.speed + " MPH")
}


$(".btn").on('click', function(){
  city = $(this).text()
  searchWeather(city, function(response) {
    reloadData();
    displayWeatherInfo(response);
    var F =  convertToFarenheit(response.main.temp); 
    $("#temperature").append("Temperature: " + F + "°")
  });
});

//Function to clear the input field upon 'submit'
function clearForm(){
  $("form").trigger('reset');
}

//function to have a city pre-loaded
//Plan to pre-populate the page according to the location of the user
function initialize(){
  var city="Atlanta"
  var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    reloadData();
    $("#city-title").append(response.name)
    $(".city").attr("style", "font-weight: bold; font-size: 30px", )
    $("#wind-speed").append("Wind speed: " + response.wind.speed + " MPH")
    var convert = response.main.temp
    var F = (convert - 273.15) * 1.80 + 32
    F = F.toFixed(0)
    $("#temperature").append("Temperature: " + F + "°")
})};

function reloadData(){
$("#city-title").empty()
$("#temperature").empty()
$("#wind-speed").empty()
};
