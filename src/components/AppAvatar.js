import React from 'react';
import {TouchableWithoutFeedback,Image, StyleSheet,View} from "react-native";
import LottieView from "lottie-react-native";
import colors from "../utilities/colors";

function AppAvatar({avatarStyle,source,onDelete, avatarLoading, onAvatarLoadEnd, loadingContainerStyle}) {

    const isImage = Object.keys(source).length>0 && source?.uri !== null && source?.uri !== undefined

    return (
        <TouchableWithoutFeedback onPress={onDelete}>
            <View style={styles.container}>
            {!isImage && <Image
                onLoadEnd={onAvatarLoadEnd}
                mode='contain' source={require('../../assets/silhouette.png')} style={[styles.avatar, avatarStyle]}/>}
            {isImage && <Image
                onLoadEnd={onAvatarLoadEnd}
                style={[styles.avatar, avatarStyle]} source={source}/>}
            {avatarLoading && <View style={[styles.avatarLoad, loadingContainerStyle]}>
                <LottieView
                    loop={true}
                    autoPlay={true}
                    style={styles.loading}
                    source={require('../../assets/animations/image-loading')}
                 />
            </View>}
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    avatar: {
        height: 60,
        width: 60,
        borderRadius: 30
    },
    avatarLoad:{
        position: 'absolute',
        width: "100%",
        height: "100%",
        backgroundColor: colors.lightGrey
    },
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    loading: {
        minHeight: 50,
        minWidth: 50
    }
})
export default AppAvatar;