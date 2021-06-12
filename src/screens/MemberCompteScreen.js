import React, {useEffect, useState} from 'react';
import {View, ScrollView, StyleSheet} from "react-native";

import AppText from "../components/AppText";
import useManageAssociation from "../hooks/useManageAssociation";
import AppAddNewButton from "../components/AppAddNewButton";
import routes from "../navigation/routes";
import defaultStyles from "../utilities/styles";
import AppLabelWithValue from "../components/AppLabelWithValue";
import AppLinkButton from "../components/AppLinkButton";
import useCotisation from "../hooks/useCotisation";
import useEngagement from "../hooks/useEngagement";
import BackgroundWithAvatar from "../components/member/BackgroundWithAvatar";
import useAuth from "../hooks/useAuth";
import EditImagesModal from "../components/member/EditImagesModal";


function MemberCompteScreen({route, navigation}) {

    const {isModerator, getConnectedMember, isAdmin} = useAuth()
    const {getMemberCotisations} = useCotisation()
    const {getMemberEngagementInfos} = useEngagement()
    const {formatFonds, formatDate} = useManageAssociation()

    const [editImages, setEditImages] = useState(false)

    const isAuthorized = isAdmin() || isModerator()

    useEffect(() => {
    }, [])

    return (
        <>
            <ScrollView contentContainerStyle={{paddingBottom: 20}}>
                <BackgroundWithAvatar
                    onChangeImages={() => setEditImages(true)
                    }
                    selectedMember={getConnectedMember()}
                    showCamera={true}
                />
                <View style={styles.statut}>
                    <AppText style={{color: defaultStyles.colors.bleuFbi, fontSize: 22, fontWeight: 'bold'}}>{getConnectedMember().member.statut}</AppText>
                </View>
                <View style={{marginTop: 30}}>
                    <AppLabelWithValue label='Fonds' value={formatFonds(getConnectedMember().member.fonds)}/>
                    <AppLabelWithValue label="Date d'adhesion" value={formatDate(getConnectedMember().member.adhesionDate)}/>
                </View>
                <View style={{
                    marginVertical: 10,
                    marginHorizontal: 10
                }}>
                    <AppLinkButton label='Vos cotisations'
                                   onPress={() =>
                                       navigation.navigate('Cotisations', {
                                           screen: 'MemberCotisationScreen',
                                           initial: false,
                                           params:getConnectedMember()
                                       })}
                                   labelLength={getMemberCotisations(getConnectedMember()).cotisationLenght}
                                   totalAmount={getMemberCotisations(getConnectedMember()).totalCotisation}/>
                     <AppLinkButton label='Vos engagements'
                                    onPress={() => navigation.navigate('Engagements', {
                                        screen : routes.LIST_ENGAGEMENT,
                                        initial: false,
                                        params:getConnectedMember()
                                    })}
                                    labelLength={getMemberEngagementInfos(getConnectedMember()).engagementLength}
                                    totalAmount={getMemberEngagementInfos(getConnectedMember()).engagementAmount}/>
                </View>
            </ScrollView>
            {isAuthorized && <View style={styles.edit}>
                <AppAddNewButton name='account-edit'
                                 onPress={() => navigation.navigate('Members',{
                                     screen : routes.EDIT_MEMBER,
                                     params: getConnectedMember()
                                 })}/>
            </View>}

            <EditImagesModal
                closeModal={() => setEditImages(false)}
                editImagesModalVisible={editImages}/>
        </>
    );
}

const styles = StyleSheet.create({
    avatar: {
        bottom: 2,
        position: 'absolute',
        left: 15,
    },
    camera: {
        padding: 10
    },
    cameraContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    cotisation: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginVertical: 20
    },
    edit: {
      position: 'absolute',
        right: 20,
        bottom: 25
    },
    fontImage: {
        height: 200
    },
    mainInfo: {
        marginLeft:'25%',
        marginTop: 10,
    },
    statut: {
        alignItems: 'center',
        marginTop: 40
    }
})
export default MemberCompteScreen;