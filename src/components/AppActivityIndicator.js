import React from 'react';
import {View, StyleSheet} from "react-native";
import defaultStyles from "../utilities/styles";
import LottieView from "lottie-react-native";


function AppActivityIndicator({visible}) {
    if (!visible) {
        return null;
    } else {
        return (
            <>
            <View style={styles.container}>
            </View>
                <View style={styles.content}>
                    <LottieView
                        style={{ width: 100}}
                        autoPlay={true}
                        loop={true}
                        source={require('../../assets/animations/loading')}/>
                </View>
                </>

        );
    }

}


const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        zIndex: 5,
        width: '100%',
        height: '100%',
        opacity: 0.3,
        backgroundColor: defaultStyles.colors.dark,
    },
    content: {
        width: '90%',
        height: 100,
        justifyContent: 'center',
        top: '50%',
        zIndex: 10,
        alignSelf: 'center',
        alignItems: 'center',
        position: 'absolute',
        backgroundColor: defaultStyles.colors.white,
    }
})

export default AppActivityIndicator;