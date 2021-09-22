import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import DepotScreen from "../screens/DepotScreen";
import RetraitScreen from "../screens/RetraitScreen";

const TransactionNavig = createMaterialTopTabNavigator();


function TransactionNavigator({route}) {
    const params = route.params
    return (
        <TransactionNavig.Navigator >
            <TransactionNavig.Screen
                initialParams={params}
                name='Depot'
                component={DepotScreen}
            />
            <TransactionNavig.Screen
                initialParams={params}
                name='Retrait'
                component={RetraitScreen}/>
        </TransactionNavig.Navigator>
    );
}

export default TransactionNavigator;