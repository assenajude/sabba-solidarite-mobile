import React from 'react';
import  {View, StyleSheet} from "react-native";

import defaultStyles from '../utilities/styles'

function ListItemSeparator({width='100%'}) {
    return (
        <View style={[styles.separator, {width: width}]}>
        </View>
    );
}

const styles = StyleSheet.create({
    separator: {
        borderColor: defaultStyles.colors.leger,
        borderWidth: 0.5,
        height: 1,
    }
})
export default ListItemSeparator;