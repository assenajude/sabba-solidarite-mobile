import React from 'react';
import {View,TouchableOpacity, StyleSheet} from "react-native";
import {MaterialCommunityIcons} from '@expo/vector-icons'
import AppText from "../AppText";
import dayjs from "dayjs";
import useManageAssociation from "../../hooks/useManageAssociation";
import AppSimpleLabelWithValue from "../AppSimpleLabelWithValue";
import colors from "../../utilities/colors";

function CotisationItem({cotisation, cotisationDetail, getCotisationDetails}) {
    const {formatFonds} = useManageAssociation()
    return (
            <View>
                <TouchableOpacity
                    style={[styles.itemContainer, {backgroundColor: cotisation.showDetail?colors.white : colors.lightGrey}]}
                            onPress={getCotisationDetails}>
                    <View style={{
                        flexDirection: 'row'
                    }}>
                        <MaterialCommunityIcons
                            name={cotisation.showDetail?'chevron-down' : 'chevron-right'}
                            size={30} color='black'/>
                        <AppText style={{width: 240, fontWeight: 'bold'}} >{cotisation.motif}</AppText>
                    </View>

                            <AppText style={{fontWeight: 'bold'}}>{formatFonds(cotisation.member_cotisation?.montant)}</AppText>
                        </TouchableOpacity>
                {cotisationDetail && <View>
                    <AppSimpleLabelWithValue
                        label='Payé le'
                        labelValue={dayjs(cotisation.member_cotisation?.paymentDate).format('DD/MM/YYYY HH:mm:ss')}/>

                        <AppSimpleLabelWithValue
                        label='Type'
                        labelValue={cotisation.typeCotisation}/>
                </View>}
            </View>
    );
}

const styles = StyleSheet.create({
    itemContainer: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingVertical: 10,
        marginVertical: 10,
    }
})
export default CotisationItem;