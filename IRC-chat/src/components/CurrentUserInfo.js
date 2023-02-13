import React, { useState, useEffect } from 'react'
import {
    Text, View, SafeAreaView, Image, ActivityIndicator,
    StyleSheet,
    Pressable, KeyboardAvoidingView, ScrollView, TextInput, TouchableOpacity
} from 'react-native'
import { auth, db } from '../../firebase'
import { doc, getDoc } from 'firebase/firestore'

const CurrentUserInfo = (props) => {

    const [user, setUser] = useState('')

    useEffect(() => {
        getCurrentUserData()
    }, [])

    const getCurrentUserData = async () => {
        if (props.user != '') {
            const docRef = doc(db, "users", props.user);
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
    }

    return (
        <Text style={{fontSize: props.fontsize, color: props.color, textAlign: 'right'}}>
            {props.text ? props.text : ''}{user ? user.name : ''}
        </Text>
    )
}

export default CurrentUserInfo


const styles = StyleSheet.create({
})