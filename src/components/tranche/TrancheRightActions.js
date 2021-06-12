import React from 'react';
import {View, TouchableWithoutFeedback,StyleSheet} from "react-native";
import {MaterialCommunityIcons} from '@expo/vector-icons'
import AppText from "../AppText";
import defaultStyles from '../../utilities/styles'
function TrancheRightActions({payingTranche, isPaying, ended}) {
    return (
        <View style={{
            marginLeft: 20
        }}>
            <TouchableWithoutFeedback onPress={payingTranche}>
                <View>
                {!ended && isPaying && <MaterialCommunityIcons name="chevron-up" size={30} color="black" />}
                {!ended && !isPaying && <AppText style={{fontSize: 15, color: defaultStyles.colors.bleuFbi, fontWeight: 'bold'}}>Payer</AppText>}
                    {ended && <MaterialCommunityIcons name="check" size={25} color={defaultStyles.colors.vert} />}
                </View>
            </TouchableWithoutFeedback>
        </View>
    );
}

export default TrancheRightActions;