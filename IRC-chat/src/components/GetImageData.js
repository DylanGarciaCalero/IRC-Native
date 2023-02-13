import React, { useState, useEffect } from 'react'
import {
    Text, View, SafeAreaView, Image, ActivityIndicator,
    StyleSheet,
    Pressable, KeyboardAvoidingView, ScrollView, TextInput, TouchableOpacity
} from 'react-native'
import { auth, db, storage } from '../../firebase'
import { doc, getDoc } from 'firebase/firestore'
import { getDownloadURL, getStorage, ref } from "firebase/storage";

const GetImageData = (props) => {

    const [url, setUrl] = useState()

    useEffect(() => {

        const getProfileImage = async () => {
            console.log(props.user)
            const profileImageRef = ref(storage, `${props.collection}/${props.file}/images/${props.type}/profile.jpg`);
            await getDownloadURL(profileImageRef).then((item) => {
                setUrl(item);
                console.log('executed get profile image on userspage')
            })
        }
        getProfileImage();
    }, []);

    return (
        <Image 
            source={{uri: url}}
            style={{width: 50, height: 50, borderRadius:100}}
        />
    )
}

export default GetImageData


const styles = StyleSheet.create({
})