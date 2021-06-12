import React from 'react';
import {View,TouchableOpacity, StyleSheet} from "react-native";
import {MaterialCommunityIcons} from '@expo/vector-icons'
import AppText from "../AppText";
import dayjs from "dayjs";
import useManageAssociation from "../../hooks/useManageAssociation";
import AppSimpleLabelWithValue from "../AppSimpleLabelWithValue";
import ListItemSeparator from "../ListItemSeparator";

function CotisationItem({cotisation, cotisationDetail, getCotisationDetails}) {
    const {formatFonds} = useManageAssociation()
    return (
            <View>
                <View>
                    <View style={styles.itemContainer}>
                    <View style={{
                        flexDirection:'row'
                    }}>
                        <TouchableOpacity onPress={getCotisationDetails}>
                            {!cotisation.showDetail && <MaterialCommunityIcons name='plus' size={24} color='black'/>}
                            {cotisation.showDetail && <MaterialCommunityIcons name='minus' size={24} color='black'/>}
                        </TouchableOpacity>
                        <AppText style={{width: 150, fontWeight: 'bold', marginLeft: 5}} >{cotisation.motif}</AppText>
                    </View>
                    <AppText style={{fontWeight: 'bold'}}>{formatFonds(cotisation.member_cotisation?.montant)}</AppText>
                    </View>
                </View>
                {cotisationDetail && <View>
                    <AppSimpleLabelWithValue
                        label='Payé le:'
                        labelValue={dayjs(cotisation.member_cotisation?.paymentDate).format('DD/MM/YYYY HH:mm:ss')}/>
                <ListItemSeparator/>
                </View>}
            </View>
    );
}

const styles = StyleSheet.create({
    itemContainer: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingVertical: 20
    }
})
export default CotisationItem;