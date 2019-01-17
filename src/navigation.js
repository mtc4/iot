import { Navigation } from 'react-native-navigation'

export const goToAuth = () => Navigation.setRoot({
  root: {
    bottomTabs: {
      id: 'BottomTabsId',
      children: [
        {
          component: {
            name: 'Devices',
            options: {
              bottomTab: {
                fontSize: 12,
                text: 'Devices',
                icon: require('./images/home.png'),
                badge: '0',
                testID: 'bottomTabTestID',
                fontFamily: 'Helvetica',
              }
            }
          },
        },
        {
          component: {
            name: 'Connection',
            options: {
              bottomTab: {
                text: 'Connection',
                fontSize: 12,
                icon: require('./images/connect.png')
              }
            }
          },
        },
      ],
    },
  }
});

export const goHome = () => Navigation.setRoot({
  root: {
    stack: {
      id: 'App',
      children: [
        {
          component: {
            name: 'Home',
          }
        }
    ],
    }
  }
})
