import React from 'react';
import {createStackNavigator} from "@react-navigation/stack";
import MembersListScreen from "../screens/MembersListScreen";
import defaultStyles from "../utilities/styles";
import MemberDetails from "../screens/MemberDetails";
import EditMemberScreen from "../screens/EditMemberScreen";
import NavigHeaderButton from "../components/NavigHeaderButton";
import useInfo from "../hooks/useInfo";

const MemberNavig = createStackNavigator()

function MembersNavigator(props) {
    const {getMemberInfoPerso} = useInfo()
    return (
        <MemberNavig.Navigator screenOptions={() => ({
            headerStyle: {backgroundColor: defaultStyles.colors.rougeBordeau},
            headerTintColor: defaultStyles.colors.white
        })}>
            <MemberNavig.Screen name='List' component={MembersListScreen} options={() => ({
                title: 'Liste des membres',
                headerLeft: () => null
            })}/>
            <MemberNavig.Screen name='EditMemberScreen' component={EditMemberScreen} options={() => ({
                title: 'Edition membre'
            })}/>
            <MemberNavig.Screen name='MemberDetails' component={MemberDetails} options={({route,navigation}) => ({
                title:''+ getMemberInfoPerso(route.params),
                headerLeft: () => <NavigHeaderButton title='liste' iconName='arrow-left' onPress={() => navigation.navigate('List')}/>
            })}/>

        </MemberNavig.Navigator>
    );
}

export default MembersNavigator;