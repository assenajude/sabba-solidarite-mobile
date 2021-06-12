import {createStackNavigator} from '@react-navigation/stack'

const MainNavig = createStackNavigator()

import React from 'react';
import AuthNavigator from "./AuthNavigator";
import BottomTabNavigator from "./BottomTabNavigator";
import StarterNavigator from "./StarterNavigator";

function MainNavigator(props) {
    return (
        <MainNavig.Navigator>
            <MainNavig.Screen name='Auth' component={AuthNavigator} options={{
                headerShown: false
            }}/>
            <MainNavig.Screen name='Starter' component={StarterNavigator} options={{
                headerShown: false
            }}/>
            <MainNavig.Screen name='BottomTab' component={BottomTabNavigator} options={{
                headerShown: false
            }}/>
        </MainNavig.Navigator>
    );
}

export default MainNavigator;