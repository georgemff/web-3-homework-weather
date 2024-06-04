import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [city, setCity] = useState("tbilisi");
  const [inputValue, setInputValue] = useState("");
  const [weather, setWeather] = useState(null);
  const [errorText, setErrorText] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setErrorText("");
    if (city) {
      setLoading(true);
      axios({
        method: "GET",
        url: `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=64028ba5cc6e24f1a64b78f2290e9e54`,
      })
        .then((res) => {
          if (res && res.data) {
            const data = res.data;
            setWeather({
              temp: {
                temp: Math.round(data.main.temp),
                temp_max: Math.round(data.main.temp_max),
                temp_min: Math.round(data.main.temp_min)
              },
              city: `${data.name}, ${data.sys.country}`,
              weatherType: data.weather[0]?.main,
            });
          }
        })
        .catch((err) => {
          if (err?.response?.status === 404) {
            setErrorText("ქალაქი არ მოიძებნა");
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [city]);

  const search = (event) => {
    if (event.key === "Enter" || event.which === 13) {
      if (event.target.value) {
        setCity(event.target.value);
      }
    } else if (event.type === "click") {
      setCity(inputValue);
    }
  };

  const inputChange = (event) => {
    if (errorText) {
      setErrorText("");
    }
    setInputValue(event.target.value);
  };

  return (
    <div className="App">
      <div className="header">
        <h1>The Best Weather App! ☀️</h1>
      </div>
      <div className="search-input">
        <input
          type="text"
          onKeyUp={search}
          onChange={inputChange}
          value={inputValue}
          placeholder="City"
          className="box-shadow-white"
        />
        {errorText && <span className="error-txt">{errorText}</span>}
        <div className="search-btn" onClick={search}>
          <img src="/search.png" alt="search" />
        </div>
      </div>
      {!loading && (
        <div className="weather-info box-shadow-white">
          {weather && (
            <>
              <p className="font-size-24 font-weight-bold">{weather.city}</p>
              <p className="font-size-64 font-weight-lighter"> {weather.temp.temp}&#176;</p>
              <p className="weatherType"> {weather.weatherType}</p>
              <p className="HighLowTemp">
               H:{weather.temp.temp_max}&#176; L:{weather.temp.temp_min}&#176;
              </p>
            </>
          )}
        </div>
      )}
      { loading && 
        <div className="loader">
          <div className="img">
            <img src="/clouds.png" />
          </div>
        </div>
      }
    </div>
  );
}

export default App;
