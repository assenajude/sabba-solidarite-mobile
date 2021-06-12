import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {MaterialCommunityIcons, FontAwesome5} from '@expo/vector-icons'

import React from 'react';
import MembersNavigator from "./MembersNavigator";
import AssociationNavigator from "./AssociationNavigator";
import CotisationNavigation from "./CotisationNavigation";
import defaultStyles from '../utilities/styles'
import MemberCompteNavigator from "./MemberCompteNavigator";
import EngagementNavigator from "./EngagementNavigator";

const BottomTabNavig = createBottomTabNavigator();

function BottomTabNavigator(props) {
    return (
        <BottomTabNavig.Navigator screenOptions={{
            tabBarActiveTintColor: defaultStyles.colors.rougeBordeau,
            headerShown: false
        }}>
            <BottomTabNavig.Screen name='Association' component={AssociationNavigator}
                              options={{
                                  tabBarIcon: ({color, size}) => (
                                      <MaterialCommunityIcons name='home-account' size={size} color={color}/>
                                  )
                              }}/>
            <BottomTabNavig.Screen name='Members' component={MembersNavigator}
                              options={{
                                  tabBarIcon: ({size, color}) => (
                                      <MaterialCommunityIcons name='account-group' size={size} color={color}/>
                                  )
                              }}/>
            <BottomTabNavig.Screen name='Cotisations' component={CotisationNavigation}
                              options={{
                                  tabBarIcon: ({size, color}) => (
                                      <FontAwesome5 name="money-check-alt" size={size} color={color} />
                                  )
                              }}/>
            <BottomTabNavig.Screen name='Engagements' component={EngagementNavigator}
                              options={{
                                  tabBarIcon: ({size, color}) => (
                                      <MaterialCommunityIcons name="card-account-details" size={size} color={color} />
                                  )
                              }}/>
            <BottomTabNavig.Screen name='Moi' component={MemberCompteNavigator} options={{
                tabBarIcon: ({color, size}) => (
                    <MaterialCommunityIcons name='account' size={size} color={color}/>
                )
            }}/>
        </BottomTabNavig.Navigator>
    );
}

export default BottomTabNavigator;