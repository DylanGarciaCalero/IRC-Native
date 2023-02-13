import { SafeAreaView, StyleSheet, Text, View, Image, Modal, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { db } from '../../../firebase';
import { auth } from '../../../firebase';
import { storage } from '../../../firebase';
import AntDesign from 'react-native-vector-icons/AntDesign'
import { Firestore, collection, getDoc, doc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { setStatusBarStyle } from 'expo-status-bar';
import defaultUserPicture from '../../../assets/user-icon.jpg';
import EditProfile from '../../components/EditProfile';

const Profile = (props) => {

    const [user, setUser] = useState({})
    const [url, setUrl] = useState()
    const [dataLoading, setDataLoading] = useState(true)
    const [profileEditModal, setprofileEditModal] = useState(false)
    const [username, setUserName] = useState('')
    const [firstname, setFirstName] = useState('')
    const [lastname, setLastName] = useState('')
    const [reload, setReload] = useState(false)

    useEffect(() => {
        getCurrentUserData()
        const getProfileImage = async () => {
            const profileImageRef = ref(storage, `users/${auth.currentUser.uid}/images/profile/profile.jpg`);
            await getDownloadURL(profileImageRef).then((item) => {
                setUrl(item);
                setTimeout(() => setDataLoading(false), 1000);
                console.log('executed get profile image in profile')
            })
        }
        getProfileImage();
    }, [reload]);

    const getCurrentUserData = async () => {
        const docRef = doc(db, "users", auth.currentUser.uid);
        console.log('executed get user data in profile')
        try {
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setUser(docSnap.data())
            } else {
                console.log("Document does not exist")
            }
        } catch(err) {
            console.log(err)
        }
    }

    const editProfile = async () => {
        const profileRef = doc(db, 'users', auth.currentUser.uid)
        const profileRefDoc = await getDoc(profileRef)
        if (profileRefDoc.exists()) {
            if (username !== '') {
                await updateDoc(profileRef, {
                    name: username
                })
            };
            if (firstname !== '') {
                await updateDoc(profileRef, {
                    firstname: firstname
                })
            };
            if (lastname !== '') {
                await updateDoc(profileRef, {
                    lastname: lastname
                })
            };
        } else {
            console.log('no document exists here yet')
        }
        setReload(!reload)
    }

    if(dataLoading)
    {
        return <Text>Loading</Text>
    } else {
        return (
            <View style={styles.mainContainer}>
                <View>
                    <View
                        style={{width: '100%', backgroundColor: '#0a1a35', padding: 30}}
                    >
                        <View
                            style={{position: 'relative', width: 100, flexDirection: 'row'}}
                        >
                            <Image 
                                source={{uri: url}}
                                style={{width: 100, height: 100, borderRadius: 50, borderColor: 'white', borderWidth: 2}}
                            />
                            <TouchableOpacity 
                                onPress={()=>props.navigation.navigate("UploadUserImage")}
                                style={{ position: 'absolute', bottom: 1, right:1}}>
                                <AntDesign name="edit" size={30} style={{backgroundColor: 'white', width: 30, height:30, borderRadius: 100, borderColor: 'white', borderWidth: 2}}/>
                            </TouchableOpacity>
                            <Text
                                style={{fontSize: 20, padding: 30, width: 300, color: 'white'}}
                            >
                                username: {user.name}
                            </Text>

                        </View>
                    </View>
                    <View style={styles.card}>
                        <View style={styles.circle}>
                            <AntDesign name='user' size={25} color="#0a1a35"/>
                        </View>
                        <View style={{ paddingHorizontal: 10 }}>
                            <Text style={{ color: '#0a1a35', fontWeight: 'bold' }}>username: {user.name}</Text>
                            <Text style={{ color: '#0a1a35', fontWeight: 'bold' }}>firstname: {user.firstname}</Text>
                            <Text style={{ color: '#0a1a35', fontWeight: 'bold' }}>lastname: {user.lastname}</Text>
                        </View>
                    </View>
                    <View style={styles.card}>
                        <View style={styles.circle}>
                            <AntDesign name='mail' size={25} color="#0a1a35"/>
                        </View>
                        <View style={{ paddingHorizontal: 10 }}>
                            <Text style={{ color: '#0a1a35' }}>Email</Text>
                            <Text style={{ color: '#0a1a35', fontWeight: 'bold' }}>{user?.email}</Text>
                        </View>
                    </View>
                </View>
                <EditProfile
                    profileEditModal={profileEditModal}
                    cancel={() => setprofileEditModal(false)}
                    username={username}
                    setUserName={setUserName}
                    firstName={firstname}
                    setFirstName={setFirstName}
                    lastName={lastname}
                    setLastName={setLastName}
                    next={() => {
                        //
                        editProfile()
                        setprofileEditModal(false);
                    }}
                />
                <TouchableOpacity
                    onPress={() => setprofileEditModal(true)}
                    style={styles.editProfileButton}>
                    <AntDesign name="edit" size={24} color="white" />
                </TouchableOpacity>
            </View>
        )
    }
}

export default Profile


const styles = StyleSheet.create({

    mainContainer: {
        width: '100%',
        height: '100%',
        flex:1,
        backgroundColor: 'white',
    },
    header: {
        width: '100%',
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 10,
    },
    subheader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 25,
        alignItems: 'center'
    },
    editbtn: {
        padding: 10,
        width: '30%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    circle: {
        backgroundColor: '#fff',
        height: 50,
        width: 50,
        borderRadius: 50 / 2,
        alignItems: 'center',
        justifyContent: 'center'
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        width: "50%",
        alignSelf: "center",
        marginTop: 20,
    },
    logoutbtn: {
        margin: 10,
        padding: 10,
        borderRadius: 3
    },
    editProfileButton: {
        padding: 12,
        borderRadius: 100,
        position: 'absolute',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 4,
        shadowRadius: 4,
        elevation: 20,
        bottom: 40, right: 36,
        backgroundColor: '#0a1a35'
    }

})