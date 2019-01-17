import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Modal,
  ListView,
  FlatList,
  TouchableOpacity,
  TouchableHighlight,
  Animated,
  Image,
  RefreshControl,
  AsyncStorage
} from 'react-native'

class ListItem extends React.PureComponent {
  _onPress = () => {
    this.props.onPressItem(this.props.id);
  };


  render() {
    const textColor = this.props.status ? styles.activeBox : styles.inactiveBox;
    if (this.props.name == "Add") {
      return (
        <TouchableOpacity onPress={this._onPress}>
          <View style={styles.activeBox}>
            <Text style={styles.textSmall}>
              Dodaj
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
            <Image
              style={{width: 50, height: 50, alignSelf: 'center', marginTop: 10 }}
              source={require('./images/plus.png')}
            />
            </View>
          </View>
        </TouchableOpacity>
      );
    } else {
      const status = this.props.status === 0 ? <Text style={styles.statusOffline}>OFF</Text> : <Text style={styles.statusOnline}>ON</Text>;
    return (
      <TouchableOpacity onPress={this._onPress}>
        <View style={textColor}>
          <Text style={styles.text}>
            {this.props.name}
          </Text>
          <Text>
            {this.props.location}
          </Text>
          { status }
        </View>
      </TouchableOpacity>
    );
  }
  }
}


const styles = StyleSheet.create({
  activeBox: {
    borderRadius: 10,
    padding: 25,
    margin: 10,
    width: 150,
    flex: 1,
    height: 150,
    opacity: 0.95,
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    backgroundColor: 'white'
  },
  inactiveBox: {
    borderRadius: 10,
    margin: 10,
    padding: 25,
    width: 150,
    flex: 1,
    height: 150,
    opacity: 0.90,
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    backgroundColor: '#e5e6e1'
  },
  box: {
    borderWidth: 1,
    borderRadius: 5,
    margin: 10,
    padding: 25,
    width: 150,
    flex: 1,
    height: 150,
    flexWrap: 'wrap',
    justifyContent: 'center',
    borderStyle: 'dashed',
    borderColor: 'red'
  },
  text: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
    alignItems: 'center',
    justifyContent: 'center'
  },
  textSmall: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    alignItems: 'center',
    justifyContent: 'center'
  },
  statusOffline: {
    position: 'absolute',
    bottom: 15,
    right: 20,
    backgroundColor: 'red',
    color: 'white',
    padding: 7,
    borderRadius: 10,
    overflow: "hidden",
    alignSelf: 'flex-end'
  },
  statusOnline: {
    position: 'absolute',
    bottom: 15,
    right: 20,
    backgroundColor: 'green',
    color: 'white',
    padding: 7,
    borderRadius: 10,
    overflow: "hidden",
    alignSelf: 'flex-end'
  }
})

export default ListItem;
