import React, {useEffect, useState} from 'react';
import {View, TouchableOpacity, StyleSheet, ScrollView, Alert} from "react-native";
import {useDispatch, useSelector, useStore} from "react-redux";
import {MaterialCommunityIcons} from '@expo/vector-icons'
import AppText from "../components/AppText";
import defaultStyles from '../utilities/styles'
import LottieView from "lottie-react-native";
import useManageAssociation from "../hooks/useManageAssociation";
import ListItemSeparator from "../components/ListItemSeparator";
import FondsLabel from "../components/association/FondsLabel";
import AppLinkButton from "../components/AppLinkButton";
import useCotisation from "../hooks/useCotisation";
import useEngagement from "../hooks/useEngagement";
import routes from "../navigation/routes";
import AssociationBackImage from "../components/association/AssociationBackImage";
import AppActivityIndicator from "../components/AppActivityIndicator";
import {getAvatarUpdate, getSelectedAssociation, getStateUpdate} from "../store/slices/associationSlice";
import AppReglement from "../components/AppReglement";
import AppButton from "../components/AppButton";
import SubInfo from "../components/association/SubInfo";

function DashboardScreen({navigation}) {
    const dispatch = useDispatch()
    const store = useStore()
    const {formatFonds,getNewAdhesion,getManagedAssociationFund, associationValidMembers} = useManageAssociation()
    const {getCurrentAssoCotisations} = useCotisation()
    const {getAssociationEngagementTotal} = useEngagement()

    const currentAssociation = useSelector(state => state.entities.association.selectedAssociation)
    const isLoading = useSelector(state => state.entities.association.loading)

    const notReadInfo = useSelector(state => {
        const list = state.entities.member.memberInfos
        const notRead = list.filter(info => info.member_info.isRead === false)
        return notRead
    })

    const [showDescrip, setShowDescrip] = useState(false)

    const handleChangeImage = async (result) => {
        if(!result) {
            return alert("Impossible d'enregistrer l'image, veuillez reessayer plutard.")
        }
        const avatarSignedUrl = store.getState().uploadImage.signedRequestArray
        const avatarUrl = avatarSignedUrl[0].url
        await dispatch(getAvatarUpdate({associationId: currentAssociation.id, avatarUrl: avatarUrl}))
        const error = store.getState().entities.association.error
        if(error !== null) {
            return alert("Nous avons rencontré une erreur. Veuillez reessayer plutard.")
        }
        alert("Votre association a été mise à jour avec succsès.")
    }

    useEffect(() => {
        navigation.addListener('beforeRemove', (e) => {
            e.preventDefault();
            Alert.alert(
                'Alert!',
                "Etes-vous sûr d'aller à l'accueil?",
                [
                    { text: "Non", style: 'cancel', onPress: () => {} },
                    {
                        text: 'Oui',
                        style: 'destructive',
                        onPress: () => {
                            navigation.dispatch(e.data.action)
                        },
                    },
                ]
            );
        })
        const unsubscribe = navigation.addListener('focus', async () => {
            const mustUpdate = store.getState().entities.association.updating
                await dispatch(getSelectedAssociation({associationId: currentAssociation.id}))
            if(mustUpdate) {
                dispatch(getStateUpdate({updating: false}))
            }
        })
        return unsubscribe
    }, [])

    return (
        <>
            <AppActivityIndicator visible={isLoading}/>
            <ScrollView contentContainerStyle={{
                paddingBottom: 50
            }}>
            <AssociationBackImage
                imageLoading={currentAssociation.imageLoading}
                association={currentAssociation}
                uploadResult={handleChangeImage}/>
                <View style={styles.descriptionContainer}>
                    <View>
                        <TouchableOpacity onPress={() => setShowDescrip(!showDescrip)}>
                        <View
                            style={{
                                flexDirection: 'row',
                                margin: 20
                            }}>

                                {!showDescrip && <MaterialCommunityIcons name="chevron-right" size={24} color="black" />}
                                {showDescrip && <MaterialCommunityIcons name="chevron-down" size={24} color="black" />}

                            <AppText
                                style={{
                                    fontWeight: 'bold',
                                    marginLeft: 5,
                                }}>Description</AppText>
                        </View>
                        </TouchableOpacity>
                        {showDescrip && <View style={{
                            paddingHorizontal: 20
                        }}>
                            <AppText>{currentAssociation.description}</AppText>
                        </View>}
                    </View>

                </View>
                <View style={styles.subInfo}>
                    <SubInfo
                        label='CM'
                        value={currentAssociation.cotisationMensuelle}/>
                    <SubInfo
                        label='TI'
                        value={currentAssociation.interetCredit+'%'}/>
                    <SubInfo
                        label='PM'
                        value={currentAssociation.penality+'%'}
                    />

                    <SubInfo
                        label='QI'
                        value={currentAssociation.individualQuotite ===0?100+'%' : currentAssociation.individualQuotite+'%'}
                    />
                </View>
                <View elevation={10} style={styles.fondsContainer}>
                    <View>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', padding:10 }}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <MaterialCommunityIcons name="credit-card" size={24} color={defaultStyles.colors.vert}/>
                        <AppText style={{color: defaultStyles.colors.vert}}>Solde</AppText>
                        </View>
                        <LottieView style={{ width: 100}} autoPlay={true} loop={true} source={require('../../assets/animations/money')}/>
                    </View>
                        <View style={{alignItems: 'center', marginBottom: 20}}>
                            <AppText style={{color: defaultStyles.colors.vert, fontSize: 20}}>{formatFonds(currentAssociation.fondInitial)}</AppText>
                        </View>
                    </View>
                    <View style={{alignItems: 'center'}}>
                        <ListItemSeparator width='50%'/>
                    </View>
                    <View style={{justifyContent: 'flex-start', paddingVertical: 20, paddingHorizontal: 10}}>

                            <FondsLabel label='Cotisations' value={getCurrentAssoCotisations()?.total}/>
                            <FondsLabel label='Invests'
                                        value={getManagedAssociationFund().investAmount} labelStyle={{color: defaultStyles.colors.orange}}
                                        valueStyle={{color: defaultStyles.colors.orange}}
                                        icon='credit-card-clock' iconColor={defaultStyles.colors.orange}/>

                            <FondsLabel label='Gains' labelStyle={{color: defaultStyles.colors.vert}}
                                        value={getManagedAssociationFund().gain} valueStyle={{color: defaultStyles.colors.vert}}
                                        icon='credit-card-plus' iconColor={defaultStyles.colors.vert}/>
                            <FondsLabel label='Depenses' labelStyle={{color: defaultStyles.colors.rougeBordeau}}
                                        value={getManagedAssociationFund().depenseAmount} valueStyle={{color: defaultStyles.colors.rougeBordeau}}
                                        icon='credit-card-minus' iconColor={defaultStyles.colors.rougeBordeau}/>

                            <FondsLabel label='Quotité' labelStyle={{color: defaultStyles.colors.dark}}
                                        value={getManagedAssociationFund().quotite} valueStyle={{color: defaultStyles.colors.dark}}
                                        icon='credit-card' iconColor={defaultStyles.colors.dark}/>

                    </View>

                </View>

                <View style={styles.linkContainer}>
                    <AppLinkButton label='Members'
                                   labelLength={associationValidMembers().members?.length}
                                   onPress={() => navigation.navigate('Members')}/>
                    <AppLinkButton label='Cotisations'
                                   labelLength={getCurrentAssoCotisations()?.cotisLenght}
                                   totalAmount={getCurrentAssoCotisations()?.total}
                                   onPress={() => navigation.navigate('Cotisations')}/>

                    <AppLinkButton label='Engagements'
                                   labelLength={getAssociationEngagementTotal().engagementLenght}
                                   totalAmount={getAssociationEngagementTotal().total}
                                   onPress={() => navigation.navigate('Engagements')}/>
                </View>
                <View style={{
                    marginHorizontal: 20
                }}>
                    <View style={{marginVertical: 10}}>
                        <AppButton
                            style={{alignSelf: 'flex-start'}}
                            onPress={() => navigation.navigate('NEWS')}
                            title='News'
                            iconName='newspaper-variant-outline'
                            mode='text'
                        />
                    {notReadInfo.length>0 && <View style={styles.notReadInfo}>
                        <AppText style={{color: defaultStyles.colors.rougeBordeau}}>{notReadInfo.length}</AppText>
                    </View>}
                    </View>
                    <View>
                        <AppButton
                            onPress={() => navigation.navigate(routes.NEW_ADHESION)}
                            iconName='account-multiple-plus'
                            style={{alignSelf: 'flex-start'}}
                            mode='text'
                            title='Nouvelle adhesion'
                        />
                        {getNewAdhesion().length>0 && <View style={styles.newAdhesionLenght}>
                            <AppText style={{color: defaultStyles.colors.rougeBordeau}}>{getNewAdhesion().length}</AppText>
                        </View>}
                    </View>
                </View>
                <AppReglement containerStyle={{marginHorizontal: 20}} association={currentAssociation}/>
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    adhesion: {
      color: defaultStyles.colors.bleuFbi,
        marginLeft: 10
    },
    image: {
        height: 200,
        width: '100%'
    },
    descriptionContainer:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 20
    },
    fondsContainer: {
        borderWidth: 4,
        borderColor: defaultStyles.colors.or,
        borderRadius: 30,
        backgroundColor: defaultStyles.colors.white,
        margin: 10
    },
    fondsText: {
      fontSize: 15,
        margin : 5
    },
    link: {
        borderWidth: 1,
        borderColor: defaultStyles.colors.bleuFbi,
        width: '100%',
        padding: 20,
        alignItems: 'center',
        backgroundColor: defaultStyles.colors.white,
        marginVertical: 20,
        borderRadius: 10
    },
    linkText: {
      fontWeight: 'bold',
      fontSize: 20,
      color: defaultStyles.colors.bleuFbi
    },
    linkContainer: {
        alignItems: 'center',
        marginHorizontal: 10
    },
    notReadInfo: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        left: '20%',
        top: -8,
      width: 20,
      height: 20,
      borderRadius:10,
        backgroundColor: defaultStyles.colors.white
    },
    newAdhesionLenght: {
        alignItems: 'center',
        justifyContent: 'center',
      position: 'absolute',
      left: '48%',
      top:-5,
        backgroundColor: defaultStyles.colors.white,
        width: 20,
        height: 20,
        borderRadius: 10,
    },
    secondFonds: {
        flexDirection: 'row',
    },
    subInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
        marginHorizontal: 10,
        justifyContent: 'space-around'
    }
})
export default DashboardScreen;