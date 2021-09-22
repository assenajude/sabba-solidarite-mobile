import React from 'react';
import {createStackNavigator} from "@react-navigation/stack";

import WelcomeScreen from "../screens/WelcomeScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";

import defaultStyles from '../utilities/styles'
import CodeLoginScreen from "../screens/CodeLoginScreen";
import CodeRegisterScreen from "../screens/CodeRegisterScreen";
import CguScreen from "../screens/CguScreen";

const AuthNavig = createStackNavigator()


function AuthNavigator(props) {
    return (
        <AuthNavig.Navigator
            screenOptions={() => ({
                headerStyle: {backgroundColor: defaultStyles.colors.rougeBordeau},
                headerTintColor: defaultStyles.colors.white,
            })}>
            <AuthNavig.Screen name='Welcome' component={WelcomeScreen} options={{headerTitle:'Bienvenue', headerTitleAlign: 'center'}}/>
            <AuthNavig.Screen
                name='CguScreen'
                component={CguScreen}
                options={({route, navigation}) =>({
                    title: "Terms & Conditions",
                    headerTitleAlign: 'center'
                })}/>
            <AuthNavig.Screen name='LoginScreen' component={LoginScreen} options={{title:'Connectez-vous'}}/>
            <AuthNavig.Screen name='RegisterScreen' component={RegisterScreen} options={{title:'Créer votre compte'}}/>
            <AuthNavig.Screen  name='CodeLogin' component={CodeLoginScreen} options={{
                title: 'Connexion code secret',
            }}/>
            <AuthNavig.Screen name="CodeRegister" component={CodeRegisterScreen} options={{
                title: 'Compte Code secret'
            }}/>
        </AuthNavig.Navigator>
    );
}

export default AuthNavigator;