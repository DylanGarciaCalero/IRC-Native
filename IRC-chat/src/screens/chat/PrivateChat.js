import { Dimensions, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, FlatList, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getDocs, collection, onSnapshot, getDoc, setDoc , doc, query, arrayUnion, updateDoc, addDoc, where } from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import moment from 'moment';
import * as Location from 'expo-location';
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import CurrentUserInfo from '../../components/CurrentUserInfo';
import AudioRecording from '../../components/AudioRecording';
import GetAudioReplay from '../../components/GetAudioReplay';

import Ionicons from 'react-native-vector-icons/Ionicons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { auth } from '../../../firebase';
import { db } from '../../../firebase';

const width = Dimensions.get("window").width;
const height = Dimensions.get("screen").height;

const PrivateChat = (props) => {

    const receiverUser = props.route.params.data
    const receiverUserId = receiverUser.id

    const [message, setMessage] = useState('')
    const [mapLoading, setMapLoading] = useState(false)
    const [recordingContainer, setRecordingContainer] = useState(false)

    const [value, loading, error] = useCollectionData(
        query(collection(db, 'privatechat', auth.currentUser.uid, 'correspondants', receiverUserId, 'messages'))
    )

    useEffect(() => {
        messagesGetter();
    }, [value])

    const sendLocation = async () => {
        setMapLoading(true);
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }
  
        let location = await Location.getCurrentPositionAsync({});
        const privateMessageRef = collection(db, 'privatechat', auth.currentUser.uid, 'correspondants', receiverUserId, 'messages');
        addDoc(privateMessageRef, {
            message: 'this is my location:',
            receiverUser: receiverUser.id,
            senderId: auth.currentUser.uid,
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            time: Date.now(),
            read: true,
        }).then(() => {
            const privateMessageRecRef = collection(db, 'privatechat', receiverUser.id, 'correspondants', auth.currentUser.uid, 'messages');
            addDoc(privateMessageRecRef, {
                message: 'this is my location:',
                receiverUser: receiverUser.id,
                senderId: auth.currentUser.uid,
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                time: Date.now(),
                read: false,
            })
        })
        setMapLoading(false)
    }

    const messagesGetter = async () => {
        const messageUpdateRef = query(collection(db, 'privatechat', auth.currentUser.uid, 'correspondants', receiverUserId, 'messages'), where("read", "==", false))
        const updateSnap = await getDocs(messageUpdateRef)
        updateSnap.forEach(item => {
            setMessagesAsRead(item.id);
        })
    }

    const sendMessage = () => {
        console.log('executed PC sendmesssage')
        if (message != '') {
            const privateMessageRef = collection(db, 'privatechat', auth.currentUser.uid, 'correspondants', receiverUserId, 'messages');
            addDoc(privateMessageRef, {
                message: message,
                receiverUser: receiverUser.id,
                senderId: auth.currentUser.uid,
                time: Date.now(),
                read: true,
            }).then(() => {
                const privateMessageRecRef = collection(db, 'privatechat', receiverUser.id, 'correspondants', auth.currentUser.uid, 'messages');
                addDoc(privateMessageRecRef, {
                    message: message,
                    receiverUser: receiverUser.id,
                    senderId: auth.currentUser.uid,
                    time: Date.now(),
                    read: false,
                })
            })
            setMessage('');
        }
    }

    const setMessagesAsRead = async (docToUpdate) => {
        console.log('executed PC setAsRead')
        const documentRef = doc(db, 'privatechat', auth.currentUser.uid, 'correspondants', receiverUser.id, 'messages', docToUpdate);
        await updateDoc(documentRef, {
            read: true
        })
    }

    return (
        <View style={styles.mainContainer}>
            <View style={styles.headerProperties}>

                <TouchableOpacity
                    onPress={() => props.navigation.goBack()}>
                    <AntDesign
                        style={styles.headerIcon}
                        color={"#0a1a35"}
                        name="arrowleft" size={20} />
                </TouchableOpacity>

                <View style={styles.header}>
                    <View style={styles.Profile}>
                        <TouchableOpacity style={{ marginLeft: 12 }}>
                            <Ionicons name="person" color={'#0a1a35'} size={20} />
                        </TouchableOpacity>

                        <View style={{ marginStart: 8 }}>
                            <CurrentUserInfo style={styles.UserName} fontsize={18} user={receiverUserId} color="black"/>
                        </View>
                    </View>
                </View>
            </View>
            <View
                style={{ paddingBottom: 170, backgroundColor: '#fafafa', height: '100%'}}
            >
                {
                    loading ?
                    <View style={{height: height, width: width, justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
                        <AntDesign name='message1' size={80} style={{margin: 10}}/>
                        <Text style={{margin: 10}}>Loading messages</Text>
                        <ActivityIndicator size="large" color="black" style={{margin: 10}}/>
                    </View>
                    :
                    <FlatList   
                        style={{backgroundColor: '#fafafa'}}
                        inverted
                        data={value ? value.sort((a, b) => new Date(b.time) - new Date(a.time)) : ''}
                        keyExtractor={item => item.time}   
                        renderItem={({ item }) =>
                        {
                            return (
                                <>
                                <View
                                    style={{
                                        maxWidth: width, height: 'auto',
                                        alignSelf: auth.currentUser.uid == item.senderId ?
                                            "flex-end" : "flex-start", margin: 10
                                    }}
                                >
                                    <View style={{
                                        backgroundColor: auth.currentUser.uid == item.senderId ? '#2457ca' :
                                            '#efefef',
                                        borderRadius: 10, padding: 14,
                                        borderBottomLeftRadius: auth.currentUser.uid == item.senderId ? 10 : 0,
                                        borderTopRightRadius: auth.currentUser.uid == item.senderId ? 0 : 10,
                                    }}>
                                        <Text style={{ 
                                            fontSize: 15, 
                                            color: auth.currentUser.uid == item.senderId ? 'white' : 'black',
                                        }}>{item.message}</Text>
                                        {
                                            item.file == 'audio' ? <GetAudioReplay user={item.senderId} fileRef={item.referenceId}/> : ''
                                        }
                                    </View>
                                    {
                                        item.latitude ? 
                                        <View pointerEvents='none'>
                                            <MapView style={styles.map} 
                                                region={{
                                                    latitude: item.latitude,
                                                    longitude: item.longitude,
                                                    latitudeDelta: 0.01,
                                                    longitudeDelta: 0.01,
                                                }}
                                            >
                                                <Marker
                                                    coordinate={{ latitude : item.latitude , longitude : item.longitude }}
                                                />
                                            </MapView>
                                        </View> : ''
                                    }
                                    <Text style={{ fontSize: 10, color: 'gray', textAlign: auth.currentUser.uid == item.senderId ? 'right' : 'left'}}>{moment(item.time).fromNow()}</Text>
                                    <CurrentUserInfo color='#0a1a35' user={item.senderId}/>
                                </View>
                                </>
                            );
                        }} 
                    />
                }
                <View style={{
                    display: recordingContainer ? 'flex' : 'none',
                    width: '100%',
                    padding: 10,
                    backgroundColor: '#0a1a35',
                    borderBottomColor: "white",
                    borderBottomWidth: 2,
                }}>
                    <AudioRecording receiver={receiverUserId}/>
                </View>
            </View>
            
            <View style={{
                width: '100%', position: 'absolute',
                bottom: 0, height: 70, padding: 12, backgroundColor: '#0a1a35', flexDirection: 'row', justifyContent:"center"
            }}>
                <View style={styles.searchSection}>
                    <TextInput
                        style={styles.input}
                        placeholder="Write Message"
                        placeholderTextColor="black"
                        value={message}
                        multiline={true}
                        onChangeText={(text) => setMessage(text)}
                        underlineColorAndroid='transparent'
                        maxLength={100}
                    />

                    <TouchableOpacity
                        onPress={() => sendMessage()}>
                        <Ionicons
                            style={styles.searchIcon}
                            name='send'
                            size={20}
                            color={'lightskyblue'}
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.showLocation}>
                    {
                        mapLoading ? 
                        <ActivityIndicator size="large" color="white" />
                        :
                        <TouchableOpacity
                            onPress={() => sendLocation()}>
                            <Ionicons
                                style={styles.searchIcon}
                                name='location'
                                size={34}
                                color={'lightskyblue'}
                            />
                        </TouchableOpacity>
                    }
                </View>
                <View style={styles.recordAudio}>
                    <TouchableOpacity
                        onPress={() => setRecordingContainer(!recordingContainer)}
                    >
                        <Ionicons name="mic" color={'lightskyblue'} size={38} />
                    </TouchableOpacity>
                </View>
            </View>

        </View>
    )
}

export default PrivateChat

const styles = StyleSheet.create({
    map: {
        width: 300,
        height: 180,
        borderRadius: 30,
    },
    mainContainer: {
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: '#fff',
    },
    headerProperties: {
        padding: 16,
        flexDirection: 'row',
        height: 60,
        marginTop: 40,
        alignItems: 'center',
        backgroundColor: 'white',
        color: 'black',
    },
    Profile: {
        flexDirection: 'row',
        marginBottom: 4,
        marginEnd: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    UserName: {
        fontSize: 18,
        marginLeft: 8,
        color: '#0a1a35',
    },
    searchSection: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 2,
        width: '60%',
        backgroundColor: 'white',
    },
    searchIcon: {
        padding: 1,
        textAlign: 'center',
    },
    input: {
        paddingTop: 10,
        paddingRight: 10,
        marginLeft: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        height: 40,
        width: '70%',
        color: 'black',
    },
    showLocation: {
        width: '15%',
        textAlign: 'center',
        flexDirection: 'column-reverse',
        alignItems: 'center',
        justifyContent: 'center'
    },
    recordAudio: {
        width: '15%',
        textAlign: 'center',
        flexDirection: 'column-reverse',
        alignItems: 'center',
        justifyContent: 'center'
    }
})