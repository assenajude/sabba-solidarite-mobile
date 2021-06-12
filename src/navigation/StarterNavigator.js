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
import {TouchableOpacity, TouchableWithoutFeedback, View} from "react-native";
import routes from "./routes";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import defaultStyles from "../utilities/styles";
import AppText from "../components/AppText";
import {useDispatch} from "react-redux";
import {getLogout} from "../store/slices/authSlice";
import HelpScreen from "../screens/HelpScreen";

const StarterNavig = createStackNavigator()

function StarterNavigator() {
    const dispatch = useDispatch()


    return (
        <StarterNavig.Navigator screenOptions={() => ({
            headerStyle: {backgroundColor: defaultStyles.colors.rougeBordeau},
            headerTintColor: defaultStyles.colors.white,
        })}>
            <StarterNavig.Screen name='StarterScreen' component={StarterScreen} options={({navigation}) => ({
                title: 'Accueil',
                headerRight: () =>
                    <TouchableOpacity onPress={() => {
                        dispatch(getLogout())
                        navigation.navigate('Auth', {screen: 'Welcome'})

                    }}>
                        <View style={{alignItems: 'center', marginRight: 10}}>
                            <MaterialCommunityIcons name="logout" size={24} color={defaultStyles.colors.white} />
                            <AppText style={{color: defaultStyles.colors.white}}>se deconnecter</AppText>
                        </View>
                    </TouchableOpacity>
            })}/>
            <StarterNavig.Screen name='UserCompte' component={UserCompteScreen} options={{title:'Compte utilisateur'}}/>
            <StarterNavig.Screen name='HelpScreen' component={HelpScreen} options={{title:"Besoin d'aide?"}}/>
            <StarterNavig.Screen name='ListAssociationScreen' component={ListAssociationScreen} options={{title:'Toutes les associations'}}/>
            <StarterNavig.Screen name='NewAssociationScreen' component={NewAssociationScreen} options={{title:'Nouvelle association'}}/>
            <StarterNavig.Screen name='EditUserCompte' component={EditUserCompteScreen} options={{title:'Edition du compte'}}/>
            <StarterNavig.Screen name='AssociationDetailScreen' component={AssociationDetailScreen}
                              options={({route}) =>({
                                  title: route.params.nom + ' infos'
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
                name='ValidationTransacDetail'
                component={ValidationTransacDetailScreen}
                options={({route}) => ({
                    title: 'Transaction '+ route.params.number
                })}/>
            <StarterNavig.Screen
                name='EditTransaction'
                component={EditTransactionScreen}
                options={({route}) => ({
                    title: 'Edition '+ route.params.number
                })}/>
            <StarterNavig.Screen name='Transaction' component={TransactionNavigator} options={({navigation}) =>({
                title: 'Transactions',
                headerRight: () =>
                    <TouchableWithoutFeedback onPress={() => navigation.navigate(routes.USER_COMPTE)}>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginHorizontal: 5
                        }}>
                            <MaterialCommunityIcons name="wallet" size={24} color={defaultStyles.colors.white} />
                            <AppText style={{color: defaultStyles.colors.white}}>portefeuille</AppText>
                        </View>
                    </TouchableWithoutFeedback>
            })}/>

        </StarterNavig.Navigator>
    );
}

export default StarterNavigator;