import React from 'react';
import {StyleSheet} from 'react-native'
import {Searchbar} from "react-native-paper";

function AppSearchBar({value, onChangeText, ...otherProps}) {
    return (
        <Searchbar
            style={styles.style}
            onChangeText={onChangeText}
            value={value}
            {...otherProps}
        />
    );
}

const styles = StyleSheet.create({
    style: {
        marginHorizontal: 20,
        marginVertical: 20
    }
})
export default AppSearchBar;