
import React from 'react'
import { Modal, View, Image, Text, StyleSheet } from 'react-native';

const DeviceModal = (props) => (
  <Modal visible={ props.display }>
    <View>
      <Text style = { styles.text }>
        hello
      </Text>
    </View>
  </Modal>
)

const styles = StyleSheet.create({
  image: {
    marginTop: 20,
    marginLeft: 90,
    height: 200,
    width: 200
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 150
  },
    container: {
      marginTop: 300,
    }
  });
export default DeviceModal;
