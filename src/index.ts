import { View } from './weatherView';
import './style.css';
import { WeatherAPI } from './apis';
import { EventEmitter } from './EventEmitter';
const mainPageView = document.querySelector('.app') as HTMLElement;

const weather = new WeatherAPI('historyCities');
const appView = new View(mainPageView);

const eventEmitter = new EventEmitter<{
  loaded: void;
  showWeather: string;
  updateCityList: string;
  updateMap: string;
}>();

const input = document.querySelector('.input-for-city') as HTMLInputElement;
const cityBtn = document.querySelector('.button-enter') as HTMLButtonElement;

document.addEventListener('DOMContentLoaded', () => {
  eventEmitter.once('loaded', async () => {
    const firstLocation = await weather.getLocationInfo();
    if (
      typeof firstLocation === 'object' &&
      'city' in firstLocation &&
      'coordinates' in firstLocation
    ) {
      const firstCityWeather = await weather.getWeatherInfo(firstLocation.city);

      if (
        typeof firstCityWeather === 'object' &&
        'city' in firstCityWeather &&
        'temperature' in firstCityWeather
      ) {
        appView.addWeather(firstCityWeather);
      }
      appView.updateMapLink(firstLocation['coordinates']);
      const historyList = await weather.readCities();
      appView.renderHistoryList(historyList);
    } else {
      console.error('Invalid location data.');
    }
  });
  eventEmitter.trigger('loaded');
});

eventEmitter.on('showWeather', async (city?: string) => {
  if (!city) {
    console.error('City is undefined');
    return;
  }
  try {
    const cityWeather = await weather.getWeatherInfo(city);
    if (
      typeof cityWeather === 'object' &&
      'city' in cityWeather &&
      'temperature' in cityWeather
    ) {
      appView.addWeather(cityWeather);
    } else {
      console.error('No weather data found for city:', city);
    }
  } catch (error) {
    console.error('Error fetching weather info:', error);
  }
});

eventEmitter.on('updateCityList', (city?: string) => {
  if (city) {
    weather.createCity(city);
    appView.addOneCity(city);
  }
});

eventEmitter.on('updateMap', async (city?: string) => {
  if (!city) {
    console.error('City is undefined');
    return;
  }
  try {
    const cityWeather = await weather.getWeatherInfo(city);

    if (typeof cityWeather !== 'string' && cityWeather.coordinates) {
      appView.updateMapLink(cityWeather['coordinates']);
    } else {
      console.error('No coordinates data found for city:', city);
    }
  } catch (error) {
    console.error('Error fetching coordinates info:', error);
  }
});

cityBtn.addEventListener('click', () => {
  const city = (input as HTMLInputElement).value;
  if (city) {
    eventEmitter.trigger('showWeather', city);
    eventEmitter.trigger('updateCityList', city);
    eventEmitter.trigger('updateMap', city);
  } else console.log('City name cannot be empty');
  input.value = '';
});
