import React, {useCallback, useEffect, useState} from 'react';
import {View, StyleSheet,Alert,ScrollView} from "react-native";
import AppText from "../components/AppText";
import {useDispatch, useSelector} from "react-redux";
import routes from "../navigation/routes";
import AssociationItem from "../components/association/AssociationItem";
import {setSelectedAssociation} from "../store/slices/associationSlice";
import AppActivityIndicator from "../components/AppActivityIndicator";
import defaultStyles from '../utilities/styles'
import useAuth from "../hooks/useAuth";
import useManageAssociation from "../hooks/useManageAssociation";
import AppButton from "../components/AppButton";
import {getLogout, getNotificationTokenUpdate, getUserAllUsers} from "../store/slices/authSlice";
import {getPopulateReseauList, getUserTransactions} from "../store/slices/transactionSlice";
import {reseauData} from "../utilities/reseau.data";
import useNotification from "../hooks/useNotification";
import HomeHeader from "../components/HomeHeader";

function StarterScreen({navigation}) {
    const dispatch = useDispatch()
    const {registerForPushNotificationsAsync} = useNotification()
    const {isAdmin, getInitAssociation} = useAuth()
    const {getMemberRelationType, deleteAssociation, sendAdhesionMessageToAssociation} = useManageAssociation()

    const currentUser = useSelector(state => state.auth.user)
    const assoLoading = useSelector(state => state.entities.association.loading)
    const allAssociations = useSelector(state => state.entities.association.list)
    const memberLoading = useSelector(state => state.entities.member.loading)
    const memberAssociations = useSelector(state => state.entities.member.userAssociations)
    const updated = useSelector(state => state.entities.association.updated)
    const [dataTabOne, setDataTabOne] = useState([])
    const [dataTabTwo, setDataTabTwo] = useState([])
    const data = isAdmin()?allAssociations : memberAssociations

    const getStartedData = () => {
        const tab1 = []
        const tab2 = []
        for(let i = 0; i<data.length; i++) {
            const item = data[i];
            if(i===0) {
                tab1.push(item)
            }else if(i===1) {
                tab2.push(item)
            }else {
                if(i % 2 === 0) {
                    tab1.push(item)
                }else tab2.push(item)
            }
        }
        setDataTabOne(tab1)
        setDataTabTwo(tab2)
    }



    const getInit = useCallback(() => {
        if(isAdmin()) {
            dispatch(getUserAllUsers())
        }
        dispatch(getPopulateReseauList(reseauData))
        dispatch(getUserTransactions({creatorId: currentUser.id}))
    }, [])

    const handleGoToDashboard = async (association) => {
        const isMember = getMemberRelationType(association).toLowerCase() === 'member'
        const isOnLeave = getMemberRelationType(association).toLowerCase() === 'onleave'

        if(isMember || isOnLeave || isAdmin()) {
        dispatch(setSelectedAssociation(association))
            await getInitAssociation(association)
            navigation.navigate('BottomTab')
        } else
            Alert.alert("Info","Vous n'êtes pas encore membre de cette association. Si vous avez déjà envoyé la demande, vous pouvez contacter l'administrateur de cette association pour qu'il vous accepte.", [{
                text: 'Contacter', onPress: () => navigation.navigate(routes.ASSOCIATION_DETAILS, association)
            }, {
                text: 'Retour', onPress: () => null
            }])
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
        getStartedData()
        const unsubscribe = navigation.addListener('beforeRemove', (e) => {
            e.preventDefault();
            Alert.alert(
                'Alert!',
                'Etes-vous sûr de vous deconnecter?',
                [
                    { text: "Non", style: 'cancel', onPress: () => {return;}},
                    {
                        text: 'Me deconnecter',
                        style: 'destructive',
                        onPress: () => {
                            navigation.dispatch(e.data.action)
                            dispatch(getLogout())
                        },
                    },
                ]
            );
        })
        return unsubscribe
    }, [navigation, updated, data])


    return (
        <>
            <AppActivityIndicator visible={assoLoading || memberLoading}/>
            <HomeHeader/>
            <ScrollView style={{
                paddingBottom: 50
            }}>
            <View style={styles.links}>

                    <View style={styles.firstLink}>
                        <AppButton
                            onPress={() => navigation.navigate(routes.TRANSACTION)}
                            mode="text"
                            labelStyle={{color: defaultStyles.colors.white}}
                            iconName='credit-card-multiple'
                            title='Transactions'
                        />
                        <AppButton
                            mode='text'
                            labelStyle={{
                                color: defaultStyles.colors.white
                            }}
                            title="Besoin d'aide"
                            onPress={() => navigation.navigate(routes.HELP)}
                            iconName='help-circle'
                        />

                    </View>
                        <AppButton
                            mode='text'
                            labelStyle={{
                                color: defaultStyles.colors.white
                            }}
                            style={{
                                alignSelf: 'center',
                                marginVertical: 10,
                            }}
                            iconName='account-group'
                            title='Associations'
                            onPress={() => navigation.navigate(routes.ASSOCIATION_LIST)}/>

            </View>
            {data.length === 0 &&
            <View style={styles.emptyStyle}>
                <View style={{
                    marginHorizontal: 40
                }}>
                    <AppText style={{marginBottom: 10}}>Vous n'êtes pas encore membre d'associations.</AppText>
                </View>
                <AppButton
                    style={{
                        width: 300,
                        marginTop: 50
                    }}
                    iconName="account-group"
                    title='Adherer maintenant'
                    onPress={() =>navigation.navigate(routes.ASSOCIATION_LIST)}/>
            </View>}

            {data.length > 0 &&
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignSelf: 'center'
            }}>
                <View>
                {dataTabOne.map((item, index) =>
                    <AssociationItem
                        key={index.toString()}
                    sendAdhesionMessage={() => sendAdhesionMessageToAssociation(item)}
                    deleteSelected={() => deleteAssociation(item)}
                    association={item}
                    relationType={getMemberRelationType(item)}
                    isMember={memberAssociations.some(association => association.id === item.id)}
                    onPress={() => handleGoToDashboard(item)}
                    nameStyle={{color: defaultStyles.colors.bleuFbi}}
                />)}
                </View>
                <View>
                {dataTabTwo.map((item, index) =>
                    <AssociationItem
                        key={index.toString()}
                    sendAdhesionMessage={() => sendAdhesionMessageToAssociation(item)}
                    deleteSelected={() => deleteAssociation(item)}
                    association={item}
                    relationType={getMemberRelationType(item)}
                    isMember={memberAssociations.some(association => association.id === item.id)}
                    onPress={() => handleGoToDashboard(item)}
                    nameStyle={{color: defaultStyles.colors.bleuFbi}}
                />)}
                </View>
            </View>
            }
            </ScrollView>
            </>
    );
}

const styles = StyleSheet.create({
    emptyStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center'
    },

    headerShower:{
        position: 'absolute',
        bottom: -20,
        alignSelf: 'center',
        backgroundColor: defaultStyles.colors.rougeBordeau,
        paddingHorizontal: 0,
        justifyContent: 'flex-end',
        borderWidth: 1,
        borderColor: defaultStyles.colors.white
    },
    firstLink:{
        flexDirection:'row',
        justifyContent: 'space-between',
        marginVertical:20,
        marginHorizontal: 10
    },
    showMore: {
        width: 80,
        height: 40,
        borderWidth: 1,
        backgroundColor: defaultStyles.colors.rougeBordeau,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: defaultStyles.colors.white,
        alignSelf: 'center'
    },
    links: {
        height: 'auto',
        paddingVertical: 20,
        backgroundColor: defaultStyles.colors.rougeBordeau,
        marginBottom: 20
    }
})

export default StarterScreen;