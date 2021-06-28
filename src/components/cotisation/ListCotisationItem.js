import React from 'react';
import {View, StyleSheet, TouchableOpacity, TouchableWithoutFeedback} from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";

import AppText from "../AppText";
import AppButton from "../AppButton";
import AppSimpleLabelWithValue from "../AppSimpleLabelWithValue";
import useManageAssociation from "../../hooks/useManageAssociation";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import defaultStyles from '../../utilities/styles'
import AppIconButton from "../AppIconButton";
import useAuth from "../../hooks/useAuth";

function ListCotisationItem({cotisation,payCotisation, isPayed, showMore,
                                showCotisationMore, showCotisationLessDetail,
                            editSelected, deleteSelected}) {

    const {formatDate, formatFonds} = useManageAssociation()
    const {isModerator, isAdmin} = useAuth()
    const isAuthorized = isAdmin() || isModerator()

    return (
        <Swipeable onSwipeableRightOpen={showCotisationLessDetail} renderRightActions={() =><View style={{
            margin: 10,
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            {!isPayed && <AppButton onPress={payCotisation} otherButtonStyle={{padding: 5, height: 40}} title='Payer'/>}
            {isPayed && <AppText style={{color: defaultStyles.colors.bleuFbi}}>payé</AppText>}
        </View>}>
        <View style={styles.container}>
            <TouchableWithoutFeedback onPress={showCotisationMore}>
                <View style={styles.mainInfo}>
                    <AppText style={{width: 150, fontWeight: isPayed?'normal':'bold'}}>{cotisation.motif}</AppText>
                    <AppText style={{
                        fontWeight: isPayed?'normal':'bold'
                    }}>{formatFonds(cotisation.montant)}</AppText>
                </View>
            </TouchableWithoutFeedback>
            {showMore && <View
                style={{
                    marginVertical: 20,
                    marginHorizontal: 20
                }}>
                <AppSimpleLabelWithValue
                    label='Debut'
                    labelValue={formatDate(cotisation.dateDebut)} />

                    <AppSimpleLabelWithValue
                    label='Fin'
                    labelValue={formatDate(cotisation.dateFin)} />

                    <AppSimpleLabelWithValue
                    label='Type'
                    labelValue={cotisation.typeCotisation} />
                    {isAuthorized && <View style={{
                        alignItems:'center',
                        flexDirection: 'row',
                        justifyContent: 'flex-end'
                    }}>
                        <AppIconButton onPress={editSelected}
                            containerStyle={[styles.iconContainer, {marginHorizontal:20}]}
                            iconName='circle-edit-outline'/>
                        <AppIconButton onPress={deleteSelected}
                            containerStyle={styles.iconContainer}
                            iconColor={defaultStyles.colors.rougeBordeau}
                            iconName='delete'/>
                    </View>}
            </View>}
            <View style={styles.showMore}>
                <TouchableOpacity onPress={showCotisationMore}>
                {!showMore && <MaterialCommunityIcons name="chevron-down" size={30} color="black" />}
                {showMore && <MaterialCommunityIcons name="chevron-up" size={30} color="black" />}
                </TouchableOpacity>
            </View>
        </View>
        </Swipeable>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 20
    },
    mainInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: 20
    },
    iconContainer: {
        paddingHorizontal: 0,
        height: 50,
        width: 50,
        borderRadius: 25,
        marginVertical: 10
    },
    showMore: {
        backgroundColor: defaultStyles.colors.white,
        right: '30%',
        bottom: -10,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        height: 20,
        width: 50
    }
})
export default ListCotisationItem;