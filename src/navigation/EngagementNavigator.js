import React from 'react';
import {createStackNavigator} from "@react-navigation/stack";
import EtatEngagementScreen from "../screens/EtatEngagementScreen";
import defaultStyles from "../utilities/styles";
import ListEngagementScreen from "../screens/ListEngagementScreen";
import NewEngagementScreen from "../screens/NewEngagementScreen";
import NewEngagementList from "../screens/NewEngagementList";
import MemberEngagementDetailScreen from "../screens/MemberEngagementDetailScreen";

const EngageNavig = createStackNavigator()

function EngagementNavigator(props) {
    return (
        <EngageNavig.Navigator screenOptions={() =>({
            headerStyle: {backgroundColor: defaultStyles.colors.rougeBordeau},
            headerTintColor: defaultStyles.colors.white
        })}>
            <EngageNavig.Screen name='EtatEngagement' component={EtatEngagementScreen} options={{
                title: 'Etat des engagements'
            }}/>
            <EngageNavig.Screen name='NewEngagementScreen' component={NewEngagementScreen} options={{
                title: 'Nouvel engagement'
            }}/>
            <EngageNavig.Screen name='ListEngagementScreen' component={ListEngagementScreen} options={({route}) => ({
                title: 'Engagements de '+route.params?.username,
            })}/>
            <EngageNavig.Screen name='NewEngagementList' component={NewEngagementList} options={({route}) => ({
                title: 'Engagements en validation',
            })}/>

            <EngageNavig.Screen name='MemberEngagementDetail' component={MemberEngagementDetailScreen} options={({route}) => ({
                title: 'Détails engagement',
            })}/>
        </EngageNavig.Navigator>
    );
}

export default EngagementNavigator;