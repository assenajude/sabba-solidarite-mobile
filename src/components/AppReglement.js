import React from 'react';
import {StyleSheet, View} from "react-native";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import AppText from "./AppText";
import defaultStyles from "../utilities/styles";
import AppDownloadButton from "./AppDownloadButton";
import AppUploadButton from "./AppUploadButton";
import useAuth from "../hooks/useAuth";

function AppReglement({association}) {

    const {isAdmin} = useAuth()

    return (
        <View style={styles.reglement}>
            <View style={{
                flexDirection: 'row',
                alignItems: 'center'
            }}>
                <MaterialCommunityIcons name="file-pdf-outline" size={24} color="black" />
                <AppText style={{color: defaultStyles.colors.bleuFbi}}> Reglement intérieur</AppText>
            </View>
            {isAdmin() && <View style={{
                marginHorizontal: 10
            }}>
                <AppUploadButton association={association}/>
            </View>}
            <View
                style={{
                marginHorizontal: 10
            }}>
                <AppDownloadButton association={association}/>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    reglement: {
        marginVertical: 10,
        marginHorizontal: 20,
        flexDirection: 'row'
    },
})

export default AppReglement;