import React from 'react';
import {View, StyleSheet, Image, TouchableOpacity, TouchableWithoutFeedback} from "react-native";
import AppText from "../AppText";
import {MaterialCommunityIcons} from '@expo/vector-icons'

import defaultStyles from '../../utilities/styles'

function TransactionItem({isSelected,onSelectReseau, item}) {
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={onSelectReseau}>
            <View style={styles.header}>
                <View style={styles.selected}>
                    {isSelected && <MaterialCommunityIcons name="checkbox-blank-circle" size={18} color={defaultStyles.colors.or} />}
                </View>
                <AppText style={styles.label}>{item.name}</AppText>
            </View>
            </TouchableOpacity>
            <TouchableWithoutFeedback onPress={onSelectReseau}>
                <Image resizeMode='stretch' source={item.image} style={styles.image}/>
            </TouchableWithoutFeedback>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      marginVertical: 20
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical:5,
        marginHorizontal: 20
    },

    image: {
        height: 200,
        width: '100%'
    },
    label: {
      marginHorizontal: 20
    },
    selected: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 1
    }
})
export default TransactionItem;