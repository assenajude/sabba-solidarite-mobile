import React, {useCallback, useEffect, useState} from 'react';
import {View, StyleSheet, TouchableWithoutFeedback, FlatList, TouchableOpacity, Alert} from "react-native";
import {MaterialCommunityIcons} from '@expo/vector-icons'
import AppText from "../components/AppText";
import {useDispatch, useSelector} from "react-redux";
import routes from "../navigation/routes";
import AssociationItem from "../components/association/AssociationItem";
import {setSelectedAssociation} from "../store/slices/associationSlice";
import AppActivityIndicator from "../components/AppActivityIndicator";
import defaultStyles from '../utilities/styles'
import useAuth from "../hooks/useAuth";
import ListItemSeparator from "../components/ListItemSeparator";
import useManageAssociation from "../hooks/useManageAssociation";
import AppButton from "../components/AppButton";
import {getLogout, getNotificationTokenUpdate, getUserAllUsers} from "../store/slices/authSlice";
import {getPopulateReseauList, getUserTransactions} from "../store/slices/transactionSlice";
import {reseauData} from "../utilities/reseau.data";
import useNotification from "../hooks/useNotification";

function StarterScreen({navigation}) {
    const dispatch = useDispatch()
    const {registerForPushNotificationsAsync} = useNotification()
    const {isAdmin, getInitAssociation} = useAuth()
    const {getMemberRelationType} = useManageAssociation()

    const currentUser = useSelector(state => state.auth.user)
    const assoLoading = useSelector(state => state.entities.association.loading)
    const memberLoading = useSelector(state => state.entities.member.loading)
    const memberAssociations = useSelector(state => state.entities.member.userAssociations)

    const loading = assoLoading || memberLoading

    const [showLinks, setShowLinks] = useState(true)


    const getInit = useCallback(() => {
        if(isAdmin()) {
            dispatch(getUserAllUsers())
        }
        dispatch(getPopulateReseauList(reseauData))
        dispatch(getUserTransactions({userId: currentUser.id}))
    }, [])

    const handleGoToDashboard = async (association) => {
        const isMember = getMemberRelationType(association).toLowerCase() === 'member'
        const isOnLeave = getMemberRelationType(association).toLowerCase() === 'onleave'

        if(isMember || isOnLeave || isAdmin()) {
        dispatch(setSelectedAssociation(association))
            await getInitAssociation(association)
            navigation.navigate('BottomTab')
        } else
            alert("Vous n'êtes pas encore membre de cette association")
    }

    const getNotifToken = async () => {
        const notifToken = await registerForPushNotificationsAsync()
        const oldToken = currentUser.pushNotificationToken
        if(oldToken && oldToken === notifToken) {
            return ;
        } else {
        if (notifToken && notifToken !== '') {
            dispatch(getNotificationTokenUpdate({userId: currentUser.id, notificationToken: notifToken}))
        }
        }
    }




    useEffect(() => {
        getNotifToken()
        getInit()
        setTimeout(() => {
            setShowLinks(false)
        }, 2000)
        navigation.addListener('beforeRemove', (e) => {
            e.preventDefault();
            Alert.alert(
                'Alert!',
                'Etes-vous sûr de vous deconnecter?',
                [
                    { text: "Non", style: 'cancel', onPress: () => {} },
                    {
                        text: 'Me deconnecter',
                        style: 'destructive',
                        onPress: () => {
                            dispatch(getLogout())
                            navigation.dispatch(e.data.action)
                        },
                    },
                ]
            );
        })
    }, [navigation])


    return (
        <>
            <AppActivityIndicator visible={assoLoading || memberLoading}/>
            <View>
                <View style={{
                    alignItems: 'center',
                    marginBottom:showLinks?0:20
                }}>
                    <TouchableOpacity onPress={() => setShowLinks(!showLinks)}  style={{backgroundColor: defaultStyles.colors.grey, paddingHorizontal: 10}}>
                       {!showLinks && <MaterialCommunityIcons name="chevron-down" size={30} color="black" />}
                       {showLinks && <MaterialCommunityIcons name="chevron-up" size={30} color="black" />}
                    </TouchableOpacity>
                </View>
                {showLinks &&  <View>
                 <View style={{
                    flexDirection:'row',
                    justifyContent: 'space-between',
                    marginVertical:20,
                     marginHorizontal: 10
                }}>
                    <TouchableWithoutFeedback onPress={() => navigation.navigate(routes.USER_COMPTE, currentUser)}>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center'
                        }}>
                            <MaterialCommunityIcons name='account' color="black" size={24}/>
                        <AppText style={{color: defaultStyles.colors.bleuFbi, marginLeft: 5}}>Mon compte</AppText>
                        </View>
                    </TouchableWithoutFeedback>
                     <TouchableWithoutFeedback onPress={() => navigation.navigate(routes.TRANSACTION)}>
                         <View style={{
                             flexDirection: 'row',
                             alignItems: 'center'
                         }}>
                             <MaterialCommunityIcons name="credit-card-multiple" size={24} color="black" />
                             <AppText style={{color:defaultStyles.colors.bleuFbi, marginLeft: 5}}>Mes transactions</AppText>

                         </View>
                     </TouchableWithoutFeedback>

                </View>
                    <View style={{alignItems: 'center',flexDirection: 'row',justifyContent: 'space-between',marginHorizontal:10,marginBottom: 20}}>
                        <TouchableWithoutFeedback onPress={() => navigation.navigate(routes.ASSOCIATION_LIST)}>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center'
                            }}>
                                <MaterialCommunityIcons name='account-group' color="black" size={24}/>
                                <AppText style={{color: defaultStyles.colors.bleuFbi, marginLeft: 5}}>Associations</AppText>
                            </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback onPress={() => navigation.navigate(routes.HELP)}>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center'
                            }}>
                                <MaterialCommunityIcons name="help-circle" size={24} color="black" />
                                <AppText style={{color:defaultStyles.colors.bleuFbi, marginLeft: 5}}>Nous contacter</AppText>

                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </View>}
            </View>
                <ListItemSeparator/>
            {!assoLoading && !memberLoading && memberAssociations.length === 0 && <View style={styles.emptyStyle}>
                <AppText style={{marginBottom: 10}}>Vous n'êtes pas encore membre d'associations.</AppText>
                <AppButton
                    otherButtonStyle={{
                        width: 'auto',
                        height: 30,
                        padding: 5
                    }}
                    title='Adherer maintenant'
                    onPress={() =>navigation.navigate(routes.ASSOCIATION_LIST)}/>
            </View>}

            {!loading && memberAssociations.length > 0 &&
                <FlatList
                    data={memberAssociations}
                    keyExtractor={item => item.id.toString()}
                    numColumns={2}
                    renderItem={({item}) =>
                        <AssociationItem
                            association={item}
                            relationType={getMemberRelationType(item)}
                            isMember={memberAssociations.some(association => association.id === item.id)}
                            onPress={() => handleGoToDashboard(item)}
                            nameStyle={{color: defaultStyles.colors.bleuFbi}}
                        />}
                />
            }

            </>
    );
}

const styles = StyleSheet.create({
    emptyStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default StarterScreen;