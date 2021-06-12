import React from 'react';
import {Modal, StyleSheet, View} from "react-native";
import * as Progress from "react-native-progress";
import defaultStyles from '../utilities/styles'
import LottieView from "lottie-react-native";

function AppUploadModal({progress, uploadModalVisible}) {
    return (
        <Modal visible={uploadModalVisible} transparent>
            <View style={styles.container}>

            </View>
            <View style={styles.animation}>
                <LottieView style={{height: 100, width: 200}} source={require('../../assets/animations/loading')} autoPlay={true} loop={true} />
                <View>
                    <Progress.Bar progress={progress} color={defaultStyles.colors.rougeBordeau} width={200}/>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    animation: {
        alignItems: 'center',
        position: 'absolute',
        height: 200,
        width: '100%',
        backgroundColor: defaultStyles.colors.white,
        top: '30%'
    },
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: defaultStyles.colors.dark,
        top: 50,
        opacity: 0.5,
        marginBottom: 20
    }
})
export default AppUploadModal;