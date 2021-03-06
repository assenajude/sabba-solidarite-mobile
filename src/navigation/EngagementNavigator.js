import React from 'react';
import {createStackNavigator, TransitionPresets} from "@react-navigation/stack";
import EtatEngagementScreen from "../screens/EtatEngagementScreen";
import defaultStyles from "../utilities/styles";
import ListEngagementScreen from "../screens/ListEngagementScreen";
import NewEngagementScreen from "../screens/NewEngagementScreen";
import NewEngagementList from "../screens/NewEngagementList";
import MemberEngagementDetailScreen from "../screens/MemberEngagementDetailScreen";
import EditEngagementScreen from "../screens/EditEngagementScreen";
import NavigHeaderButton from "../components/NavigHeaderButton";
import EngagementVotantScreen from "../screens/EngagementVotantScreen";
import useInfo from "../hooks/useInfo";
import TrancheScreen from "../screens/TrancheScreen";

const EngageNavig = createStackNavigator()

function EngagementNavigator(props) {
    const {getMemberInfoPerso} = useInfo()
    return (
        <EngageNavig.Navigator screenOptions={() =>({
            headerStyle: {backgroundColor: defaultStyles.colors.rougeBordeau},
            headerTintColor: defaultStyles.colors.white,
            ...TransitionPresets.SlideFromRightIOS
        })}>
            <EngageNavig.Screen name='EtatEngagement' component={EtatEngagementScreen} options={() => ({
                title: 'Etat des engagements',
                headerLeft: () => null
            })}/>
            <EngageNavig.Screen name='NewEngagementScreen' component={NewEngagementScreen} options={{
                title: 'Nouvel engagement'
            }}/>
            <EngageNavig.Screen name='ListEngagementScreen' component={ListEngagementScreen} options={({route}) => ({
                title: 'Engagements '+getMemberInfoPerso(route.params),
            })}/>
            <EngageNavig.Screen name='NewEngagementList' component={NewEngagementList} options={({route,navigation}) => ({
                title: 'Engagements en validation',
                headerLeft: () =>
                    <NavigHeaderButton
                        iconName='arrow-left' onPress={() => navigation.navigate('EtatEngagement')}/>
            })}/>

            <EngageNavig.Screen name='MemberEngagementDetail' component={MemberEngagementDetailScreen} options={({route}) => ({
                title: 'D??tails engagement',
            })}/>

            <EngageNavig.Screen name='EditEngagementScreen' component={EditEngagementScreen} options={({route}) => ({
                title: 'Edition engagement',
            })}/>

            <EngageNavig.Screen name='Votants' component={EngagementVotantScreen} options={({route}) => ({
                title: 'Ils ont dej?? vot??',
            })}/>

            <EngageNavig.Screen
                name='TrancheScreen'
                component={TrancheScreen}
                options={({route}) => ({
                title: 'Tranches Payement',
            })}/>
        </EngageNavig.Navigator>
    );
}

export default EngagementNavigator;