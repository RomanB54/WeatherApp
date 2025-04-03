export interface IWeatherObject {
  city: string;
  temperature: number;
  coordinates: string[];
  icon: string;
}

export interface ILocationObject {
  city: string;
  coordinates: string[];
}

export interface IStorage {
  createCity: (value: string) => Promise<void>;
  readCities: () => Promise<string[] | []>;
}

export interface IWeatherAPI {
  getWeatherInfo: (
    city: IWeatherObject['city'],
  ) => Promise<IWeatherObject | string>;
  getLocationInfo: () => Promise<ILocationObject | string>;
}

export class WeatherAPI implements IStorage, IWeatherAPI {
  private storeID: string = 'historyCities';
  private localStorage = localStorage;
  constructor(dataDB: string) {
    this.storeID = dataDB;
  }
  async readCities() {
    const tempData = this.localStorage.getItem(this.storeID);
    if (tempData) {
      return JSON.parse(tempData);
    } else {
      return [];
    }
  }

  async createCity(value: string) {
    const tempArr: string[] = await this.readCities();
    if (tempArr.includes(value)) {
      tempArr.splice(tempArr.indexOf(value), 1);
      tempArr.unshift(value);
    } else {
      tempArr.push(value);
    }
    this.localStorage.setItem(this.storeID, JSON.stringify(tempArr));
  }

  async getLocationInfo(): Promise<ILocationObject | string> {
    try {
      const response = await fetch(
        'https://ipinfo.io/json?token=7ce0407bb7be70',
      );
      const jsonResponse = await response.json();
      if (jsonResponse && jsonResponse.city && jsonResponse.loc) {
        const splittedCoord = jsonResponse.loc.split(',');
        const locationObject: ILocationObject = {
          city: jsonResponse['city'],
          coordinates: [splittedCoord[1], splittedCoord[0]],
        };
        return locationObject;
      } else {
        return 'Failed to get location';
      }
    } catch (e) {
      console.log('Failed to get location', e);
      return 'Failed to get location';
    }
  }

  async getWeatherInfo(
    city: string,
  ): Promise<IWeatherObject | 'Unknown information'> {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=50e9562e52bdc95310309ebf4c74c77c&units=metric&lang=en`,
      );
      const data = await response.json();

      if (
        data &&
        data.cod === 200 &&
        data.name &&
        data.main.temp &&
        data.coord &&
        data.weather[0].icon
      ) {
        const weatherObject: IWeatherObject = {
          city: data.name,
          temperature: Math.round(data.main.temp),
          coordinates: [data.coord.lon, data.coord.lat],
          icon: data.weather[0].icon,
        };
        return weatherObject;
      } else {
        return 'Unknown information';
      }
    } catch (e) {
      console.log('Failed to get weather information', e);
      return 'Unknown information';
    }
  }
}
