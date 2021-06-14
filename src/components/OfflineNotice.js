import React, {useEffect, useState} from 'react';
import {StyleSheet, View, TouchableOpacity} from "react-native";
import colors from "../utilities/colors";
import AppText from "./AppText";
import {useNetInfo} from "@react-native-community/netinfo";
import {MaterialCommunityIcons} from "@expo/vector-icons"

import defaultStyles from '../utilities/styles'


function OfflineNotice(props) {
    const netInfo = useNetInfo()
    let noInternet = netInfo.type !== "unknown" && netInfo.isInternetReachable === false

    const [noInternetInfo, setNoInternetInfo] = useState(noInternet)

    useEffect(() => {
        setNoInternetInfo(noInternet)
    }, [noInternet])

    if(noInternetInfo) {
        return (
            <View style={styles.container}>
                <AppText style={{color: colors.rougeBordeau, fontSize: 13, fontWeight: 'bold'}}>Vous n'avez pas d'accès internet.</AppText>
                <TouchableOpacity onPress={() => setNoInternetInfo(false)} style={styles.closeButton}>
                    <MaterialCommunityIcons name='close' size={20} color={defaultStyles.colors.bleuFbi}/>
                </TouchableOpacity>
            </View>

        );
    }
    return null

}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: defaultStyles.colors.white,
        width: '100%',
        height: '10%'
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 15
    }
});
export default OfflineNotice;