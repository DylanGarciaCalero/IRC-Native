import React, { useState, useEffect } from 'react'
import {
    Text, View, SafeAreaView, Image, ActivityIndicator,
    StyleSheet,
    Pressable, KeyboardAvoidingView, ScrollView, TextInput, TouchableOpacity
} from 'react-native'
import { signInWithEmailAndPassword } from 'firebase/auth'

import { auth } from '../../../firebase'

const Login = (props) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')
    const [loading, setloading] = useState(false)

    ///Checkers
    const [passwordHide, setPasswordHide] = useState(true)

    ///Errors
    const [emailError, setemailError] = useState('')
    const [passwordError, setpasswordError] = useState('')
    const [loginError, setLoginError] = useState('')

    useEffect(() => {
    }, [])

    const validator = async () => {

        if (email == "") {
            setemailError('Email is Required')
        }
        else if (password == "") {
            setpasswordError('Password is Required')
        }
        else {
            login()
        }
    }

    const login = async () => {
        setloading(true)
        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                props.navigation.replace("Home")
            }).catch((err) => {
                setLoginError('Incorrect email or password')
                setloading(false)
            })
    }

    return (
        <SafeAreaView style={styles.container}>

                    <Text style={{fontSize: 20, paddingHorizontal: 15 }}>{`Login`}</Text>

                    <View style={{ padding: 10 }}>
                        <TextInput
                            placeholder={'Email'}
                            value={email}
                            placeholderTextColor="black"
                            style={styles.textInput}
                            keyboardType="email-address"
                            onChangeText={(text) => {
                                setEmail(text)
                                setemailError("")
                            }}

                        />
                        {emailError != "" ?
                            <Text style={{ color: 'red', marginLeft: 15, marginTop: 5 }}>{emailError}</Text>
                            : null}

                        <TextInput
                            placeholder={'Password'}
                            value={password}
                            multiline={false}
                            placeholderTextColor="black"
                            style={styles.textInput}
                            secureTextEntry={passwordHide}
                            onChangeText={(text) => {
                                setPassword(text);
                                setpasswordError('')
                            }}
                        />

                        {passwordError != "" ?
                            <Text style={{ color: 'red', marginLeft: 15, marginTop: 5 }}>{passwordError}</Text>
                            : null}
                        {loginError != "" ?
                            <Text style={{ color: 'red', marginLeft: 15, marginTop: 5 }}>{loginError}</Text>
                            : null}

                    </View>

                    <View
                        style={styles.buttonContainer}
                    >
                        {
                            loading ? <ActivityIndicator size={'large'} /> :

                                <TouchableOpacity
                                    onPress={() => validator()}
                                >
                                    <Text style={{color: "white"}}>Login</Text>
                                </TouchableOpacity>
                        }
                    </View>

                    <Text style={{ color: 'black', alignSelf: 'center' }}>OR</Text>

                    <View style={{ alignItems: 'center', paddingVertical: 25 }}>
                        <Pressable
                            onPress={() => props.navigation.navigate('SignUp')}
                        >
                            <Text style={{ color: 'black' }}>Don't Have an Account? <Text style={{ color: '#1878F3', fontWeight: 'bold', textDecorationLine: 'underline' }}>Sign Up</Text></Text>
                        </Pressable>
                    </View>
        </SafeAreaView >
    )
}

export default Login


const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
        width: '100%',
        justifyContent: 'center',
    },
    fbBtn: {
        backgroundColor: '#1878F3',
        width: '60%',
        padding: 15,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10,
        borderRadius: 6,
        flexDirection: 'row',
    },
    googleBtn: {
        margin: 10,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        width: '60%',
        padding: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        flexDirection: 'row',
        elevation: 5,
    },
    textInput:{
        backgroundColor: 'white',
        height: 45,
        margin: 5,
        borderRadius:4,
        paddingLeft: 8,
    },
    buttonContainer: {
        backgroundColor: '#0a1a35',
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        height: 40,
        width: "90%",
        alignSelf: "center",
        marginBottom: 10,
    }
})