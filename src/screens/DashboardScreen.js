import React, {useState, useEffect, useCallback} from 'react';
import {View,TouchableOpacity,StyleSheet, ScrollView} from "react-native";
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
import AppHeaderGradient from "../components/AppHeaderGradient";
import AssociationBackImage from "../components/association/AssociationBackImage";
import AppActivityIndicator from "../components/AppActivityIndicator";
import useAuth from "../hooks/useAuth";
import {getAvatarUpdate} from "../store/slices/associationSlice";

function DashboardScreen({navigation}) {
    const dispatch = useDispatch()
    const store = useStore()
    const {getInitAssociation} = useAuth()
    const {formatFonds,getNewAdhesion,getManagedAssociationFund, associationValidMembers} = useManageAssociation()
    const {getCurrentAssoCotisations} = useCotisation()
    const {getAssociationEngagementTotal} = useEngagement()

    const currentAssociation = useSelector(state => state.entities.association.selectedAssociation)
    const isLoading = useSelector(state => state.entities.association.loading)
    const infoLoading = useSelector(state => state.entities.information.loading)
    const engagementLoading = useSelector(state => state.entities.engagement.loading)
    const memberLoading = useSelector(state => state.entities.member.loading)
    const cotisationLoading = useSelector(state => state.entities.cotisation.loading)

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

    const getStarted = useCallback(async () => {
        await getInitAssociation(currentAssociation)
    }, [])

    useEffect(() => {
        getStarted()
    }, [])


    return (
        <>
            <AppActivityIndicator visible={isLoading || infoLoading || cotisationLoading || memberLoading || engagementLoading}/>
            <ScrollView>
            <AppHeaderGradient/>
            <AssociationBackImage  association={currentAssociation} uploadResult={handleChangeImage}/>
                <View style={styles.descriptionContainer}>
                    <View>
                        <View
                            style={{
                                flexDirection: 'row',
                                margin: 20
                            }}>
                            <TouchableOpacity onPress={() => setShowDescrip(!showDescrip)}>
                                {!showDescrip && <MaterialCommunityIcons name="plus" size={24} color="black" />}
                                {showDescrip && <MaterialCommunityIcons name="minus" size={24} color="black" />}
                            </TouchableOpacity>
                            <AppText
                                style={{
                                    fontWeight: 'bold',
                                    marginLeft: 5,
                                }}>Description</AppText>
                        </View>
                        {showDescrip && <View style={{
                            paddingHorizontal: 20
                        }}>
                            <AppText>{currentAssociation.description}</AppText>
                        </View>}
                    </View>

                </View>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginVertical: 10,
                    marginHorizontal: 10
                }}>
                    <View style={{alignItems: 'center'}}>
                        <AppText>CM</AppText>
                    <View style={styles.cotisation}>
                        <AppText style={{fontWeight: 'bold'}}>{currentAssociation.cotisationMensuelle}</AppText>
                    </View>
                    </View>
                    <View style={{
                        alignItems: 'center'
                    }}>
                        <AppText>TI</AppText>
                    <View style={styles.cotisation}>
                        <AppText style={{fontWeight: 'bold'}}>{currentAssociation.interetCredit}%</AppText>
                    </View>
                    </View>

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

                    </View>

                </View>

                <View style={styles.linkContainer}>
                    <AppLinkButton label='Members'
                                   labelLength={associationValidMembers()?.length}
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
                    <TouchableOpacity onPress={() => navigation.navigate('NEWS')}>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center'
                        }}>
                            <MaterialCommunityIcons name="newspaper-variant-outline" size={24} color="black" />
                            <AppText style={{color: defaultStyles.colors.bleuFbi, marginLeft: 10}}>News</AppText>
                        </View>
                    </TouchableOpacity>
                    {notReadInfo.length>0 && <View style={styles.notReadInfo}>
                        <AppText style={{color: defaultStyles.colors.rougeBordeau}}>{notReadInfo.length}</AppText>
                    </View>}
                    </View>
                    <View style={{
                        marginVertical: 10
                    }}>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}>
                        <MaterialCommunityIcons name="account-multiple-plus" size={24} color="black" />
                        <AppText style={styles.adhesion}
                                 onPress={() => navigation.navigate(routes.NEW_ADHESION)}>Nouvelle adhésion</AppText>
                    </View>
                        {getNewAdhesion().length>0 && <View style={styles.newAdhesionLenght}>
                            <AppText style={{color: defaultStyles.colors.rougeBordeau}}>{getNewAdhesion().length}</AppText>
                        </View>}
                    </View>
                </View>
                <View style={styles.reglement}>
                    <AppText style={{color: defaultStyles.colors.bleuFbi}}> Reglement intérieur</AppText>
                </View>
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
    cotisation: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: defaultStyles.colors.white,
      height: 60,
      width: 60,
       borderRadius: 30,
      borderWidth: 1,
      borderColor: defaultStyles.colors.or
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
    reglement: {
      marginVertical: 30,
        marginHorizontal: 30,
        flexDirection: 'row'
    },
    secondFonds: {
        flexDirection: 'row',
    }
})
export default DashboardScreen;