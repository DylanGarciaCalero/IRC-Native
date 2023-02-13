import { StyleSheet, Text, TouchableOpacity, View, Modal, TextInput } from 'react-native'
import React from 'react'

const EditProfile = (props) => {
    return (
        <View style={{ alignContent: 'center' }}>
            <Modal
                style={{ elevation: 4 }}
                transparent={true}
                animationType="slide"
                visible={props.profileEditModal}>
                <View style={styles.mainView}>
                    <View style={styles.insideView}>
                        <Text style={styles.addContainer}>Edit your profile</Text>

                        <TextInput
                            placeholder={"new username"}
                            onChangeText={(text) => {
                                props.setUserName(text)
                            }}
                            value={props.username}
                            keyboardType="default"
                            editable={true}
                            maxLength={30} 
                            style={styles.input}
                        />
                        <TextInput
                            placeholder={"new firstname"}
                            onChangeText={(text) => {
                                props.setFirstName(text)
                            }}
                            value={props.firstname}
                            keyboardType="default"
                            editable={true}
                            maxLength={30} 
                            style={styles.input}
                        />
                        <TextInput
                            placeholder={"new lastname"}
                            onChangeText={(text) => {
                                props.setLastName(text)
                            }}
                            value={props.lastname}
                            keyboardType="default"
                            editable={true}
                            maxLength={30} 
                            style={styles.input}
                        />

                        <TouchableOpacity
                            onPress={props.cancel}
                            style={{
                                position: 'absolute', right: 0,
                                bottom: 0, marginRight: 80, marginBottom: 20
                            }}>
                            <Text style={{ fontSize: 14, color: "#757575" }}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={props.next}
                            style={{
                                position: 'absolute', right: 0,
                                bottom: 0, marginRight: 16, marginBottom: 20
                            }}>
                            <Text style={{ fontSize: 14, color: "black" }}>Edit</Text>
                        </TouchableOpacity>

                    </View>
                </View>

            </Modal>
        </View>
    )
}
export default EditProfile

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
        height: 360, backgroundColor: "#fff",
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