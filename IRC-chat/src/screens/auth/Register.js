import React, { useState } from 'react'
import {
    View, Text, SafeAreaView, Image, TextInput, StyleSheet,
    KeyboardAvoidingView, ScrollView, Alert, Linking, ToastAndroid, TouchableOpacity
} from 'react-native'

import { auth } from '../../../firebase';
import { db } from '../../../firebase';
import { storage } from '../../../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Firestore, doc, setDoc, addDoc, collection} from 'firebase/firestore';
import defaultUserPicture from '../../../assets/user-icon.jpg';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const Signup = (props) => {

    const [userName, setuserName] = useState('')
    const [firstName, setfirstName] = useState('')
    const [lastName, setlastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    ////Error States
    const [userNameError, setuserNameError] = useState('')
    const [emailError, setemailError] = useState('')
    const [passwordError, setpasswordError] = useState('')
    const [confirmPasswordError, setconfirmPasswordError] = useState('')

    ///Checkers
    const [passwordHide, setPasswordHide] = useState(true)
    const [termsChecker, settermsChecker] = useState(false)
    const [privacyChecker, setprivacyChecker] = useState(false)
    const [buttonLoader, setbuttonLoader] = useState(false)


    const validator = async () => {

        if (userName == "") {
            setuserNameError('User Name is Required')
        }

        else if (email == "") {
            setemailError('Email is Required')
        }
        else if (password == "") {
            setpasswordError('Password is Required')
        }
        else if (confirmPassword == "") {
            setConfirmPassword('Confirm Password is Required')
        }

        else if (confirmPassword != password) {
            setconfirmPasswordError('Password Not Matched')
        }
        else {
            createUser()
        }
    }

    const createUser = async () => {
        setbuttonLoader(true)
        createUserWithEmailAndPassword(auth, email, password)
            .then(() => {
                saveData()
            }).catch((err) => {
                setbuttonLoader(false)
                alert(err.message)
            })
    }

    const saveData = async () => {
        let user = auth.currentUser;
        if (user) {
            await setDoc(doc(db, "users", user.uid), {
                    id: user.uid,
                    name: userName,
                    email: email,
                    firstname: firstName,
                    lastname: lastName,
                })
                .then(() => {
                    ToastAndroid.show('Registered Successfully', ToastAndroid.LONG)
                    setbuttonLoader(false)
                    props.navigation.replace("UploadUserImage")

                }).catch((err) => {
                    Alert.alert(err)
                    setbuttonLoader(false)
                })
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.container}>
                <View
                    style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15 }}
                >
                    <Text style={{fontSize: 20, fontWeight: 'bold' }}>Sign Up</Text>
                </View>
                
                <Text style={{ paddingHorizontal: 15, fontSize: 17 }}>Create new Account</Text>
                
                <View style={{ padding: 10 }}>
                    <TextInput
                        placeholder={'User Name'}
                        value={userName}
                        onChangeText={(text) => {
                            setuserName(text)
                            setuserNameError("")
                        }}
                        style={styles.textInput}
                    />

                    <TextInput
                        placeholder={'First Name'}
                        value={firstName}
                        onChangeText={(text) => {
                            setfirstName(text)
                        }}
                        style={styles.textInput}
                    />

                    <TextInput
                        placeholder={'Last Name'}
                        value={lastName}
                        onChangeText={(text) => {
                            setlastName(text)
                        }}
                        style={styles.textInput}
                    />

                    {userNameError != "" ?
                        <Text style={{ color: 'red', marginLeft: 15, marginTop: 5 }}>{userNameError}</Text>
                        : null}


                    <TextInput
                        placeholder={'Email'}
                        value={email}
                        onChangeText={(text) => {
                            setEmail(text)
                            setemailError("")
                        }}
                        keyboardType={'email-address'}
                        style={styles.textInput}
                    />

                    {emailError != "" ?
                        <Text style={{ color: 'red', marginLeft: 15, marginTop: 5 }}>{emailError}</Text>
                        : null}

                    <TextInput
                        placeholder={'Password'}
                        value={password}
                        secureTextEntry={passwordHide}
                        onChangeText={(text) => {
                            setPassword(text);
                            setpasswordError('')
                        }}
                        style={styles.textInput}
                    />

                    {passwordError != "" ?
                        <Text style={{ color: 'red', marginLeft: 15, marginTop: 5 }}>{passwordError}</Text>
                        : null}

                    <TextInput
                        placeholder={'Confirm Password'}
                        onChangeText={(text) => {
                            setConfirmPassword(text)
                            setconfirmPasswordError("")
                        }}
                        secureTextEntry={passwordHide}
                        style={styles.textInput}
                    />

                    {confirmPasswordError != "" ?
                        <Text style={{ color: 'red', marginLeft: 15, marginTop: 5 }}>{confirmPasswordError}</Text>
                        : null}

                </View>
                <View
                    style={{ margin: 8 }}
                >
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        onPress={() => validator()}
                        buttonLoader={buttonLoader}
                    >
                        <Text style={{color:"white"}}>Register</Text>
                    </TouchableOpacity>
                </View>
                </View>
            </ScrollView>
            <View style={{ alignItems: 'center', paddingVertical: 25 }}>
                <TouchableOpacity
                    onPress={() => props.navigation.navigate('Login')}
                >
                    <Text style={{ color: 'black' }}>Already have an account? <Text style={{ color: '#1878F3', fontWeight: 'bold', textDecorationLine: 'underline' }}>Log in</Text></Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default Signup

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'center'
    },
    textInput: {
        backgroundColor: 'white',
        height: 45,
        margin: 5,
        borderRadius: 4,
        paddingLeft: 8
    },
    buttonContainer: {
        backgroundColor: '#0a1a35',
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        height: 40,
    }
})
