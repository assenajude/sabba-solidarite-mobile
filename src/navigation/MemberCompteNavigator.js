import React from 'react';
import {createStackNavigator} from "@react-navigation/stack";
import MemberCompteScreen from "../screens/MemberCompteScreen";
import defaultStyles from "../utilities/styles";
import AppText from "../components/AppText";
import {View, TouchableOpacity} from "react-native";
import {MaterialCommunityIcons} from '@expo/vector-icons'
import {useDispatch} from "react-redux";
import {getLogout} from "../store/slices/authSlice";

const MemberCompteNavig = createStackNavigator()

function MemberCompteNavigator(props) {
/*    const dispatch = useDispatch()

    const handleLogout = () => {
        navigation.navigate('Starter')
        // dispatch(getLogout())
    }*/

    return (
        <MemberCompteNavig.Navigator screenOptions={({navigation}) => ({
            headerStyle: {backgroundColor: defaultStyles.colors.rougeBordeau},
            headerTintColor: defaultStyles.colors.white,
            headerRight: () =>
                <TouchableOpacity onPress={() => navigation.navigate('Starter', {screen: 'StarterScreen'})}>
                    <View style={{alignItems: 'center', marginRight: 10}}>
                        <MaterialCommunityIcons name="home" size={24} color={defaultStyles.colors.white} />
                        <AppText style={{color: defaultStyles.colors.white}}>Accueil</AppText>
                    </View>
                </TouchableOpacity>

        })}>
            <MemberCompteNavig.Screen name='Compte' component={MemberCompteScreen}/>
        </MemberCompteNavig.Navigator>
    );
}

export default MemberCompteNavigator;