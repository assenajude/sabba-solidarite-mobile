import React, {useState} from 'react';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack'
import DashboardScreen from "../screens/DashboardScreen";
import AppLabelWithIcon from "../components/AppLabelWithIcon";
import AssociationModal from "../components/association/AssociationModal";
import {useDispatch, useSelector} from "react-redux";
import defaultStyles from "../utilities/styles";
import NewsScreen from "../screens/NewsScreen";
import NewInformationScreen from "../screens/NewInformation";
import NouvelleAdhesionScreen from "../screens/NouvelleAdhesionScreen";
import {setSelectedAssociation} from "../store/slices/associationSlice";
import useAuth from "../hooks/useAuth";
import NavigHeaderButton from "../components/NavigHeaderButton";

const AssocNavig = createStackNavigator()

function AssociationNavigator(props) {
    const dispatch = useDispatch()
    const {getInitAssociation} = useAuth()

    const [associationModalVisible, setAssociationModalVisible] = useState(false)
    const memberAssociations = useSelector(state => {
        const list = state.entities.member.userAssociations
        const validList = list.filter(ass => ass.member?.relation.toLowerCase() === 'member' || ass.member?.relation.toLowerCase() === 'onleave')
        return validList
    })

    const handleShowAssociationModal = () => {
        setAssociationModalVisible(!associationModalVisible)
    }

    const handleSelectAssociation = (item) => {
        getInitAssociation(item)
        dispatch(setSelectedAssociation(item))
        setAssociationModalVisible(false)
    }

    return (
        <>
        <AssocNavig.Navigator screenOptions={() => ({
            headerStyle: {backgroundColor: defaultStyles.colors.rougeBordeau},
            headerTintColor: defaultStyles.colors.white,
            ...TransitionPresets.SlideFromRightIOS
        })}>
            <AssocNavig.Screen
                name='DashboardScreen'
                component={DashboardScreen}
                options={({navigation}) =>({
                    headerTitle: () =>
                        <AppLabelWithIcon
                            icon='tablet-dashboard'
                            label='Dashboard'
                        />,
                    headerLeft: () => null,
                    headerRight: () =>
                        <NavigHeaderButton
                            iconName='group'
                            onPress={handleShowAssociationModal}/>
                })}/>
                <AssocNavig.Screen name='NEWS' component={NewsScreen} options={{
                    title: 'The News'
                }}/>
                <AssocNavig.Screen name='NewInformations' component={NewInformationScreen} options={{
                    title: 'nouvelle information'
                }}/>
                <AssocNavig.Screen name='NouvelleAdhesionScreen' component={NouvelleAdhesionScreen} options={{
                    title: 'Etat adhésion membre'
                }}/>
        </AssocNavig.Navigator>

            <AssociationModal visible={associationModalVisible}
                              closeModal={() => setAssociationModalVisible(false)}
                              associations={memberAssociations}
                              selectAssociation={val=> handleSelectAssociation(val)}
            />
            </>
    );
}

export default AssociationNavigator;