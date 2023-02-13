import React from 'react'
import { StyleSheet, Image, SafeAreaView, ActivityIndicator } from 'react-native'
import { auth } from '../../../firebase'
import LoadingImage from '../../../assets/icons8-chat-100.png'

const Loading = ({ navigation }) => {

    React.useEffect(() => {
        setTimeout(() => {
            loginChecker()
        }, 4000);
    })

    const loginChecker = async () => {
        let user = auth.currentUser;
        if (user) {
            navigation.replace("Home")
        }
        else {
            navigation.replace('Login')
        }
    }

    return (
        <SafeAreaView style={{
            flex: 1,
            height: '100%', width: '100%',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <Image
                style={{ width: 100,height: 100,margin: 10}}
                source={LoadingImage}
            />
            <ActivityIndicator size="large" color="black" />
        </SafeAreaView>
    )
}

export default Loading

const styles = StyleSheet.create({})
