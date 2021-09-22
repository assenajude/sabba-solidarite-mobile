import React from 'react';
import AppText from "../AppText";
import {View, StyleSheet} from "react-native";
import colors from "../../utilities/colors";
import useManageAssociation from "../../hooks/useManageAssociation";

function FundsInfor({fund, label, fundColor=colors.vert}) {
    const {formatFonds} = useManageAssociation()

    return (
        <View style={styles.fondsContent}>
            <View style={styles.content}>
                <AppText>{label}</AppText>
                <AppText style={{marginVertical: 10, color: fundColor}}>{formatFonds(fund)}</AppText>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    fondsContent: {
        backgroundColor: colors.leger,
        width: '80%',
        marginVertical: 20,
        alignItems: 'center',
        padding: 10
    },
    content: {
        backgroundColor: colors.white,
        paddingHorizontal: 30,
        borderRadius: 10,
        alignItems: 'center'
    }
})

export default FundsInfor;