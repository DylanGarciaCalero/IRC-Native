import React from "react";
import { StyleSheet, Text, View} from 'react-native'
import { useState } from "react";
import { Button } from "react-native-elements";
import { StatusBar } from "expo-status-bar";
import { Audio } from "expo-av";
import { db, auth, storage } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";
import { uploadBytes, ref } from "@firebase/storage";
import { uuidv4 } from "@firebase/util";
import AntDesign from 'react-native-vector-icons/AntDesign'
import { TouchableOpacity } from "react-native-gesture-handler";

const AudioRecording = (props) => {
    const [recording, setRecording] = useState();
    const [recordings, setRecordings] = useState([]);
    const [message, setMessage] = useState();
    const [docId, setDocId] = useState();

    const sendAudioReferenceMessage = async (file) => {
        const uuid = uuidv4();
        setDocId(uuid)
        console.log('INITIAL DOCID',docId)
        if (file != undefined) {
            if (docId != undefined) {
                const privateMessageRef = collection(db, 'privatechat', auth.currentUser.uid, 'correspondants', props.receiver, 'messages');
                addDoc(privateMessageRef, {
                    message: 'sent you a recording',
                    receiverUser: props.receiver,
                    senderId: auth.currentUser.uid,
                    file: 'audio',
                    referenceId: docId,
                    time: Date.now(),
                    read: true,
                }).then(() => {
                    const privateMessageRecRef = collection(db, 'privatechat', props.receiver , 'correspondants', auth.currentUser.uid, 'messages');
                    addDoc(privateMessageRecRef, {
                        message: 'sent you a recording',
                        receiverUser: props.receiver,
                        file: 'audio',
                        referenceId: docId,
                        senderId: auth.currentUser.uid,
                        time: Date.now(),
                        read: false,
                    })
                })
            }

            try {
                const docRef = ref(storage, `users/${auth.currentUser.uid}/audio/${docId}`);
                const audioFile = await fetch(file)
                const audioFileBlob = await audioFile.blob();
                await uploadBytes(docRef, audioFileBlob);
            } catch (err) {
                console.log(err)
            }
        }
    }

    const startRecording = async () => {
        try {
            const permission = await Audio.requestPermissionsAsync();
            if (permission.status === "granted") {
                await Audio.setAudioModeAsync({
                    allowsRecordingIOS: true,
                    playsInsilentModeIOS: true,
                });
                
                const {recording} = await Audio.Recording.createAsync(
                    Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
                );
                
                setRecording(recording)
            } else {
                setMessage("Please grant permission to app to access microphone")
            }
        } catch (err) {
            console.error("failed to start recording", err)
        }
    }

    const stopRecording = async () => {
        setRecording(undefined);
        await recording.stopAndUnloadAsync();

        let updatedRecordings = [...recordings];
        const { sound, status } = await recording.createNewLoadedSoundAsync();
        updatedRecordings.push({
            sound: sound,
            duration: getDurationFormatted(status.durationMillis),
            file: recording.getURI()
        });
        setRecordings(updatedRecordings);
    }

    const getDurationFormatted = (millis) => {
        const minutes = millis / 1000 / 60;
        const minutesDisplay = Math.floor(minutes);
        const seconds = Math.round((minutes - minutesDisplay) * 60);
        const secondsDisplay = seconds < 10 ? `0${seconds}` : seconds;
        return `${minutesDisplay}: ${secondsDisplay}`;
    }

    const removeItem = (item) => {
        console.log("REMOVED ITEM", item);
        let filteredRecordings = recordings.filter((el) => el.file !== item.file)
        setRecordings(filteredRecordings)
    }

    const getRecordingLines = () => {
        if (recordings) {
            const limitedRecordings = recordings.slice(-1);
            return limitedRecordings.map((recordingLine, index) => {
                return (
                    <View key={index} style={styles.recording}>
                        <Text style={{color: "white"}}>Recording - {recordingLine.duration}</Text>
                        <Button style={styles.button} onPress={() => recordingLine.sound.replayAsync()} title="Play"/>
                        <Button style={styles.button} onPress={() => {
                            sendAudioReferenceMessage(recordingLine.file)
                        }} title="Send"/>
                        <TouchableOpacity
                            onPress={() => removeItem(recordingLine)}
                        >
                            <AntDesign name="delete" color="white" size={30}/>
                        </TouchableOpacity>
                    </View>
                )
            })
        }
    }

    return (
        <View>
            <View style={{marginBottom: 10}}>
                <Button
                    title={recording ? 'stop recording': 'start recording'}
                    onPress={recording ? stopRecording : startRecording}
                />
            </View>
            { getRecordingLines() }
            <StatusBar style="auto"/>
        </View>
    )
}

const styles = StyleSheet.create({
    recording: {
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "center",
        width: "80%",
        justifyContent: "space-between"
    },
    button: {
        padding: 2,
    }
})
    
export default AudioRecording