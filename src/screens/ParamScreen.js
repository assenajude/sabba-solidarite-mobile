import React, {useState} from 'react';
import {ScrollView, View, StyleSheet, TouchableOpacity, TextInput} from "react-native";
import {MaterialCommunityIcons} from '@expo/vector-icons'
import * as Yup from 'yup'
import AppText from "../components/AppText";
import defaultStyles from '../utilities/styles'
import {AppForm, AppFormField, FormSubmitButton} from "../components/form";
import {useDispatch, useSelector, useStore} from "react-redux";
import {changeCredentials, resetCredentials} from "../store/slices/authSlice";
import useAuth from "../hooks/useAuth";
import AppSimpleLabelWithValue from "../components/AppSimpleLabelWithValue";
import AppIconButton from "../components/AppIconButton";
import AppActivityIndicator from "../components/AppActivityIndicator";

const validPass = Yup.object().shape({
    oldPass: Yup.string().required("Ancien mot de passe requis."),
    newPass: Yup.string().required("Nouveau mot de passe requis"),
    confirmNewPass: Yup.string().when("newPass", {
        is: val => (val && val.length > 0 ? true : false),
        then: Yup.string().oneOf(
            [Yup.ref("newPass")],
            "Les mots de passe  ne correspondent pas."
        )
    }).required("Veuillez confirmer le mot de passe.")
})

