import React from 'react';
import {TouchableWithoutFeedback,View, StyleSheet} from "react-native";
import AppText from "./AppText";
import defaultStyles from "../utilities/styles";
import useManageAssociation from "../hooks/useManageAssociation";

function AppLinkButton({onPress, label, labelLength, totalAmount}) {
    const {formatFonds} = useManageAssociation()
    return (
        <TouchableWithoutFeedback onPress={onPress}>
            <View style={styles.container} elevation={10}>
                <View>
                    <AppText style={styles.linkText}>{label}</AppText>
                </View>
                <View>
                    <AppText style={[styles.linkText, {marginHorizontal: 5}]}>({labelLength})</AppText>
                </View>
               <View>
                   <AppText style={styles.linkText}>{totalAmount?formatFonds(totalAmount):''}</AppText>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );

}
const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: defaultStyles.colors.bleuFbi,
        width: '100%',
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: defaultStyles.colors.white,
        marginVertical: 20,
        borderRadius: 10,
        flexDirection: 'row'
    },
    linkText: {
        fontWeight: 'bold',
        fontSize: 18,
        color: defaultStyles.colors.bleuFbi
    }
})

export default AppLinkButton;