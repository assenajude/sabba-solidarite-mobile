import React from 'react';
import {createStackNavigator} from "@react-navigation/stack";
import MemberCompteScreen from "../screens/MemberCompteScreen";
import defaultStyles from "../utilities/styles";
import NavigHeaderButton from "../components/NavigHeaderButton";

const MemberCompteNavig = createStackNavigator()

function MemberCompteNavigator(props) {

    return (
        <MemberCompteNavig.Navigator screenOptions={({navigation}) => ({
            headerStyle: {backgroundColor: defaultStyles.colors.rougeBordeau},
            headerTintColor: defaultStyles.colors.white,
            headerRight: () => <NavigHeaderButton
                title='Accueil'
                iconName='home'
                onPress={() => navigation.navigate('Starter', {screen: 'StarterScreen'})}/>

        })}>
            <MemberCompteNavig.Screen name='Compte' component={MemberCompteScreen}/>
        </MemberCompteNavig.Navigator>
    );
}

export default MemberCompteNavigator;