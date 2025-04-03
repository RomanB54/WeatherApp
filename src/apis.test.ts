import { WeatherAPI } from './apis';

describe('WeatherAPI', () => {
  let weatherAPI: WeatherAPI;

  beforeEach(() => {
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {});
    

    weatherAPI = new WeatherAPI('historyCities');
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('createCity', () => {
    it('should add a city to localStorage', async () => {
      const mockCities = ['Novosibirsk'];
      (localStorage.getItem as jest.Mock).mockReturnValueOnce(JSON.stringify(mockCities));

      await weatherAPI.createCity('Moscow');

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'historyCities',
        JSON.stringify(['Novosibirsk','Moscow'])
      );
    });

    it('should move an existing city to the top of the list', async () => {
      const mockCities = ['Moscow', 'Novosibirsk'];
      (localStorage.getItem as jest.Mock).mockReturnValue(JSON.stringify(mockCities));

      await weatherAPI.createCity('Novosibirsk');

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'historyCities',
        JSON.stringify(['Novosibirsk', 'Moscow'])
      );
    });
  });

  describe('readCities', () => {
    it('should return cities from localStorage', async () => {
      const mockCities = ['Moscow', 'Novosibirsk'];
      (localStorage.getItem as jest.Mock).mockReturnValue(JSON.stringify(mockCities));

      const cities = await weatherAPI.readCities();

      expect(cities).toEqual(mockCities);
    });

    it('should return an empty array if no cities are stored', async () => {
      (localStorage.getItem as jest.Mock).mockReturnValue(null);

      const cities = await weatherAPI.readCities();

      expect(cities).toEqual([]);
    });
  });

  describe('getLocationInfo', () => {
    it('should return location info when API call succeeds', async () => {
      const mockResponse = {
        city: 'Moscow',
        loc: '51.5074,-0.1278',
      };
      global.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve(mockResponse),
        } as Response)
      );

      const locationInfo = await weatherAPI.getLocationInfo();

      expect(locationInfo).toEqual({
        city: 'Moscow',
        coordinates: ['-0.1278', '51.5074'],
      });
    });

    it('should return an error message when API call fails', async () => {
      global.fetch = jest.fn(() => Promise.reject(new Error('Failed')));

      const locationInfo = await weatherAPI.getLocationInfo();

      expect(locationInfo).toBe('Failed to get location');
    });
  });

  describe('getWeatherInfo', () => {
    it('should return weather info when API call succeeds', async () => {
      const mockResponse = {
        cod: 200,
        name: 'Moscow',
        main: { temp: 15 },
        coord: { lon: -0.1278, lat: 51.5074 },
        weather: [{ icon: 'icon_url' }],
      };
      global.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve(mockResponse),
        } as Response)
      );

      const weatherInfo = await weatherAPI.getWeatherInfo('Moscow');

      expect(weatherInfo).toEqual({
        city: 'Moscow',
        temperature: 15,
        coordinates: [-0.1278, 51.5074],
        icon: 'icon_url',
      });
    });

    it('should return an error message for invalid city names', async () => {
      const mockResponse = { cod: 404 };
      global.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve(mockResponse),
        } as Response)
      );

      const weatherInfo = await weatherAPI.getWeatherInfo('InvalidCity');

      expect(weatherInfo).toBe('Unknown information');
    });
  });
});