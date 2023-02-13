import { FlatList, StyleSheet, Text, TouchableOpacity, View, SafeAreaView, Image, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { auth } from '../../../firebase';
import { db } from '../../../firebase';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { getDocs, collection, onSnapshot, doc, query, orderBy, limit, where } from 'firebase/firestore';
import UnreadMessages from '../../components/UnreadMessages';
import GetImageData from '../../components/GetImageData';
import Ionicons from 'react-native-vector-icons/Ionicons'
import AntDesign from 'react-native-vector-icons/AntDesign'

const Users = (props) => {

    const [value, loading, error] = useCollectionData(
        query(collection(db, "users"), where("id", "!=", auth.currentUser.uid))
    )

    useEffect(() => {
    }, [value]);

    return (
        <View style={styles.mainContainer}>
            <View style={{width: "100%", paddingBottom: 20, paddingTop: 20, flexDirection: "row", justifyContent: "center", alignItems:"center", backgroundColor: '#0a1a35', marginBottom: 4,}}>
                <AntDesign name='user' size={25} color="white"/>
                <Text style={{padding: 10, fontSize: 16, color:'white'}}>{value? value.length : ''} users</Text>
            </View>
            {
                loading ?
                <ActivityIndicator size="large" color="black"/>
                :
                <FlatList   
                    data={value ? value.sort((a, b) => Number(b.isOnline) - Number(a.isOnline)): ''}   
                    keyExtractor={item => item.name}   
                    renderItem={({ item }) =>
                    {
                        return (
                            <TouchableOpacity
                                onPress={() => props.navigation.navigate("PrivateChat", {data:item})}
                                style={styles.userContainer}
                            >
                                <View style={{position: 'relative'}}>
                                    <GetImageData collection="users" file={item.id} type="profile"/>
                                    <View style={{ 
                                        margin: 5,
                                        width: 21, 
                                        height: 21, 
                                        backgroundColor: item.isOnline ? 'lightgreen' : 'red',
                                        borderRadius: 100,
                                        borderColor: 'lightblue',
                                        borderWidth: 2,
                                        position: 'absolute',
                                        bottom: -10,
                                        right: -10,
                                        }}    
                                    />
                                </View>
                                <Text
                                    style={styles.userName}
                                >
                                    {item.name}
                                </Text>
                                <UnreadMessages user={item.id}/>
                            </TouchableOpacity>
                        );
                    }} 
                />
            }
            
        </View>
    )
}

export default Users

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    cardMainContainer: {
        padding:32,
        marginLeft:16,marginTop:16,marginRight:16,
        borderRadius:8,
        alignItems:'center',
        color: 'black',
    },
    cardText: {
        fontSize:16,
        fontWeight:'700'
    },
    item: {
        color: 'white',
    },
    userName: {
        width: '50%',
        fontSize: 16,
        marginLeft: 6,
    },
    userContainer: {
        backgroundColor: 'lightblue',
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    flexContainer: {
        flexDirection: "column",
        justifyContent: 'space-evenly',
        marginRight: 5,
    },
    timeStamp: {
        textAlign: 'right',
        fontSize: 10,
    }
})