import React from 'react';
import {createStackNavigator, TransitionPresets} from "@react-navigation/stack";
import MemberCompteScreen from "../screens/MemberCompteScreen";
import defaultStyles from "../utilities/styles";
import NavigHeaderButton from "../components/NavigHeaderButton";
import MemberRetraitScreen from "../screens/MemberRetraitScreen";

const MemberCompteNavig = createStackNavigator()

function MemberCompteNavigator(props) {

    return (
        <MemberCompteNavig.Navigator screenOptions={({navigation}) => ({
            headerStyle: {backgroundColor: defaultStyles.colors.rougeBordeau},
            headerTintColor: defaultStyles.colors.white,
            ...TransitionPresets.SlideFromRightIOS

        })}>
            <MemberCompteNavig.Screen name='Compte' component={MemberCompteScreen} options={({navigation}) => ({
                headerLeft: () => null,
                headerRight: () => <NavigHeaderButton
                    title='Accueil'
                    iconName='home'
                    onPress={() => navigation.navigate('Starter', {screen: 'StarterScreen'})}/>
            })}/>

            <MemberCompteNavig.Screen name='MemberRetrait' component={MemberRetraitScreen} options={() => ({
                title: 'Retrait de fonds'
            })}/>
        </MemberCompteNavig.Navigator>
    );
}

export default MemberCompteNavigator;