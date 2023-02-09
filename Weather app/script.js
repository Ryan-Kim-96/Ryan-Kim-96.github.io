let weather = {
    "apiKey": "c6357629c1f0459fb1857231cafee2fc",
    fetchWeather: function (city){
        fetch(
            "https://api.openweathermap.org/data/2.5/weather?q=" 
            + city 
            + "&units=metric&appid="
            + this.apiKey
        )
        .then((response) => response.json())
        .then((data) => this.displayWeather(data));

    },
    displayWeather: function(data){
        const { name } = data;
        const { icon, description} = data.weather[0];
        const { temp, temp_min, temp_max, humidity } = data.main;
        const { speed} = data.wind;
        const {country} = data.sys;
        console.log(name,icon,description,temp, humidity, speed)
        document.querySelector(".city").innerText = name + ",";
        document.querySelector(".country").innerText = country;
        document.querySelector(".temp").innerText = temp + "°C";
        document.querySelector(".min-temp").innerText = temp_min + "°C";
        document.querySelector(".max-temp").innerText = temp_max + "°C";
        document.querySelector(".icon").src = "http://openweathermap.org/img/wn/" + icon +"@2x.png";
        document.querySelector(".description").innerText = description;
        document.querySelector(".humidity").innerText = humidity + "%";
        document.querySelector(".wind").innerText = speed + " km/h";
        document.querySelector(".weather").classList.remove("loading");
    },
    search: function (){
        this.fetchWeather(document.querySelector(".search-bar").value);
    },
};
const search = document.querySelector(".search-bar");

search.addEventListener("keyup", function (event) {
    if(event.key == "Enter"){
        weather.search();
        search.value = "";
    }
})

weather.fetchWeather("Denver");