import { SafeAreaView, StyleSheet, Text, View, Image, Button, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { db } from '../../firebase';
import { auth } from '../../firebase';
import { storage } from '../../firebase';
import AntDesign from 'react-native-vector-icons/AntDesign'
import { Firestore, collection, getDoc, doc } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { setStatusBarStyle } from 'expo-status-bar';
import { Video, AVPlaybackStatus } from "expo-av";

const GetAudioReplay = (props) => {

    const video = React.useRef(null)

    const [user, setUser] = useState({})
    const [url, setUrl] = useState()
    const [dataLoading, setDataLoading] = useState(true)
    const [status, setStatus] = React.useState({});

    useEffect(() => {
        const getAudio = async () => {
            if (props.fileRef) {
                if (props.user) {
                    setTimeout(async () => {
                        const audioRef = ref(storage, `users/${props.user}/audio/${props.fileRef}`);
                        console.log(audioRef);
                        await getDownloadURL(audioRef).then((item) => {
                            setUrl(item)
                            setTimeout(() => setDataLoading(false), 1000);
                        })
                    }, 1000)
                }
            }
        }
        getAudio();
    }, [dataLoading]);

    if(dataLoading)
    {
        return <Text>Loading</Text>
    } else {
        return (
            <>
                <Video
                    ref={video}
                    source={{
                    uri: url,
                    }}
                    useNativeControls
                    resizeMode="contain"
                    isLooping
                    onPlaybackStatusUpdate={status => setStatus(() => status)}
                />
                <View style={styles.buttons}>
                    <Button
                    title={status.isPlaying ? 'Pause' : 'Play'}
                    onPress={() =>
                        status.isPlaying ? video.current.pauseAsync() : video.current.playAsync()
                    }
                    />
                </View>
            </>
        )
    }

}

export default GetAudioReplay


const styles = StyleSheet.create({

})