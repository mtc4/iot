/** @format */

import {Navigation} from 'react-native-navigation';
import {registerScreens} from './src/screens';
import App from './App';

registerScreens();

//Navigation.registerComponent(`Initializing`, () => App);

Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setRoot({
    root: {
      component: {
        name: 'Initializing'
      }
    },
  });
});
