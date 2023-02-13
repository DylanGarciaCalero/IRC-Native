import { SafeAreaView, StyleSheet, Text, View, Image, Modal, TextInput, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection, getDocs, limit, query, orderBy, getDoc, doc, } from "firebase/firestore"
import { auth, db } from '../../firebase'

const GetLastMessage = (props) => {
    const [message, setMessage] = useState({})

    const data = props.data;
    useEffect(() => {  
        getMessage(data)
    }, []);

    const getMessage = async (data) => {
        const querySnapshot = await getDocs(collection(db, "roomchat", data, "messages"))
        const messagesRef = collection(db, "roomchat", data, "messages")
        const q = query(messagesRef, orderBy("time"), limit(1))
        const msgdata = await getDocs(q)
        msgdata.forEach((doc) => {
            let response = doc.data();
            setMessage({
                message: response.message,
                senderid: response.senderId
            })
        })
    }
   
    return (
        <Text>Last Message:</Text>
    )
}

export default GetLastMessage


const styles = StyleSheet.create({

})