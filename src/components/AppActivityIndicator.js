import React from 'react';
import {View, StyleSheet, Modal} from "react-native";
import defaultStyles from "../utilities/styles";
import LottieView from "lottie-react-native";


function AppActivityIndicator({visible}) {
    if (!visible) {
        return null;
    } else {
        return (
            <Modal visible={visible} transparent>
                <View style={styles.container}>

                </View>
                <View style={styles.content}>
                    <LottieView style={{ width: 150}} autoPlay={true} loop={true} source={require('../../assets/animations/loading')}/>
                </View>
            </Modal>
        );
    }

}


const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        backgroundColor: defaultStyles.colors.dark,
        opacity: 0.2
    },
    content: {
        position: 'absolute',
        height: 100,
        width: '90%',
        alignItems: 'center',
        justifyContent: 'center',
        top:'30%',
        backgroundColor: defaultStyles.colors.white,
        alignSelf: 'center'
    }
})

export default AppActivityIndicator;