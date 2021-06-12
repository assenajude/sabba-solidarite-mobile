import React from 'react';
import {Modal,TouchableOpacity, View, StyleSheet} from "react-native";
import defaultStyles from "../utilities/styles";
import AppText from "./AppText";
import {MaterialCommunityIcons} from "@expo/vector-icons";

function AppModal({visible, closeInfoModal, contentStyle, children}) {
    return (
        <Modal visible={visible} transparent>
            <View style={styles.container}>

            </View>
            <View style={[styles.contentContainer, contentStyle]}>
                <View style={{alignItems: 'flex-end', padding: 10}}>
                    <TouchableOpacity onPress={closeInfoModal}>
                        <MaterialCommunityIcons name='close' size={24} color={defaultStyles.colors.rougeBordeau}/>
                    </TouchableOpacity>
                </View>
                {children}
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        opacity: 0.5,
        backgroundColor: defaultStyles.colors.dark
    },
    contentContainer: {
        position: 'absolute',
        top: 50,
        width: '100%',
        height: '90%',
        backgroundColor: defaultStyles.colors.white
    }
})
export default AppModal;