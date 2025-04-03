import { View } from './weatherView';
import './style.css';
import { WeatherAPI } from './apis';

const mainPageView = document.querySelector('.app') as HTMLElement;

new WeatherAPI('historyCities');
new View(mainPageView);
