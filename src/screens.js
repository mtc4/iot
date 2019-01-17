import {Navigation} from 'react-native-navigation';

export function registerScreens() {
  Navigation.registerComponent('Home', () => require('./Home').default);
  Navigation.registerComponent('Initializing', (sc) => require('./Initializing').default);
  Navigation.registerComponent('Connection', () => require('./Connection').default);
  Navigation.registerComponent('Devices', () => require('./Devices').default);
  Navigation.registerComponent('Screen2', () => require('./Screen2').default);
}
