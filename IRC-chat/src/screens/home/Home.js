import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import React from 'react'
import { auth } from '../../../firebase'
import { db } from '../../../firebase'
import { updateDoc, doc } from 'firebase/firestore'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Feather from 'react-native-vector-icons/Feather'
import Fontisto from 'react-native-vector-icons/Fontisto'
import Logo from '../../../assets/icons8-chat-100.png'

const Home = (props) => {

    const setOnline = () => {
        const docRef = doc(db, "users", auth.currentUser.uid);
        const data = {
            isOnline: true,
        };
        updateDoc(docRef, data)
    }

    const setOffline = async (user) => {
        const docRef = doc(db, "users", user);
        const data = {
            isOnline: false,
        };
        await updateDoc(docRef, data);
        auth.signOut().then(
            props.navigation.reset({
                index: 0,
                routes: [{ name: "Login" }],
            })
        )
    }

    setOnline()
    
    return (
        <View style={styles.mainContainer}>
            <View style={styles.buttonContainer}>
                <View style={styles.mainButton}>
                    <TouchableOpacity 
                        onPress={()=>props.navigation.navigate("Users")}
                        >
                        <Feather name="users" size={40} color="white"/>
                        <Text style={styles.buttonText}>Users</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.mainButton}>
                    <TouchableOpacity 
                    onPress={()=>props.navigation.navigate("Rooms")}
                    >
                        <Fontisto name="room" size={40} color="white"/>
                        <Text style={styles.buttonText}>Rooms</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={{flex: 1, justifyContent: "center", alignItems:"center", width: "50%", alignSelf: "center"}}>
                <Text>Welcome to IRC-CHAT</Text>
                <Image style={{marginVertical: 20}} source={Logo}/>
                <Text>Hier kan je allerhande connecties aangaan met je vrienden!</Text>
            </View>

            <View style={styles.headerContainer}>
                <TouchableOpacity 
                onPress={()=>props.navigation.navigate("Profile")}
                style={styles.button}>
                    <Feather name="user" size={30} color="white"/>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        setOffline(auth.currentUser.uid)
                    }}
                    style={styles.button}>
                    <MaterialIcons name="logout" size={30} color="white"/>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => props.navigation.navigate("Settings")}
                >
                    <Feather name="settings" size={30} color="white"/>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default Home

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        position: "absolute",
        bottom: 0,
        left: 0,
    },
    button: {
        marginHorizontal: 10,
    },
    buttonText: {
        fontSize: 16,
        color: "white",
    },
    headerContainer: {
        width: "100%",
        marginTop: 50,
        height: 60,
        backgroundColor: "#0a1a35",
        position: "absolute",
        justifyContent: "flex-end",
        padding: 14,
        flexDirection: "row",
        top: 0,
        left: 0
    },
    mainButton: {
        width: "50%",
        height: 100,
        backgroundColor: "#0a1a35",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    }
})