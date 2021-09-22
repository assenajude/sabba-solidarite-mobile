import React from 'react';
import AppAvatar from "./AppAvatar";
import routes from "../navigation/routes";
import AppIconButton from "./AppIconButton";
import defaultStyles from "../utilities/styles";
import {View, StyleSheet} from "react-native";
import colors from "../utilities/colors";
import {useSelector} from "react-redux";
import {useNavigation} from '@react-navigation/native'

function HomeHeader({props}) {
    const navigation = useNavigation()
    const currentUser = useSelector(state => state.auth.user)

    return (
        <View style={styles.header}>
            <AppAvatar
                user={currentUser}
                onPress={() => navigation.navigate(routes.USER_COMPTE, currentUser)}
               />
            <AppIconButton
                onPress={() =>navigation.navigate('Auth', {screen: 'Welcome'})}
                iconColor={defaultStyles.colors.white}
                containerStyle={{
                    backgroundColor: defaultStyles.colors.rougeBordeau
                }}
                iconSize={25}
                iconName='logout'/>
        </View>
    );
}


const styles = StyleSheet.create({
    avatar:{
        height: 30,
        width: 30,
        borderRadius: 15,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 10,
        backgroundColor: colors.rougeBordeau
    },
})
export default HomeHeader;