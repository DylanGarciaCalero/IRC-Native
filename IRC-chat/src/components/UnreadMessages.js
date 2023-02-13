import React, { useState, useEffect, useContext } from 'react'
import {
    Text, View, SafeAreaView, Image, ActivityIndicator,
    StyleSheet,
    Pressable, KeyboardAvoidingView, ScrollView, TextInput, TouchableOpacity
} from 'react-native'
import { auth, db } from '../../firebase'
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore'

const UnreadMessages = (props) => {

    const [unreadMessages, setUnreadMessages] = useState(0)

    useEffect(() => {
        getUnreadMessages([])
    }, [])

    const getUnreadMessages = async () => {
        const q = query(collection(db, "privatechat", auth.currentUser.uid, "correspondants", props.user, "messages"), where("read" , '==', false))
        const querySnapShot = await getDocs(q);
        let array = []
        querySnapShot.forEach((doc) => {
            let data = doc.data();
            if (data.receiverUser == auth.currentUser.uid) {
                array.push(data);
                console.log("THE UNREAD MESSAGES", data)
            }
        })
        setUnreadMessages(array.length)
    }
    return (
        <View style={{height:20, width:20, marginRight: 20,
            backgroundColor: unreadMessages > 0 ? "red" : "lightblue", color: "white", borderRadius: 100, position: "absolute", top: "50%", right: 0 }}>
            <Text style={{ textAlign: "center", color: "white"}}>
                {unreadMessages? unreadMessages : ''}
            </Text>
        </View>
    )
}

export default UnreadMessages


const styles = StyleSheet.create({
})