import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Dimensions,
  Button,
  Modal,
  ListView,
  ScrollView,
  Image,
  FlatList,
  ActivityIndicator,
  TouchableHighlight,
  ImageBackground,
  RefreshControl,
  TouchableOpacity,
  Animated,
  AsyncStorage
} from 'react-native'

var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height

import {Navigation} from 'react-native-navigation';
import { goHome } from './navigation'
import { USER_KEY } from './config'
import DeviceModal from './DeviceModal';
import ListItem from './ListItem';
import { DevicesSchema, DEVICES_SCHEMA, databaseOptions } from "./database/schemas";
const Realm = require('realm');
const uuid = require('react-native-uuid');
var realm;

export default class Devices extends React.Component{

  constructor() {
    super();
    this.state = {
      dataSource: [{id: "99", name: "Add", location:  "none", status: 0, color: "fg"}] ,
      modalVisible: false,
      display: false,
      active: 0,
      name: '',
      location: '',
      command: ''
    };
    realm = new Realm(databaseOptions);
    console.log("Realm db path:", realm.path);
  }

  /**
   *  Pobiera i zwraca listę urządzeń z bazy
   *
   * @method getDevices
   * @return {Array} lista obiektów Realm DB
   */
  getDevices = async () => {
    console.log("Pobieram urządzenia...");
    return await Realm.open(databaseOptions)
      .then(realm => {
        let devices = realm.objects(DEVICES_SCHEMA);
        console.log("Pobrano: " + devices.length);
        let active = 0;
        devices.forEach(device => {
          console.log(`Załadowano urządzenie ${device.name} ze statusem ${device.status}.`);
          if (device.status) { active++; }
        });
        Navigation.mergeOptions(this.props.componentId, {
          bottomTab: {
            badge: active.toString()
          },
        });
        return devices;
      })
      .catch(error => {
        return error;
      });
  };

  componentWillMount = () => {
    Realm.open(databaseOptions).then(realm => {
      console.log(realm)

      console.log("Łączenie z bazą...");
      this.setState({ size: realm.objects(DEVICES_SCHEMA).length });
      this.getDevices().then(data => {
        this.setState({ dataSource: data });
      });
    });
  };

  /**
   * Aktualizacja stanu urządzenia
   *
   * @method _onPressItem
   * @param {String} id elementu
   */
  _onPressItem = async (id: string) => {

    var devices = realm.objects(DEVICES_SCHEMA), status = 0, active = 0;
    realm.write(() => {
      devices.forEach(device => {
        if (device.id === id) {
          status = !device.status ? 1 : 0;
          device.status = status;
          console.log(`Zmieniam status urządzenia ${device.name} na ${device.status}.`)
        }
        if (device.status === 1) active++;
    });
  });
  await this.setState((state) => {
    return {active};
  });
  Navigation.mergeOptions(this.props.componentId, {
    bottomTab: {
      badge: active.toString()
    },
  });
    /*
    await this.setState((state) => {
      return {selected, active};
    });

    Navigation.mergeOptions(this.props.componentId, {
      bottomTab: {
        badge: active.toString()
      },
    });*/
  };

  toggleModal = (visible) => this.setState({ modalVisible: visible });

  _keyExtractor = (item, index) => item.id;

  _onOpenModal = async () => this.toggleModal(true);

  // Renderuje widok dla urządzenia
  _renderItem = ({item}) => (
    <ListItem
    id={item.id}
    onPressItem={this._onPressItem}
    location={item.location}
    status={item.status}
    name={item.name}
    />
  );

  addDevice() {
    let obj = {
      id: uuid.v1(),
      name: this.state.name,
      location: this.state.location,
      command: this.state.command,
      status: 0,
      color: '0'
    }
    realm.write(() => {
      console.log("Probuje dodac urzadzenie ", obj.name);
      if (realm.objects(DEVICES_SCHEMA).filtered("name == $0", obj.name).length !=0) {
        console.log(`Urzadzenie o nazwie ${obj.name} istnieje juz w bazie.`);
        return;
      }

      realm.create("Devices", obj);
      console.log(`Dodano urzadzenie ${obj.name} do bazy!`);
      this.toggleModal(!this.state.modalVisible);
    });
  }


