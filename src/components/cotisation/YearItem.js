import React from 'react';
import {ScrollView, TouchableOpacity, View, StyleSheet} from "react-native";
import defaultStyles from "../../utilities/styles";
import AppText from "../AppText";

function YearItem({selectYear, isSelected, year}) {
    return (
        <TouchableOpacity onPress={selectYear}>
            <View
                style={[{
                    borderWidth:isSelected?1:0,
                    backgroundColor:isSelected?defaultStyles.colors.bleuFbi:defaultStyles.colors.lightGrey
                },
                    styles.year]}>
                <AppText
                    style={{
                        color: isSelected?defaultStyles.colors.white:defaultStyles.colors.dark,
                        fontWeight:isSelected?'bold':'normal'
                    }}>{year}</AppText>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    year: {
        padding: 5,
        margin:10,
        borderColor:defaultStyles.colors.bleuFbi
    }
})
export default YearItem;