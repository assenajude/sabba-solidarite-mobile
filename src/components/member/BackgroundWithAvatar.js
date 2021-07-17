import React from 'react';
import {Image, View, StyleSheet} from "react-native";
import LottieView from 'lottie-react-native'
import {LinearGradient} from "expo-linear-gradient";
import MemberItem from "./MemberItem";
import AppImagePicker from "../AppImagePicker";
import colors from "../../utilities/colors";

function BackgroundWithAvatar({getCompteDetails,allowCamera=false, fondStyle,cancelAvatarChanging, saveAvatar,
                                  selectedMember,onSaveBackImage,onCancelBackImage,onBackImageEditing,onCloseBackModal,
                                 onChangeMemberAvatar, avatarStyle,onSelectBackImage,selectingBackImage,onSelectingBackImage,
                                  onCloseSelectingModal, onSelectingAvatar, selectingAvatar, onAvatarEditing, onBackImageLoading, onBackImageLoadEnd}) {


    return (
        <View>
            {!selectedMember.backImage && <LinearGradient
                colors={['#860432', 'transparent']}
                style={[styles.background, {height: selectedMember?.member?.backImage?0:100}]}
            />}

            {selectedMember?.member?.backImage && <View>
            <Image
                onLoadEnd={onBackImageLoadEnd}
                style={[styles.fontImage, fondStyle]}
                source={{uri: selectedMember?.member?.backImage}}/>

                {onBackImageLoading && <View style={styles.backLoadingStyle}>
                    <LottieView style={{
                        height: 150,
                        width: 200
                    }}
                        loop={true}
                        autoPlay={true}
                        source={require('../../../assets/animations/image-loading')}/>
                </View>}

            </View>
            }
            {allowCamera && <View style={[styles.backImagePicker, {top:selectedMember?.member?.backImage?0:-10}]}>
                <AppImagePicker
                    cameraStyle={styles.backCameraStyle}
                    iconSize={15}
                    saveImage={onSaveBackImage}
                    cancelImage={onCancelBackImage}
                    onImageEditing={onBackImageEditing}
                    selectingImage={selectingBackImage}
                    onPressCamera={onSelectingBackImage}
                    onPressCloseButton={onCloseBackModal}
                    onSelectImage={onSelectBackImage}/>
            </View>}
            <View>
                <MemberItem  selectedMember={selectedMember} avatarStyle={avatarStyle} getMemberDetails={getCompteDetails}/>
                {allowCamera && <View style={{
                    position: 'absolute',
                    left: 50,
                    bottom:onAvatarEditing?-40: -30
                }}>
                    <AppImagePicker
                        onSelectImage={onChangeMemberAvatar}
                        cameraStyle={styles.backCameraStyle}
                        iconSize={15}
                        onPressCloseButton={onCloseSelectingModal}
                        onPressCamera={onSelectingAvatar}
                        selectingImage={selectingAvatar}
                        onImageEditing={onAvatarEditing}
                        cancelImage={cancelAvatarChanging}
                        saveImage={saveAvatar}/>
                </View>}

            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    avatar: {
        borderRadius: 30,
        bottom:30,
        position: 'absolute',
        height: 60,
        left: 30,
        width: 60
    },
    background: {
        height: 100,
        width: '100%',
    },
    backImagePicker: {
      position: 'absolute',
      right: 5,
    },
    backCameraStyle: {
        height:30,
        width: 30,
        padding: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    backLoadingStyle:{
        position: 'absolute',
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:colors.lightGrey
    },
    cameraContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    camera: {
        position: 'absolute',
        right: 10,
        bottom: 25,
        height: 50,
        width: 50
    },
    fontImage: {
        height: 200
    },
    mainInfo: {
        marginLeft:'25%',
        marginTop: 10,
    }
})
export default BackgroundWithAvatar;