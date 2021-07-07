import React from 'react';
import {View, StyleSheet, Image,  TouchableWithoutFeedback,} from "react-native";
import {MaterialCommunityIcons} from '@expo/vector-icons'

import AppText from "../AppText";
import AppButton from "../AppButton";
import defaultStyles from '../../utilities/styles'
import AppIconButton from "../AppIconButton";
import useAuth from "../../hooks/useAuth";
import LottieView from 'lottie-react-native'
import {associationImageLoaded} from "../../store/slices/memberSlice";
import {useDispatch} from "react-redux";


function AssociationItem({association,borderStyle,sendAdhesionMessage,onPress, isMember,
                             relationType,onImageLoadEnd,imageLoading,
                             showState=true, deleteSelected}) {
    const {isAdmin} = useAuth()
    return (
        <View style={[{width: '50%', marginVertical: 10}, borderStyle]}>
        <View style={styles.container}>
        <TouchableWithoutFeedback onPress={onPress}>
            <View style={{
                alignItems: 'center',
                borderWidth: imageLoading?0.5:0
            }}>
                <Image
                    onLoadEnd={onImageLoadEnd}
                    loadingIndicatorSource={require('../../../assets/solidariteImg.jpg')}
                    style={styles.associationAvatar}
                    source={association.avatar.length>0?{uri: association.avatar} : require('../../../assets/solidariteImg.jpg')}/>
                {imageLoading && <View style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    alignItems: 'flex-start',
                    backgroundColor: defaultStyles.colors.lightGrey

                }}>
                <LottieView style={{
                    height: 180,
                    width: 180,
                }}
                    source={require("../../../assets/animations/image-loading")}
                    loop={true}
                    autoPlay={true}/>
                </View>}
                <AppText style={[styles.nom, {marginTop: imageLoading?30:0, marginVertical: imageLoading?0:10}]}>{association.nom}</AppText>
            </View>
        </TouchableWithoutFeedback>
        </View>
            {showState && <View style={{
                position: 'absolute',
                top:0,
                right:10
            }}>
                {!isMember && <AppButton otherButtonStyle={styles.buttonStyle} title='adherer' onPress={sendAdhesionMessage}/>}
                {isMember && relationType.toLowerCase() === 'ondemand' && <AppText style={{color: defaultStyles.colors.bleuFbi}}>envoyé</AppText> }
                {isMember && relationType.toLowerCase() === 'rejected' && <AppText style={{color: defaultStyles.colors.rouge}}>refusé</AppText> }
                {isMember && relationType.toLowerCase() === 'member' && <View style={styles.iconContainer}>
                    <MaterialCommunityIcons name="account-group" size={24} color={defaultStyles.colors.vert} />
                </View>
                }
                {isMember && relationType.toLowerCase() === 'onleave' && <View style={styles.iconContainer}>
                    <MaterialCommunityIcons name="account-group" size={20} color={defaultStyles.colors.rouge} />
                </View>
                }
            </View>}
            {isAdmin() && <View style={styles.deleteButton}>
               <AppIconButton
                   onPress={deleteSelected}
                   iconColor={defaultStyles.colors.rougeBordeau}
                   iconSize={25}
                   containerStyle={{
                       height: 40,
                       width: 40,
                       paddingHorizontal: 0,
                       borderRadius: 20
                   }}
                   iconName='delete'/>
            </View>}
            </View>
    );
}

const styles = StyleSheet.create({
    associationAvatar: {
      height: 100,
      width: 150,
        borderRadius: 10
    },
    container: {
        marginVertical: 20,
        marginHorizontal:10,
    },
    buttonStyle: {
        width: 'auto',
        height: 20,
        padding: 5
    },
    deleteButton: {
      position: 'absolute',
      left: 5,
      top: 0
    },
    iconContainer: {
        alignItems: 'center',
        borderRadius: 15,
        borderWidth: 1,
        height: 30,
        justifyContent: 'center',
        width: 30,
    },
    nom: {
        textAlign: 'center',
        fontWeight: 'bold'
    }
})
export default AssociationItem;