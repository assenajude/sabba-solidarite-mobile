import React from 'react';
import {createStackNavigator} from "@react-navigation/stack";
import UserCompteScreen from "../screens/UserCompteScreen";
import StarterScreen from "../screens/StarterScreen";
import ListAssociationScreen from "../screens/ListAssociationScreen";
import NewAssociationScreen from "../screens/NewAssociationScreen";
import EditUserCompteScreen from "../screens/EditUserCompteScreen";
import AssociationDetailScreen from "../screens/AssociationDetailScreen";
import NewTransactionScreen from "../screens/NewTransactionScreen";
import TransactionDetailScreen from "../screens/TransactionDetailScreen";
import ValidationTransacDetailScreen from "../screens/ValidationTransacDetailScreen";
import EditTransactionScreen from "../screens/EditTransactionScreen";
import TransactionNavigator from "./TransactionNavigator";
import {TouchableOpacity, View} from "react-native";
import routes from "./routes";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import defaultStyles from "../utilities/styles";
import AppText from "../components/AppText";
import {useSelector} from "react-redux";
import HelpScreen from "../screens/HelpScreen";
import NavigHeaderButton from "../components/NavigHeaderButton";
import SelectedTransactionReseauScreen from "../screens/SelectedTransactionReseauScreen";
import ParamScreen from "../screens/ParamScreen";

const StarterNavig = createStackNavigator()

function StarterNavigator() {
    const currentUser = useSelector(state => state.auth.user)


    return (
        <StarterNavig.Navigator screenOptions={() => ({
            headerStyle: {backgroundColor: defaultStyles.colors.rougeBordeau},
            headerTintColor: defaultStyles.colors.white,
        })}>
            <StarterNavig.Screen name='StarterScreen' component={StarterScreen} options={({navigation}) => ({
                title: 'Accueil',
                headerLeft: () =>null,
                headerShown: false,
                headerRight: () =>
                    <TouchableOpacity onPress={() => navigation.navigate('Auth', {screen: 'Welcome'})
                    }>
                        <View style={{alignItems: 'center', marginRight: 10}}>
                            <MaterialCommunityIcons name="logout" size={24} color={defaultStyles.colors.white} />
                            <AppText style={{color: defaultStyles.colors.white}}>se deconnecter</AppText>
                        </View>
                    </TouchableOpacity>
            })}/>
            <StarterNavig.Screen name='UserCompte' component={UserCompteScreen} options={({navigation}) =>({
                headerLeft: () => <NavigHeaderButton
                    onPress={() => navigation.navigate("StarterScreen")}
                    title='Liste'
                    iconName='arrow-left'/>,
                title: 'Portefeuille'
            })}/>
            <StarterNavig.Screen name='HelpScreen' component={HelpScreen} options={{title:"Besoin d'aide?"}}/>
            <StarterNavig.Screen name='ListAssociationScreen' component={ListAssociationScreen} options={{title:'Toutes les associations'}}/>
            <StarterNavig.Screen name='NewAssociationScreen' component={NewAssociationScreen} options={{title:'Nouvelle association'}}/>
            <StarterNavig.Screen name='EditUserCompte' component={EditUserCompteScreen} options={{title:'Edition du compte'}}/>
            <StarterNavig.Screen name='AssociationDetailScreen' component={AssociationDetailScreen}
                              options={({route, navigation}) =>({
                                  title: route.params.nom,
                                  headerTitleStyle:{maxWidth: 130},
                                  headerLeft: () => <NavigHeaderButton
                                      onPress={() => navigation.navigate(routes.ASSOCIATION_LIST)}
                                      title='Liste'
                                      iconName='arrow-left'/>,
                                  headerRight: () => <NavigHeaderButton
                                      onPress={() => navigation.navigate('StarterScreen')}
                                      title='Accueil'
                                      iconName='home'/>
                              })}/>
            <StarterNavig.Screen
                name='NewTransaction'
                component={NewTransactionScreen}
                options={({route}) => ({
                    title: route.params?.typeTrans
                })}/>
            <StarterNavig.Screen
                name='TransactionDetail'
                component={TransactionDetailScreen}
                options={({route}) => ({
                    title: 'Detail '+ route.params?.mode
                })}/>

                <StarterNavig.Screen
                name='SelectedReseau'
                component={SelectedTransactionReseauScreen}
                options={({route}) => ({
                    title: route.params.isRetrait?`Retrait ${route.params.name}`:`Depot ${route.params.name}`
                })}/>
            <StarterNavig.Screen
                name='ValidationTransacDetail'
                component={ValidationTransacDetailScreen}
                options={({route,navigation}) => ({
                    title: route.params.typeTransac.toLowerCase() === 'retrait'?'Detailt retrait':'detail depot',
                    headerLeft: () => <NavigHeaderButton
                        onPress={() => navigation.navigate('Transaction')}
                        title='Liste'
                        iconName='arrow-left'/>,
                    headerRight: () => <NavigHeaderButton
                        onPress={() => navigation.navigate('StarterScreen')}
                        title='Accueil'
                        iconName='home'/>
                })}/>
            <StarterNavig.Screen
                name='EditTransaction'
                component={EditTransactionScreen}
                options={({route}) => ({
                    title: 'Edition '+ route.params.number
                })}/>
                <StarterNavig.Screen
                name='ParamScreen'
                component={ParamScreen}
                options={({route}) => ({
                    title: 'Paramètres'
                })}/>
            <StarterNavig.Screen name='Transaction' component={TransactionNavigator} options={({navigation}) =>({
                title: '',
                headerLeft: () =><NavigHeaderButton
                    onPress={() => navigation.navigate('StarterScreen')}
                    title='Accueil'
                    iconName='home'/>,
                headerRight: () =><NavigHeaderButton
                    onPress={() => navigation.navigate(routes.USER_COMPTE, currentUser)}
                    title='Portefeuille' iconName='wallet'/>
            })}/>

        </StarterNavig.Navigator>
    );
}

export default StarterNavigator;