  render() {

    if (!this.state.dataSource) {
    return (
      <ActivityIndicator
        animating={true}
        style={styles.indicator}
        size="large"
      />
    );
  }

  return (
       <View>
        <Modal animationType = {"slide"} transparent = {false}
          visible = {this.state.modalVisible}
          onRequestClose = {() => { console.log("Modal has been closed.") } }>

          <View style = {styles.modal}>
            <View style={styles.headingModal}>
              <Text style={styles.headingTextBlack}>Add Device</Text>
            </View>

            <TextInput
              style={styles.input}
              onChangeText={(text) => { this.setState({ name: text }); }}
              placeholder={this.state.name}
            />

            <TextInput
              style={styles.input}
              onChangeText={(text) => { this.setState({ location: text }); }}
              placeholder={this.state.location}
            />

            <TextInput
              style={styles.input}
              onChangeText={(text) => { this.setState({ command: text }); }}
              placeholder={this.state.command}
            />


            <View style={{ flexDirection:'row' }}>

              <TouchableOpacity
                style = {styles.submitButton}
                onPress = {() => {
                this.toggleModal(!this.state.modalVisible)}}>
                <Text style = {styles.submitButtonText}> Cancel </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style = {styles.submitButton}
                onPress = {
                  () => this.addDevice()
                }
              >

              <Text style = {styles.submitButtonText}> Save </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>


      <ImageBackground source={require('./images/HueBackground.png')}     blurRadius={2}
style={{width: '100%', height: '100%'}}>
<ScrollView contentContainerStyle={styles.scroll}>

        <View style={styles.heading}>
          <Text style={styles.headingText}>Devices</Text>
        </View>

        <View style={styles.status}>
          <Text style={styles.descText}>Wszystkich urządzeń {this.state.dataSource.length}</Text>
        </View>


          <FlatList
            horizontal={false}
            numColumns={2}
            ref="flatlist"
            showsVerticalScrollIndicator={false}
            snapToInterval={Dimensions.get('window').width / 5}
            snapToAlignment={'center'}
            data={this.state.dataSource}
            extraData={this.state}
            keyExtractor={this._keyExtractor}
            renderItem={this._renderItem}
          />


        </ScrollView>
        <View style={{flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center', width}}>
        <TouchableOpacity onPress={this._onOpenModal}>
          <View style={styles.smallOption}>
            <Text style={styles.textSmall}>
              Dodaj
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', position: 'relative', justifyContent: 'center'}}>
            <Image
              style={{width: 35, height: 35, alignSelf: 'center', marginTop: 5 }}
              source={require('./images/plus.png')}
            />
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={this._onOpenModal}>
          <View style={styles.smallOption}>
            <Text style={styles.textSmall}>
              Usuń
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', position: 'relative', justifyContent: 'center'}}>
            <Image
              style={{width: 35, height: 35, alignSelf: 'center', marginTop: 5 }}
              source={require('./images/minus.png')}
            />
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={this._onOpenModal}>
          <View style={styles.smallOption}>
            <Text style={styles.textSmall}>
              Edytuj
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', position: 'relative', justifyContent: 'center'}}>
            <Image
              style={{width: 35, height: 35, alignSelf: 'center', marginTop: 5 }}
              source={require('./images/edit.png')}
            />
            </View>
          </View>
        </TouchableOpacity>
      </View>

      </ImageBackground>
    </View>
     )
  }
}

const styles = StyleSheet.create({
  box: {
    borderRadius: 2,
    paddingLeft:30,
    paddingRight:30,
    textShadowColor:'#585858',
    textShadowOffset:{width: 5, height: 5},
    textShadowRadius:10,
  },
  headingModal: {
    marginTop: height/4,
    justifyContent: 'center',
    alignSelf: 'center'
  },
  heading: {
    marginTop: 5,
    alignSelf: 'flex-start'
  },
  textSmall: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    alignItems: 'center',
    justifyContent: 'center'
  },
  scroll: {
    flex: 1,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center'
  },
  status: {
    marginLeft: 10,
    alignSelf: 'flex-start',
    marginBottom: 20
  },
  descText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18
  },
  headingText: {
    fontSize: 40,
    fontWeight: 'bold',
    marginLeft: 10,
    color: 'white'
  },
  headingTextBlack: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'black'
  },
  container: {
    flex: 1,
     flexWrap:'wrap',
  },
  modal: {
   flex: 1,
   alignItems: 'center',
   backgroundColor: 'white',
 },
 modalText: {
   color: 'white'
 },
 input: {
    margin: 15,
    height: 40,
    width: 300,
    borderColor: '#7a42f4',
    borderWidth: 1,
    paddingLeft: 20,
    borderRadius: 20
 },
 selected: {
   borderRadius: 10,
   padding: 25,
   margin: 10,
   width: 150,
   height: 150,
   opacity: 0.95,
   justifyContent: 'flex-start',
   backgroundColor: 'white'
 },
 smallOption: {
   borderRadius: 10,
   padding: 15,
   margin: 10,
   width: 100,
   height: 100,
   opacity: 0.95,
   justifyContent: 'flex-start',
   backgroundColor: 'white'
 },
 submitButton: {
    backgroundColor: '#7a42f4',
    padding: 10,
    margin: 15,
    height: 40,
 },
 submitButtonText:{
   marginLeft: 10,
   marginRight: 10,
    color: 'white'
 },
 indicator: {
   flex: 1,
   alignItems: "center",
   justifyContent: "center",
   height: 80
 },
})
