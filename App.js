import React, { useEffect, useState, useRef } from "react";
import { Text, View, Button, StyleSheet } from "react-native";
import { Camera } from "expo-camera";
import axios from "axios";
import * as Speech from "expo-speech";

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [text, setText] = useState("...");
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const captureAndSend = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({ base64: true });

      const res = await axios.post("http://YOUR_BACKEND_URL/predict", {
        image: photo.base64,
      });

      setText(res.data.text);
      Speech.speak(res.data.text);
    }
  };

  if (hasPermission === null) return <Text>Requesting permission...</Text>;
  if (hasPermission === false) return <Text>No camera access</Text>;

  return (
    <View style={styles.container}>
      <Camera ref={cameraRef} style={styles.camera} />
      <Text style={styles.text}>{text}</Text>
      <Button title="Translate Sign" onPress={captureAndSend} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1 },
  text: { fontSize: 22, textAlign: "center", margin: 10 },
});
