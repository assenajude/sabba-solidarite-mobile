import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import DepotScreen from "../screens/DepotScreen";
import RetraitScreen from "../screens/RetraitScreen";

const TransactionNavig = createMaterialTopTabNavigator();


function TransactionNavigator(props) {
    return (
        <TransactionNavig.Navigator>
            <TransactionNavig.Screen name='Depot' component={DepotScreen}/>
            <TransactionNavig.Screen name='Retrait' component={RetraitScreen}/>
        </TransactionNavig.Navigator>
    );
}

export default TransactionNavigator;