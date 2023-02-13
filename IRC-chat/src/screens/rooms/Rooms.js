import { StyleSheet, Text, View, TouchableOpacity, ToastAndroid, FlatList, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign'
import CreateRoom from './CreateRoom'
import { doc, getDocs, setDoc, collection, query, addDoc } from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import CurrentUserInfo from '../../components/CurrentUserInfo';
import CreateRoomImage from '../../components/CreateRoomImage';
import { auth, db, storage } from '../../../firebase'
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import * as ImagePicker from 'expo-image-picker';
import GetImageData from '../../components/GetImageData';
import FavoRoom from '../../components/FavoRoom'
import * as Battery from 'expo-battery'
import GetLastMessage from '../../components/GetLastMessage';

const Rooms = (props) => {

    const [roomModal, setRoomModal] = useState(false)
    const [roomImageModal, setRoomImageModal] = useState(false)
    const [roomName, setroomName] = useState('')
    const [imgUrl, setImgUrl] = useState()
    const [roomNameError, setRoomNameError] = useState('')
    const [loadingData, setLoadingData] = useState(0)
    const [roomsQuery, setRoomsQuery] = useState('#')
    const [batteryLife, setBatteryLife] = useState(false)
    const [value, loading, error] = useCollectionData(
        query(collection(db, 'rooms'))
    )

    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted'){
                    alert('Sorry, we need camera roll permissions to make this work!');
                }
            }
            const currentBatteryLife = await Battery.getBatteryLevelAsync();
            if (currentBatteryLife < 0.1) {
                setBatteryLife(true);
            }
        })();
    }, [roomModal])

    const saveRoom = async () => {
        if (roomName != '') {
            await setDoc(doc(db, "rooms", roomName),{
                ownerId: auth.currentUser.uid,
                roomName: '#'+roomName,
                timeStamp: Date.now()
            })
            setRoomImageModal(false)
            setLoadingData(0)
            ToastAndroid.show("Rooms Addedd", ToastAndroid.LONG); 
        } else {
            setRoomNameError('roomname cannot be empty')
        }
    }

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
    
        if (!result.cancelled) {
            setLoadingData(1)
            const docRef = ref(storage, `rooms/${roomName}/images/roomprofile/profile.jpg`);
            try {
                const img = await fetch(result.uri);
                const bytes = await img.blob();
                await uploadBytes(docRef, bytes);
                setLoadingData(2)
            } catch (err) {
                console.log(err)
            }
        }
    }

    const addUserToRoom = async (room) => {
        const activeUsersRef = doc(db, 'rooms', room, 'activeusers', auth.currentUser.uid)
        setDoc(activeUsersRef, {
            time: Date.now(),
            user: auth.currentUser.uid
        })

        const roomChatRef = doc(db, "roomchat", room);
        const roomMessagesRef = collection(roomChatRef, 'messages');
        console.log('NOTIFY USERS EXECUTED');
        addDoc(roomMessagesRef, {
            message: 'has joined the chat!',
            senderId: auth.currentUser.uid,
            roomId: room,
            time: Date.now()
        })
    }

    return (
        <View style={styles.mainContainer}>
            <View 
                style={styles.searchRooms}
            >
                <Text style={styles.searchTitle}>Search for Room</Text>
                <TextInput
                    style={styles.searchInput}
                    placeholder={"roomName"}
                    onChangeText={(text) => {
                        setRoomsQuery(text)
                    }}
                    value={roomsQuery}
                    keyboardType="default"
                    editable={true}
                    maxLength={30} 
                />
            </View>
            {
                !loading ?
                <FlatList
                    data={
                        value.filter(function(item){return item.roomName.includes(roomsQuery)})
                    }
                    keyExtractor={(item) => item.roomName}
                    renderItem={({ item }) =>
                        <>
                        { item.hidden ? 
                            <View>{ batteryLife ? 
                            <View
                                style={{flexDirection: 'row', alignItems: 'center', padding:10, backgroundColor: 'lightblue', marginBottom:3}}
                            >
                                <GetImageData collection="rooms" file={item.roomName.replace('#','')} type="roomprofile"/>
                                <TouchableOpacity
                                    onPress={() => {
                                        addUserToRoom(item.roomName.replace('#',''))
                                        props.navigation.navigate("RoomChat", { data: item })
                                    }}
                                    style={styles.cardMainContainer}>
                                    <Text style={styles.cardText}>{item.roomName}</Text>
                                    { item.ownerId ? <CurrentUserInfo fontsize={10} color="#0a1a35" user={item.ownerId} text="created by: "/> : ''}
                                </TouchableOpacity>
                                <FavoRoom room={item.roomName.replace('#','')}/>
                            </View> : <></> }
                            </View> : 
                            <View style={{padding:10, backgroundColor: 'lightblue', marginBottom:3}}>
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <GetImageData collection="rooms" file={item.roomName.replace('#','')} type="roomprofile"/>
                                    <TouchableOpacity
                                        onPress={() => {
                                            addUserToRoom(item.roomName.replace('#',''))
                                            props.navigation.navigate("RoomChat", { data: item })
                                        }}
                                        style={styles.cardMainContainer}>
                                    <Text style={styles.cardText}>{item.roomName}</Text>
                                    { item.ownerId ? <CurrentUserInfo fontsize={10} color="#0a1a35" user={item.ownerId} text="created by: "/> : ''}
                                    </TouchableOpacity>
                                    <FavoRoom room={item.roomName.replace('#','')}/>
                                </View>
                                <GetLastMessage data={item.roomName.replace('#','')}/>
                            </View>}
                        </>
                    }
                />
                :
                <Text>Loading Rooms..</Text>
            }

            <TouchableOpacity
                onPress={() => setRoomModal(true)}
                style={styles.createRoomButton}>
                <AntDesign name="plus" size={24} color="white" />
            </TouchableOpacity>
            <Text>
                {roomNameError != '' ? roomNameError : ''}
            </Text>
            <View>
                <CreateRoom
                    createRoomModal={roomModal}
                    cancel={() => setRoomModal(false)}
                    name={roomName}
                    setName={setroomName}
                    next={() => {
                        setRoomModal(false);
                        setRoomImageModal(true)
                    }}
                />
            </View>
            <View>
                <CreateRoomImage
                    createRoomImageModal={roomImageModal}
                    cancel={() => {
                        setRoomImageModal(false)
                        setLoadingData(0)
                    }}
                    setName={setroomName}
                    add ={() => pickImage()}
                    save={() => {
                        saveRoom()
                        setRoomImageModal(false)
                    }}
                    loadingData={loadingData}
                />
            </View>
        </View>
    )
}

export default Rooms

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: 32, marginRight: 32,
        marginTop: 16
    },
    button: {
        height: 100, width: '45%',
        borderRadius: 16, justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8, marginRight: 8,

    },
    buttonText: {
        color: 'white',
        fontSize: 16
    },
    createRoomButton: {
        padding: 12,
        borderRadius: 100,
        position: 'absolute',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 4,
        shadowRadius: 4,
        elevation: 20,
        bottom: 40, right: 36,
        backgroundColor: '#0a1a35'
    },
    cardMainContainer: {
        padding: 10,
        borderRadius: 8,
        textAlign: 'left',
        width: 220,
    },
    cardText: {
        fontSize: 16,
        fontWeight: '700',
        textAlign: 'right',
        color: '#0a1a35'
    },
    searchRooms: {
        width: '100%',
        textAlign: 'center',
        backgroundColor: '#0a1a35',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItem: 'center',
        padding: 10,
        marginBottom: 4,
    },
    searchInput: {
        padding: 6,
        borderColor: 'white',
        borderWidth: 2,
        borderRadius: 10,
        paddingLeft: 15,
        color: 'white',
        width: '50%',
        alignSelf: 'center'
    },
    searchTitle: {
        color: 'white',
        padding: 20,
    }
})