import React from 'react';
import {createStackNavigator} from "@react-navigation/stack";
import EtatCotisationScreen from "../screens/EtatCotisationScreen";
import defaultStyles from "../utilities/styles";
import NewCotisationScreen from "../screens/NewCotisationScreen";
import MemberCotisationScreen from "../screens/MemberCotisationScreen";
import ListCotisationScreen from "../screens/ListCotisationScreen";
import PayementCotisationScreen from "../screens/PayementCotisationScreen";
import NavigHeaderButton from "../components/NavigHeaderButton";
import useInfo from "../hooks/useInfo";

const CotisationNavig = createStackNavigator()

function CotisationNavigation(props) {
    const {getMemberInfoPerso} = useInfo()

    return (
        <CotisationNavig.Navigator screenOptions={() => ({
            headerStyle: {backgroundColor: defaultStyles.colors.rougeBordeau},
            headerTintColor: defaultStyles.colors.white
        })}>
            <CotisationNavig.Screen name='EtatCotisationScreen' component={EtatCotisationScreen}
                                    options={() => ({
                                        title: 'Etat des cotisations',
                                        headerLeft: () => null
                                    })}/>
            <CotisationNavig.Screen name='NewCotisationScreen' component={NewCotisationScreen}
                                    options={{
                                        title: 'Nouvelle cotisation'
                                    }}/>
            <CotisationNavig.Screen name='ListCotisation' component={ListCotisationScreen}
                                    options={({route, navigation}) => ({
                                        title: 'Liste des cotisations',
                                        headerLeft: () =>
                                            <NavigHeaderButton
                                                iconName='arrow-left' onPress={() => navigation.navigate('EtatCotisationScreen')}/>
                                    })}/>
            <CotisationNavig.Screen name='PayementCotisation' component={PayementCotisationScreen}
                                    options={{
                                        title: 'Payement de cotisation'
                                    }}/>

            <CotisationNavig.Screen name='MemberCotisationScreen' component={MemberCotisationScreen} options={({route, navigation}) => ({
                title: 'Cotisations '+ getMemberInfoPerso(route.params),
            })}/>
        </CotisationNavig.Navigator>
    );
}

export default CotisationNavigation;