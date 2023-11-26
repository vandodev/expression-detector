import { useEffect, useState } from "react";
import {  View } from 'react-native';
import { styles } from './styles';
import {Camera, CameraType, FaceDetectionResult } from 'expo-camera';
import * as FaceDetector from "expo-face-detector";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
  } from "react-native-reanimated";

export function Home() {
    const [faceDetected, setFaceDetected] = useState(false);
    const [permission, requestPermission] = Camera.useCameraPermissions();
    
    useEffect(() =>{
        requestPermission();
    },[])

    if(!requestPermission){
        return;
    }

    const faceValues = useSharedValue({
        width: 0,
        height: 0,
        x: 0,
        y: 0,
      });

      const animatedStyle = useAnimatedStyle(() => ({
        position: "absolute",
        zIndex: 1,
        width: faceValues.value.width,
        height: faceValues.value.height,
        transform: [
          { translateX: faceValues.value.x },
          { translateY: faceValues.value.y },
        ],
        borderColor:'blue',
        borderWidth:10,
      }));

    function handleFacesDetected({ faces }: FaceDetectionResult) {
        const face = faces[0] as any;
    
        if (face) {
          const { size, origin } = face.bounds;
    
          faceValues.value = {
            height: size.height,
            width: size.width,
            x: origin.x,
            y: origin.y,
          };
    
          setFaceDetected(true);
             
        } else {
          setFaceDetected(false);
        }
      }
    

  return (
    <View style={styles.container}>
         {faceDetected && <Animated.View style={animatedStyle}/>}
        <Camera 
            style={styles.camera}
            type={CameraType.front}
            onFacesDetected={handleFacesDetected}
            faceDetectorSettings={{
                mode: FaceDetector.FaceDetectorMode.fast,
                detectLandmarks: FaceDetector.FaceDetectorLandmarks.all,
                runClassifications: FaceDetector.FaceDetectorClassifications.all,
                minDetectionInterval: 100,
                tracking: true,
              }}
         />
    </View>
  );
}


