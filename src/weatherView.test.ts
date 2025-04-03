import { View } from './weatherView';
import { IWeatherObject } from './apis';

describe('View Class', () => {
  let view: View;
  let mockElement: HTMLElement;

  beforeEach(() => {
    mockElement = document.createElement('div');
    view = new View(mockElement);
  });

  it('should initialize the DOM structure correctly', () => {
    expect(mockElement.innerHTML).toContain('<div class="layer1">');
    expect(mockElement.querySelector('.input-for-city')).not.toBeNull();
    expect(mockElement.querySelector('.button-enter')).not.toBeNull();
    expect(mockElement.querySelector('.map-city')).not.toBeNull();
    expect(mockElement.querySelector('.history-city')).not.toBeNull();
  });

  it('addWeatherTemplate should replace placeholders correctly', () => {
    const template = '<div>{{city}}</div><div>{{temperature}}</div>';
    const weatherObject: IWeatherObject = {
      city: 'Moscow',
      temperature: 5,
      coordinates: ['54.23215', '33.3333'],
      icon: '2x',
    };

    const result = view.addWeatherTemplate(template, weatherObject);

    expect(result).toBe('<div>Moscow</div><div>5</div>');
  });

  it('addWeather should update layer3 with weather template', () => {
    const objectWeather: IWeatherObject = {
      city: 'Moscow',
      temperature: 5,
      coordinates: ['54.23215', '33.3333'],
      icon: '2x',
    };

    view.addWeatherTemplate = jest
      .fn()
      .mockReturnValue('<div>Moscow</div><div>5</div>');
    view.addWeather(objectWeather);

    expect(mockElement.querySelector('.layer3')!.innerHTML).toBe(
      '<div>Moscow</div><div>5</div>',
    );
  });

  it('updateMapLink should update map image source', () => {
    const coordinates = ['37.6173', '55.7558'];
    view.updateMapLink(coordinates);

    const img = mockElement.querySelector('.map-city') as HTMLImageElement;
    expect(img.src).toContain(
      'https://static-maps.yandex.ru/v1?lang=ru_RU&ll=37.6173,55.7558',
    );
  });

  it('renderHistoryList should render cities in history', () => {
    const cities = ['Moscow', 'Saint Petersburg', 'Kazan', 'Novosibirsk'];

    view.renderHistoryList(cities);

    const historyItems = mockElement.querySelectorAll('.li-history');
    expect(historyItems.length).toBe(cities.length);
    expect(historyItems[0].textContent).toBe('Moscow');
  });

  it('addOneCity should prepend a city and remove duplicates or excess items', () => {
    const cities = ['Moscow', 'Saint Petersburg'];

    view.renderHistoryList(cities);
    view.addOneCity('Kazan');

    const historyItems = mockElement.querySelectorAll('.li-history');
    expect(historyItems.length).toBe(3);
    expect(historyItems[0].textContent).toBe('Kazan');

    view.addOneCity('Saint Petersburg');

    const updatedHistoryItems = mockElement.querySelectorAll('.li-history');
    expect(updatedHistoryItems.length).toBe(3);
    expect(updatedHistoryItems[0].textContent).toBe('Saint Petersburg');
  });
});
