import React from 'react'
import {
  AppRegistry,
  StyleSheet,
  Text,
  SafeAreaView,
  FlatList,
  Platform,
  TouchableOpacity,
  Button
} from 'react-native'
import { BleManager, Device, BleError, LogLevel } from "react-native-ble-plx";


  type Props = {};

  type State = {
    text: Array<string>
  };

  function arrayBufferToHex(buffer) {
      if (!buffer) return null;
      const values = new Uint8Array(buffer);
      var string = "";
      for (var i = 0; i < values.length; i += 1) {
        const num = values[i].toString(16);
        string += num.length == 1 ? "0" + num : num;
      }
      return string;
  }


export default class Connection extends React.Component {

  constructor(props: Props) {
    super(props);
    this.state = {
      text: []
    };
    this.manager = new BleManager();
    this.initializeManager();

  }

  initializeManager() {
      this.manager = new BleManager({
          restoreStateIdentifier: 'testBleBackgroundMode',
          restoreStateFunction: bleRestoredState => {
              console.log(bleRestoredState, 'bleRestoredState')
          }
      });
      const subscription = this.manager.onStateChange((state) => {
        console.log('state', state)
          if (state === 'PoweredOn') {
              this.scanAndConnect();
          }
      }, true);
  }
/*
  componentDidMount() {
    const manager = new BleManager();
    manager.onStateChange(newState => {
      console.log('STATE: ', newState)
      if (newState != "PoweredOn") return;
      this._log("Started scanning...");
      manager.startDeviceScan(
        null,
        {
          allowDuplicates: true
        },
        (error, device) => {
          if (error) {
            this._logError("SCAN", error);
            return;
          }
          this._log("Device: " + device.name, device);
        }
      );
    }, true);
  }

  componentWillMount() {
      const subscription = this.manager.onStateChange((state) => {
          if (state === 'PoweredOn') {
              this.scanAndConnect();
              subscription.remove();
          }
      }, true);
  }*/

  _log = (text: string, ...args) => {
    const message = "[" + Date.now() % 10000 + "] " + text;
    this.setState({
      text: [message, ...this.state.text]
    });
  };

  _logError = (tag: string, error: BleError) => {
    this._log(
      tag +
        "ERROR(" +
        error.errorCode +
        "): " +
        error.message +
        "\nREASON: " +
        error.reason +
        " (att: " +
        error.attErrorCode +
        ", ios: " +
        error.iosErrorCode +
        ", and: " +
        error.androidErrorCode +
        ")"
    );
  };

  delay = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 5000);
    });
  };
  scanAndConnect() {
      this.manager.startDeviceScan(null, null, (error, device) => {
          if (error) {
              // Handle error (scanning will be stopped automatically)
              console.log('error', error);
              return
          }

          // Check if it is a device you are looking for based on advertisement data
          // or other criteria.
          console.log('device', device);
          if (device.name === 'TI BLE Sensor Tag' ||
              device.name === 'RNNav2') {

              // Stop scanning as it's not necessary if you are scanning for one device.
              this.manager.stopDeviceScan();

              // Proceed with connection.
          }
      });
  }
  render() {
    return (
      <SafeAreaView
        style={styles.container}
      >
        <Button
          onPress={() => {
            this.setState({
              text: []
            });
          }}
          title={"Clear"}
        />
        <Button
          onPress={() => {
            this.scanAndConnect();
          }}
          title={"Refresh"}
        />
        <FlatList
          style={styles.container}
          data={this.state.text}
          renderItem={({ item }) => <Text> {item} </Text>}
          keyExtractor={(item, index) => index.toString()}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    width: 350,
    height: 55,
    backgroundColor: '#42A5F5',
    margin: 10,
    padding: 8,
    color: 'white',
    borderRadius: 14,
    fontSize: 18,
    fontWeight: '500',
  },
  container: {
    flex: 1,
  }
})
