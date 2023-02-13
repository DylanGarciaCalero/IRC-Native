import { StyleSheet, Text, TouchableOpacity, View, Modal, TextInput } from 'react-native'
import React from 'react'
import CreateRoomImage from '../../components/CreateRoomImage'

const CreateRoom = (props) => {
    return (
        <View style={{ alignContent: 'center' }}>
            <Modal
                style={{ elevation: 4 }}
                transparent={true}
                animationType="slide"
                visible={props.createRoomModal}>
                <View style={styles.mainView}>
                    <View style={styles.insideView}>
                        <Text style={styles.addContainer}>Create Room</Text>

                        <TextInput
                            placeholder={"Roomname"}
                            onChangeText={(text) => {
                                props.setName(text)
                            }}
                            value={props.name}
                            keyboardType="default"
                            editable={true}
                            maxLength={30} 
                            style={styles.input}
                        />

                        <TouchableOpacity
                            onPress={props.cancel}
                            style={{
                                position: 'absolute', right: 0,
                                bottom: 0, marginRight: 120, marginBottom: 20
                            }}>
                            <Text style={{ fontSize: 14, color: "#757575" }}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={props.next}
                            style={{
                                position: 'absolute', right: 0,
                                bottom: 0, marginRight: 16, marginBottom: 20
                            }}>
                            <Text style={{ fontSize: 14, color: "black" }}>Go Next</Text>
                        </TouchableOpacity>

                    </View>
                </View>

            </Modal>
        </View>
    )
}
export default CreateRoom

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        elevation: 8,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'white',
    },
    insideView: {
        width: 300,
        height: 220, backgroundColor: "#fff",
        // justifyContent: 'center',
        elevation: 6,
    },
    addContainer: {
        fontSize: 20, color: "#757575",
        padding: 12
    },
    input:{
        backgroundColor: 'white',
        height: 45,
        margin: 15,
        padding: 10,
        borderRadius:4,
        borderColor:'black',
        borderWidth:1
    }
})