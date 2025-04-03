import { IWeatherObject } from './apis';
import weatherBlock from './weatherBlockTemplate.html';

interface IView {
  addWeatherTemplate: (template: string, object: IWeatherObject) => string;
  updateMapLink: (coordinates: string[], place: HTMLImageElement) => void;
  renderHistoryList: (cities: string[]) => void;
  addOneCity: (city: string) => void;
}

export class View implements IView {
  private el: HTMLElement;
  constructor(el: HTMLElement) {
    this.el = el;
    el.innerHTML = `<div class="layer1">
            <div class="layer2">
                <input class="input-for-city" placeholder="Enter a city name...">
                <button class="button-enter">Submit</button><br></br>
                <img class="map-city" src=''/>
            </div>
            <div class="layer3">
            </div>
            <div class="layer4">
                <p class="show-weather">History</p>
                <ul class="history-city">
                </ul>
            </div>
        </div>`;
  }

  addWeatherTemplate(template: string, object: IWeatherObject): string {
    const pattern = /\{\{(\w+)}}/gm;
    template = template.replace(pattern, (match, key) => {
      if (key in object) {
        return object[key as keyof IWeatherObject].toString();
      } else {
        return '';
      }
    });
    return template;
  }

  addWeather(objectWeather: IWeatherObject) {
    this.el.querySelector('.layer3')!.innerHTML = this.addWeatherTemplate(
      weatherBlock,
      objectWeather,
    );
  }

  updateMapLink(coordinates: string[]) {
    const imageSource = this.el.querySelector('.map-city') as HTMLImageElement;
    imageSource.src = `https://static-maps.yandex.ru/v1?lang=ru_RU&ll=${coordinates}&spn=0.3,0.3&size=400,400&apikey=e091f93b-1d71-4a7d-ae59-8369de3754d8`;
  }

  renderHistoryList(cities: string[]) {
    if (cities) {
      for (let i = 0; i < cities.length && i <= 9; i++) {
        const cityName = cities[i];
        this.el.querySelector('.history-city')!.innerHTML +=
          `<li class='li-history'>${cityName}</li>`;
      }
    }
  }

  addOneCity(city: string) {
    const arrayHistoryCities = this.el.querySelectorAll('.li-history');
    for (let i = 0; i < arrayHistoryCities.length; i++) {
      if (arrayHistoryCities[i].innerHTML === city) {
        this.el.querySelectorAll('.li-history')[i].remove();
      }
    }

    if (this.el.querySelectorAll('.li-history').length == 10) {
      this.el.querySelectorAll('.li-history')[9].remove();
    }

    const li = document.createElement('li');
    li.innerHTML = city;
    li.className = 'li-history';
    this.el.querySelector('.history-city')!.prepend(li);
  }
}
