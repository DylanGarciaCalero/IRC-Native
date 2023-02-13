import React, { useState, useEffect } from 'react'
import {
    Text, View, SafeAreaView, Image, ActivityIndicator,
    StyleSheet,
    Pressable, KeyboardAvoidingView, ScrollView, TextInput, TouchableOpacity
} from 'react-native'
import { auth, db } from '../../firebase'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

const FavoRoom = (props) => {

    const [favorite, setFavorite] = useState({room: props.room,favorite:undefined})

    useEffect(() => {
        getFavoriteRoomData()
    }, [])

    const getFavoriteRoomData = async () => {
        const favoriteRoomsRef = doc(db, 'rooms', props.room, 'favorites', auth.currentUser.uid)
        const favoriteStatus = await getDoc(favoriteRoomsRef)
        if (favoriteStatus.exists()) {
            let data = favoriteStatus.data()
            if (data.setAsFavorite) {
                console.log('IT WAS SET AS FAVORITE!')
                setFavorite({room:props.room, favorite:true})
            } else if (data.setAsFavorite == false) {
                console.log('IT WAS NOT SET AS FAVORITE!')
                setFavorite({room:props.room, favorite:false})
            }
        }
    }

    const getFavoriteStatus = async () => {
        const favoriteRoomsRef = doc(db, 'rooms', props.room, 'favorites', auth.currentUser.uid)
        const favoriteStatus = await getDoc(favoriteRoomsRef)
        if (favoriteStatus.exists()) {
            let data = favoriteStatus.data()
            if (data.setAsFavorite) {
                setFavorite({room:props.room, favorite:false})
                console.log('SET FAVORITE TO FALSE')
                await updateDoc(favoriteRoomsRef, {
                    setAsFavorite: false
                })
            } else if (data.setAsFavorite == false) {
                setFavorite({room:props.room, favorite:true})
                console.log('SET FAVORITE TO TRUE')
                await updateDoc(favoriteRoomsRef, {
                    setAsFavorite: true
                })
            }
        } else {
            console.log('no document exists here yet')
            console.log('FAVO?:',favorite)
            console.log('added favorite room')
            const favoriteRoomsRef = doc(db, 'rooms', props.room, 'favorites', auth.currentUser.uid)
            setDoc(favoriteRoomsRef, { userId: auth.currentUser.uid, setAsFavorite: true})
            setFavorite({room:props.room, favorite:true})
        }
    }

    return (
        <TouchableOpacity
            style={{marginLeft: 20, width: 50, alignItems: 'center'}}
            onPress={() => {
                getFavoriteStatus()
            }}
        >
            { favorite.favorite ?
                <MaterialIcons name="favorite" size={24} color="#0a1a35" />
                :
                <MaterialIcons name="favorite-border" size={24} color="#0a1a35" />
            }
        </TouchableOpacity>
    )
}

export default FavoRoom


const styles = StyleSheet.create({
})