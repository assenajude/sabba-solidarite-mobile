import React from 'react';
import {TouchableOpacity} from "react-native";
import colors from "../utilities/colors";
import {Avatar} from 'react-native-paper'

function AppAvatar({size=30,user,avatarImage = null, onPress}) {
    const isUserOk = user && user.avatar
    const isAvatarImage = avatarImage && avatarImage.url
    return (
        <TouchableOpacity onPress={onPress}>
            <Avatar.Image
                style={{
                    backgroundColor: colors.white
                }}
                size={size}
                source={isUserOk?{uri: user.avatar} : isAvatarImage?{uri: avatarImage.url} :  require('../../assets/silhouette.png')}
            />
        </TouchableOpacity>
    );
}

export default AppAvatar;