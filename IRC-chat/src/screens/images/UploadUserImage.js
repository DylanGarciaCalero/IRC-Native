import React, { useState, useEffect } from 'react';
import { Button, Image, View, Platform, Text, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { auth, storage } from '../../../firebase'
import { TouchableHighlight } from 'react-native-gesture-handler';

const UploadUserImage = (props) => {
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted'){
                    alert('Sorry, we need camera roll permissions to make this work!');
                }
            }
        })();
    }, []);

    const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
    });

    if (!result.cancelled) {
        setLoading(true)
        const docRef = ref(storage, `users/${auth.currentUser.uid}/images/profile/profile.jpg`);
        try {
            const img = await fetch(result.uri);
            const bytes = await img.blob();
            await uploadBytes(docRef, bytes);
            setLoading(false)
            props.navigation.replace("Home");
        } catch (err) {
            console.log(err)
        }
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <TouchableHighlight onPress={pickImage}>
            <Text>{loading ? <ActivityIndicator size="large" color="black" /> : 'pick your image' }</Text>
        </TouchableHighlight>
    </View>
  );
}

export default UploadUserImage