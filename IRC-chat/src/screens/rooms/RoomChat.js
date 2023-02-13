import { Dimensions, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator, FlatList, Modal } from 'react-native'
import React, { useEffect, useState } from 'react'

import { auth } from '../../../firebase'
import { db } from '../../../firebase'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useCollectionData } from 'react-firebase-hooks/firestore';
import moment from 'moment';
import Entypo from 'react-native-vector-icons/Entypo'
import Feather from 'react-native-vector-icons/Feather'
import CurrentUserInfo from '../../components/CurrentUserInfo';
import MapView from 'react-native-maps';
import * as Location from 'expo-location';
import { Marker } from 'react-native-maps';
import { setDoc, collection, getDocs, deleteDoc, doc, addDoc, getDoc, query, orderBy, limit } from 'firebase/firestore'
import Users from '../users/Users'

const width = Dimensions.get("window").width;
const height = Dimensions.get("screen").height;

const RoomChat = (props) => {

    const roomData = props.route.params.data

    const [messageList, setMessagesList] = useState([])
    const [message, setMessage] = useState('')
    const [mapLoading, setMapLoading] = useState(false)
    const [activeUserContainer, setActiveUsersContainer] = useState(false)
    const [value, loading, error] = useCollectionData(
        query(collection(db, 'roomchat', roomData.roomName.replace('#',''), 'messages'))
    )
    const [currentUsers, userLoading ,userError] = useCollectionData(
        query(collection(db, 'rooms', roomData.roomName.replace('#',''), 'activeusers'))
    )

    useEffect(() => {
    }, [value])

    const sendMessage = async () => {
        if (message != '') {
            const roomChatRef = doc(db, "roomchat", roomData.roomName.replace('#',''));
            const roomMessagesRef = collection(roomChatRef, 'messages');
            console.log('excecuted sendmessage roomchat');
            addDoc(roomMessagesRef, {
                message: message,
                senderId: auth.currentUser.uid,
                roomId: roomData.roomName.replace('#',''),
                id: auth.currentUser.uid,
                time: Date.now()
            })
            setMessage('')
        }
    }

    const LeftThechat = async () => {
        const roomChatRef = doc(db, "roomchat", roomData.roomName.replace('#',''));
        const roomMessagesRef = collection(roomChatRef, 'messages');
        console.log('NOTIFY USERS EXECUTED');
        addDoc(roomMessagesRef, {
            message: 'has left the chat!',
            senderId: auth.currentUser.uid,
            roomId: roomData.roomName.replace('#',''),
            time: Date.now()
        })
    }

    const deleteUserFromRoom = async () => {
        const activeUserRef = doc(db, 'rooms', roomData.roomName.replace('#',''), 'activeusers', auth.currentUser.uid)
        await deleteDoc(activeUserRef)
    }

    const sendLocation = async () => {
        setMapLoading(true);
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }
  
        let location = await Location.getCurrentPositionAsync({});
        const privateMessageRef = collection(db, 'roomchat', roomData.roomName.replace('#',''), 'messages');
        addDoc(privateMessageRef, {
            message: 'this is my location:',
            roomId: roomData.roomName.replace('#',''),
            senderId: auth.currentUser.uid,
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            time: Date.now(),
        })
        setMapLoading(false)
    }

    return (
        <View style={styles.mainContainer}>
            <View style={styles.headerProperties}>
                <TouchableOpacity
                    onPress={() => {
                        LeftThechat(),
                        deleteUserFromRoom(),
                        props.navigation.goBack()
                    }}>
                    <AntDesign
                        style={styles.headerIcon}
                        color={"black"}
                        name="arrowleft" size={20} />

                </TouchableOpacity>

                <View style={styles.header}>
                    <View style={styles.Profile}>
                        <TouchableOpacity style={{ marginLeft: 12 }}>
                            <Ionicons name="person" color={'black'} size={20} />
                        </TouchableOpacity>

                        <View style={{ marginStart: 8 }}>
                            <Text style={styles.UserName}>{roomData?.roomName}</Text>
                        </View>
                    </View>
                    <View style={{width: '60%', alignItems:'flex-end'}}>
                        <TouchableOpacity
                            onPress={() => {
                                setActiveUsersContainer(!activeUserContainer)
                            }}
                        >
                            <Feather name="users" color={'black'} size={20}/>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <View
                style={{ paddingBottom: 170, backgroundColor: '#fafafa', height: '100%'}}
            >
                <View
                    style={{
                        display: activeUserContainer ? 'flex' : 'none',
                        height: '100%',
                        width: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: 20,
                    }}
                >
                    <Text style={{fontSize: 20, textAlign: 'center', marginBottom: 20, paddingBottom:20 , borderBottomColor: 'black', borderBottomWidth: 1}}>
                        Users in this room: {currentUsers ? currentUsers.length : ''}
                    </Text>
                    <FlatList   
                            style={{backgroundColor: '#fafafa', width: '75%'}}
                            data={currentUsers}
                            keyExtractor={item => item.time}
                            renderItem={({ item }) => {

                                return (
                                    <>
                                        <Text>
                                            <CurrentUserInfo fontsize={16} color='darkblue' user={item.user}/>
                                        </Text>
                                    </>
                                )
                            }}
                    />
                </View>
                {
                    loading ?
                    <View style={{height: height, width: width, justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
                        {/* <AntDesign name='message1' size={80} style={{margin: 10}}/> */}
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
                                    
                                        {
                                            item.message == 'has joined the chat!' ?
                                            <View style={{ backgroundColor: '#f6f7f9', padding:10}}>
                                                <Text style={{ fontSize: 10, color: 'darkblue', textAlign: 'center'}}>{moment(item.time).fromNow()}</Text>
                                                <View style={{flexDirection: 'row'}}>
                                                    <CurrentUserInfo fontsize={10} color='darkblue' user={item.senderId}/>
                                                    <Text style={{fontSize: 10}}> {item.message}</Text>
                                                </View>
                                            </View>
                                            : item.message == 'has left the chat!' ?
                                                <View style={{ backgroundColor: '#f6f7f9', padding:10}}>
                                                    <Text style={{ fontSize: 10, color: 'darkblue', textAlign: 'center'}}>{moment(item.time).fromNow()}</Text>
                                                    <View style={{flexDirection: 'row'}}>
                                                        <CurrentUserInfo fontsize={10} color='darkblue' user={item.senderId}/>
                                                        <Text style={{fontSize: 10}}> {item.message}</Text>
                                                    </View>
                                                </View>
                                            :
                                            <TouchableOpacity
                                                onPress={() => props.navigation.navigate("PrivateChat", {data:item})}
                                            >
                                                <View style={{
                                                    backgroundColor: auth.currentUser.uid == item.senderId ? '#2457ca' :
                                                        '#efefef',
                                                    borderRadius: 10, padding: 14,
                                                    borderBottomLeftRadius: auth.currentUser.uid == item.senderId ? 10 : 0,
                                                    borderTopRightRadius: auth.currentUser.uid == item.senderId ? 0 : 10,
                                                }}>
                                                    <Text 
                                                        style={{ 
                                                        fontSize: 15, 
                                                        color: auth.currentUser.uid == item.senderId ? 'white' : 'black',
                                                    }}>
                                                        {item.message}
                                                    </Text>
                                                    <Text style={{ fontSize: 10, color: '#0a1a35', textAlign: auth.currentUser.uid == item.senderId ? 'right' : 'left'}}>{moment(item.time).fromNow()}</Text>
                                                    <CurrentUserInfo fontsize={10} color='#0a1a35' user={item.senderId}/>
                                                </View>
                                            </TouchableOpacity>
                                        }

                                    {
                                        item.latitude ? 
                                        <View pointerEvents='none' style={{padding: 4}}>
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
                                </View>
                                </>
                            );
                        }} 
                    />
                }
            </View>
            <View style={{
                width: '100%', position: 'absolute',
                bottom: 0, height: 70, padding: 12, backgroundColor: '#0a1a35', flexDirection: 'row'
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
                                size={20}
                                color={'lightskyblue'}
                            />
                            <Text style={{color: 'white'}}>
                                Location
                            </Text>
                        </TouchableOpacity>
                    }
                    
                </View>
            </View>
        </View>
    )
}

export default RoomChat

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
        backgroundColor: 'white',
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
    header: {
        width: '100%',
        flexDirection: 'row'
    },
    Profile: {
        flexDirection: 'row',
        width: '30%',
        marginBottom: 4,
        marginEnd: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    UserName: {
        fontSize: 18,
        marginLeft: 8,
        color: 'black',
    },
    searchSection: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 2,
        width: '70%',
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
        width: '80%',
        color: 'black',
    },
    showLocation: {
        width: '30%',
        textAlign: 'center',
        flexDirection: 'column-reverse',
        alignItems: 'center',
        justifyContent: 'center'
    }
})