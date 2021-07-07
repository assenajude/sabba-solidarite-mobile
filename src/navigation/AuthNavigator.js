import React from 'react';
import {createStackNavigator} from "@react-navigation/stack";

import WelcomeScreen from "../screens/WelcomeScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";

import defaultStyles from '../utilities/styles'
import CodeLoginScreen from "../screens/CodeLoginScreen";
import CodeRegisterScreen from "../screens/CodeRegisterScreen";

const AuthNavig = createStackNavigator()


function AuthNavigator(props) {
    return (
        <AuthNavig.Navigator
            screenOptions={() => ({
                headerStyle: {backgroundColor: defaultStyles.colors.rougeBordeau},
                headerTintColor: defaultStyles.colors.white,
            })}>
            <AuthNavig.Screen name='Welcome' component={WelcomeScreen} options={{headerTitle:'Bienvenue', headerTitleAlign: 'center'}}/>
            <AuthNavig.Screen name='LoginScreen' component={LoginScreen} options={{title:'Connectez-vous'}}/>
            <AuthNavig.Screen name='RegisterScreen' component={RegisterScreen} options={{title:'Créer votre compte'}}/>
            <AuthNavig.Screen  name='CodeLogin' component={CodeLoginScreen} options={{
                headerShown: false,
            }}/>
            <AuthNavig.Screen name="CodeRegister" component={CodeRegisterScreen} options={{
                headerShown: false
            }}/>
        </AuthNavig.Navigator>
    );
}

export default AuthNavigator;