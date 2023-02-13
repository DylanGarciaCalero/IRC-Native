import { SafeAreaView, StyleSheet, Text, View, Image, Modal, TextInput, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { auth } from '../../../firebase'
import { getAuth, updateEmail, updatePassword } from 'firebase/auth'
import Feather from 'react-native-vector-icons/Feather'

const Settings = (props) => {

    const [updatedEmail, setUpdatedEmail] = useState('')
    const [updatedPassword, setUpdatedPassword] = useState('')
    const [updatedVPassword, setUpdatedVPassword] = useState('')
    const [emailError, setEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [emailVisible, setEmailVisible] = useState(false)
    const [passwordVisible, setPasswordVisible] = useState(false)

    useEffect(() => {
       
    }, []);

    const emailValidator = async () => {
        if (updatedEmail == '') {
            setEmailError("Email is required")
        } else {
            setNewEmail()
        }
    }
    
    const passwordValidator = async () => {
        if (updatedPassword == '') {
            setPasswordError("Password is required")
        } else if (updatedPassword !== updatedVPassword) {
            setPasswordError("Passwords must match")
        } else {
            setNewPassword()
        }
    }

    const setNewEmail = () => {
        updateEmail(auth.currentUser, updatedEmail).then(() => {
            auth.signOut().then(
                props.navigation.reset({
                    index: 0,
                    routes: [{ name: "Login" }],
                })
            )
        }).catch((error) => {
            console.log(error.message)
            setEmailError(error.message)
        })
    }

    const setNewPassword = () => {
        updatePassword(auth.currentUser, updatedPassword).then(() => {
            auth.signOut().then(
                props.navigation.reset({
                    index: 0,
                    routes: [{ name: "Login" }],
                })
            )
          }).catch((error) => {
            console.log(error.message)
            setPasswordError(error.message)
          });
    }
   
    return (
        <SafeAreaView style={styles.container}>
            <View style={{ padding: 10 }}>
                <Text style={{fontSize: 20, marginTop: 10, fontWeight: '600'}}><Feather name="user" size={18}/>  Authentication</Text>
                <TouchableOpacity
                    onPress={() => setEmailVisible(!emailVisible)}>
                    <Text style={styles.changeHeader}>Change emailAdress</Text>
                </TouchableOpacity>
                <View style={{ display: emailVisible ? 'flex' : 'none', flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                    <TextInput
                        placeholder={'New emailaddress'}
                        value={updatedEmail}
                        placeholderTextColor="black"
                        style={styles.textInput}
                        onChangeText={(text) => {
                            setUpdatedEmail(text)
                        }}
                    />
                    <TouchableOpacity
                        style={{backgroundColor: "#0a1a35", padding: 8}}
                        onPress={() => emailValidator()}
                    >
                        <Text style={{color: "white"}}>Submit</Text>
                    </TouchableOpacity>
                </View>
                
                {emailError != "" ?
                    <Text style={{ color: 'red', marginLeft: 15, marginTop: 5 }}>{emailError}</Text>
                    : null}

                <Text>After changing your emailaddress you will be logged out.</Text>
                <TouchableOpacity
                    onPress={() => setPasswordVisible(!passwordVisible)}>
                    <Text style={styles.changeHeader}>Change Password</Text>
                </TouchableOpacity>
                <View style={{ display: passwordVisible ? 'flex' : 'none', flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                    <TextInput
                        placeholder={'New password'}
                        value={updatedPassword}
                        placeholderTextColor="black"
                        style={styles.textInput}
                        secureTextEntry={true}
                        onChangeText={(text) => {
                            setUpdatedPassword(text)
                        }}
                    />
                </View>
                <View style={{ display: passwordVisible ? 'flex' : 'none', flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                    <TextInput
                        placeholder={'Password verification'}
                        value={updatedVPassword}
                        placeholderTextColor="black"
                        style={styles.textInput}
                        secureTextEntry={true}
                        onChangeText={(text) => {
                            setUpdatedVPassword(text)
                        }}
                    />
                    <TouchableOpacity
                        style={{backgroundColor: "#0a1a35", padding: 8}}
                        onPress={() => passwordValidator()}
                    >
                        <Text style={{color:"white"}}>Submit</Text>
                    </TouchableOpacity>
                </View>
                {passwordError != "" ?
                    <Text style={{ color: 'red', marginLeft: 15, marginTop: 5 }}>{passwordError}</Text>
                    : null}
                <Text style={{display: passwordVisible ? 'none' : 'flex'}}>After changing your emailaddress you will be logged out.</Text>
            </View>
        </SafeAreaView >
    )
}

export default Settings


const styles = StyleSheet.create({
    container: {
        width: "80%",
        alignSelf: "center"
    },
    textInput: {
        backgroundColor: "white",
        paddingVertical: 5,
        paddingHorizontal: 20,
        paddingLeft: 10,
        width: "70%",
        marginBottom: 4,
    },
    changeHeader: {
        fontWeight: '500',
        marginBottom: 10,
        marginTop: 20,
        borderBottomColor: "#0a1a35",
        borderBottomWidth: 2,
    }
})