import React from 'react';
import {createStackNavigator} from "@react-navigation/stack";
import MembersListScreen from "../screens/MembersListScreen";
import defaultStyles from "../utilities/styles";
import MemberDetails from "../screens/MemberDetails";
import EditMemberScreen from "../screens/EditMemberScreen";

const MemberNavig = createStackNavigator()

function MembersNavigator(props) {
    return (
        <MemberNavig.Navigator screenOptions={() => ({
            headerStyle: {backgroundColor: defaultStyles.colors.rougeBordeau},
            headerTintColor: defaultStyles.colors.white
        })}>
            <MemberNavig.Screen name='List' component={MembersListScreen} options={() => ({
                title: 'Liste des membres'
            })}/>
            <MemberNavig.Screen name='EditMemberScreen' component={EditMemberScreen} options={() => ({
                title: 'Edition membre'
            })}/>
            <MemberNavig.Screen name='MemberDetails' component={MemberDetails} options={({route}) => ({
                title: 'Membre '+ route.params.username,
            })}/>

        </MemberNavig.Navigator>
    );
}

export default MembersNavigator;