const pinValid = Yup.object().shape({
    oldPin: Yup.string().required("Ancien code pin requis."),
    newPin: Yup.string().required("Nouveau code pin requis"),
    confirmNewPin: Yup.string().when("newPin", {
        is: val => (val && val.length > 0 ? true : false),
        then: Yup.string().oneOf(
            [Yup.ref("newPin")],
            "Les code pin ne correspondent pas."
        )
    }).required("Veuillez confirmer le nouveau code pin.")
})
function ParamScreen(props) {
    const dispatch = useDispatch()
    const store = useStore()
    const {isAdmin, isValidEmail} = useAuth()

    const currentUser = useSelector(state => state.auth.user)
    const allUser = useSelector(state => state.auth.allUsers)
    const isLoading = useSelector(state => state.auth.loading)

    const [editPassword, setEditPassword] = useState(false)
    const [editPin, setEditPin] = useState(false)
    const [resetParams, setResetParams] = useState(false)
    const [resetData, setResetData] = useState('')
    const [searchResult, setSearchResult] = useState([])
    const [editingSelected, setEditingSelected] = useState(false)
    const [selected, setSelected] = useState({})


    const handleResetParams = async () => {
        const selectedData = selected.email || selected.phone
        const isEmail = isValidEmail(selectedData)
        let data
        if(isEmail) {
           data =  {
               email: resetData
           }
        } else {
            data = {
                phone: resetData
            }
        }
        await dispatch(resetCredentials(data))
        const error = store.getState().auth.error
        const newCode = store.getState().auth.randomCode
        if(error !== null) {
            return alert("Erreur lors de mise à jour des paramètres. Veuillez reessayer plutard.")
        }
        alert(`Les paramètres de l'utilisateur ${selected.nom} ont été mis à jour avec succès. Le nouveau code est: ${newCode}`)
    }

    const handleSearch = (label) => {
        const filteredUser = allUser.filter(user => user.phone === label || user.email === label)
        setSearchResult(filteredUser)
    }

    const handleSavePassEdit = async (newPassInfo, {resetForm}) => {
        let data;
        if(newPassInfo.newPass) {
            data = {
                userId: currentUser.id,
                oldPass: newPassInfo.oldPass,
                newPass: newPassInfo.newPass
            }
        }else {
            data = {
                userId: currentUser.id,
                oldPin: newPassInfo.oldPin,
                newPin: newPassInfo.newPin
            }
        }

        await dispatch(changeCredentials(data))
        const error = store.getState().auth.error
        if(error !== null) {
            return alert("Erreur lors de mise à jour des paramètres. Veuillez reessayer plutard.")
        }
        resetForm()
        alert("Vos paramètres ont été mis à jour avec succès.")
    }
    return (
        <>
            <AppActivityIndicator visible={isLoading}/>
        <ScrollView>
            <View>
                <TouchableOpacity
                    onPress={() => {
                        setEditPin(false)
                        setEditPassword(!editPassword)
                    }}
                    style={styles.link}>
                    <AppText>Changer le mot de passe</AppText>
                    {!editPassword && <MaterialCommunityIcons name='chevron-right' size={30} color={defaultStyles.colors.dark}/>}
                    {editPassword && <MaterialCommunityIcons name='chevron-up' size={30} color={defaultStyles.colors.dark}/>}
                </TouchableOpacity>
                {editPassword && <View
                    style={styles.editContainer}>
                    <AppForm
                        initialValues={{
                            oldPass: '',
                            newPass: '',
                            confirmNewPass: ''
                        }} validationSchema={validPass}
                        onSubmit={handleSavePassEdit}
                    >
                        <AppFormField
                            autoCapitalize='none'
                            secureTextEntry
                            name='oldPass' placeholder='ancien mot de passe'/>
                        <AppFormField
                            autoCapitalize='none'
                            secureTextEntry
                            name='newPass' placeholder='nouveau mot de passe'/>
                        <AppFormField
                            autoCapitalize='none'
                            secureTextEntry
                            name='confirmNewPass' placeholder='confirm nouveau passe'/>
                        <FormSubmitButton title='Valider'/>
                    </AppForm>
                </View>}
            </View>
            <View>
                <TouchableOpacity
                    onPress={() => {
                        setEditPassword(false)
                        setEditPin(!editPin)
                    }}
                    style={styles.link}>
                    <AppText>Changer le code pin</AppText>
                    {!editPin && <MaterialCommunityIcons name='chevron-right' size={30} color={defaultStyles.colors.dark}/>}
                    {editPin && <MaterialCommunityIcons name='chevron-up' size={30} color={defaultStyles.colors.dark}/>}
                </TouchableOpacity>
                {editPin && <View style={styles.editContainer}>
                    <AppForm
                        initialValues={{
                            oldPin: '',
                            newPin: '',
                            confirmNewPin: ''
                        }}
                        validationSchema={pinValid}
                        onSubmit={handleSavePassEdit}>
                        <AppFormField
                            secureTextEntry
                            keyboardType='numeric'
                            name='oldPin' placeholder='ancien pin'/>
                        <AppFormField
                            secureTextEntry
                            keyboardType='numeric'
                            name='newPin' placeholder='nouveau pin'/>
                        <AppFormField
                            secureTextEntry
                            keyboardType='numeric'
                            name='confirmNewPin' placeholder='confirmer le nouveau pin'/>
                        <FormSubmitButton title='Valider'/>
                    </AppForm>
                </View>}
            </View>
          {isAdmin() &&  <View>
                <TouchableOpacity
                    onPress={() => {
                        setEditPin(false)
                        setEditPassword(false)
                        setResetParams(!resetParams)
                    }}
                    style={styles.link}>
                    <AppText>Reset users params</AppText>
                    {!resetParams && <MaterialCommunityIcons name='chevron-right' size={30} color={defaultStyles.colors.dark}/>}
                    {resetParams && <MaterialCommunityIcons name='chevron-up' size={30} color={defaultStyles.colors.dark}/>}
                </TouchableOpacity>
               {resetParams && <View style={styles.editContainer}>
                   <View style={styles.inputContainer}>
                       <MaterialCommunityIcons style={{
                           marginRight: -20
                       }} name='account-search' size={24}/>
                       <TextInput
                           autoCapitalize='none'
                           keyboardType='email-address'
                           onSubmitEditing={() => handleSearch(resetData)}
                           style={styles.inputStyle}
                           value={resetData}
                           onChangeText={val => setResetData(val)}/>
                   </View>
                   <View>
                       {searchResult.length > 0 && <View>
                           {searchResult.map(user => <View style={{
                               marginVertical: 20
                           }}  key={user.id}>
                               <AppText style={{color: defaultStyles.colors.bleuFbi}} onPress={() => {
                                   setEditingSelected(!editingSelected)
                                   setSelected(user)
                               }}>{user.nom}--{user.email} --- {user.phone}</AppText>
                               {editingSelected && <View style={{
                                   backgroundColor: defaultStyles.colors.white,
                                   padding: 10
                               }}>
                                   <AppSimpleLabelWithValue label='Nom' labelValue={user.nom}/>
                                   <AppSimpleLabelWithValue label='Prenoms' labelValue={user.prenom}/>
                                   <AppSimpleLabelWithValue label='Phone' labelValue={user.phone}/>
                                   <AppSimpleLabelWithValue label='Email' labelValue={user.email}/>
                                   <AppIconButton
                                       onPress={handleResetParams}
                                       containerStyle={{
                                           alignSelf: 'flex-end'
                                       }}
                                       iconName='account-edit'/>
                               </View>}
                           </View>)}
                       </View>}
                       {searchResult.length === 0 && <AppText>Aucun utilisateur trouvé.</AppText>}
                   </View>
                </View>}
            </View>}
        </ScrollView>
            </>
    );
}

const styles = StyleSheet.create({
    editContainer: {
     alignItems: 'center',
        marginVertical: 20,
        marginHorizontal: 30
    },
    inputStyle: {
      width: 200,
      borderWidth: 0.5,
        paddingHorizontal:5,
        paddingLeft: 20
    },
    inputContainer: {
     alignItems: 'center',
        flexDirection: 'row'
    },
    link: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginVertical: 20
    }
})
export default ParamScreen;