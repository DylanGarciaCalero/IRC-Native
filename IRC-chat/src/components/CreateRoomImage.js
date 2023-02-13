import React, { useState, useEffect } from 'react'
import {
    Text, View, SafeAreaView, Image, ActivityIndicator,
    StyleSheet, Modal,
    Pressable, KeyboardAvoidingView, ScrollView, TextInput, TouchableOpacity
} from 'react-native'

const CreateRoomImage = (props) => {

    return (
        <View style={{ alignContent: 'center' }}>
            <Modal
                style={{ elevation: 4 }}
                transparent={true}
                animationType="slide"
                visible={props.createRoomImageModal}>
                <View style={styles.mainView}>
                    <View style={styles.insideView}>
                        <Text style={styles.addContainer}>What is a room without an image?!</Text>

                        <TouchableOpacity
                            onPress={props.cancel}
                            style={{
                                position: 'absolute', right: 0,
                                bottom: 0, marginRight: 120, marginBottom: 20
                            }}>
                            <Text style={{ fontSize: 14, color: "#757575" }}>Cancel</Text>
                        </TouchableOpacity>

                        <View>
                            {(props.loadingData == 1) ? 
                            <Text>Loading..</Text> : 
                            (props.loadingData == 0) ? 
                            <TouchableOpacity
                                onPress={props.add}
                                style={styles.input}>
                                <Text style={{ fontSize: 14, color: "black" }}>Pick Your Image</Text>
                            </TouchableOpacity>
                            : (props.loadingData == 2) ? 
                            <Text>Image uploaded!</Text> : 
                            <Text></Text>} 
                        </View>

                        <TouchableOpacity
                            onPress={props.save}
                            style={{
                                position: 'absolute', right: 0,
                                bottom: 0, marginRight: 16, marginBottom: 20
                            }}>
                            <Text style={{ fontSize: 14, color: "black" }}>Create Room</Text>
                        </TouchableOpacity>

                    </View>
                </View>

            </Modal>
        </View>
    )
}

export default CreateRoomImage

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
    }
})