import React, {useState} from 'react';
import {ScrollView, View, StyleSheet, TouchableOpacity, Alert, ToastAndroid} from "react-native";
import {MaterialCommunityIcons} from '@expo/vector-icons'
import * as Yup from 'yup'
import AppText from "../components/AppText";
import defaultStyles from '../utilities/styles'
import {AppForm, AppFormField, FormSubmitButton} from "../components/form";
import {useDispatch, useSelector, useStore} from "react-redux";
import {changeCredentials, getUserDelete, resetCredentials} from "../store/slices/authSlice";
import useAuth from "../hooks/useAuth";
import AppSimpleLabelWithValue from "../components/AppSimpleLabelWithValue";
import AppIconButton from "../components/AppIconButton";
import AppActivityIndicator from "../components/AppActivityIndicator";
import Swipeable from "react-native-gesture-handler/Swipeable";
import AppSwiper from "../components/AppSwiper";
import MemberItem from "../components/member/MemberItem";
import routes from "../navigation/routes";
import AppSearchBar from "../components/AppSearchBar";

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
function ParamScreen({navigation}) {
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
    const [editUsers, setEditUsers] = useState(false)


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

    const handleDeleteUser = (user) => {
        Alert.alert("Attention", "Voulez-vous supprimer definitivement cet utilisateur?", [{
            text: 'oui', onPress: async () => {
               await dispatch(getUserDelete({userId: user.id}))
                const error = store.getState().auth.error
                if(error !== null) {
                    ToastAndroid.showWithGravity("Erreur: Impossible de supprimer cet utilisateur",
                        ToastAndroid.LONG,
                        ToastAndroid.CENTER)
                } else{
                    ToastAndroid.showWithGravity("Utilisateur supprimé avec succès.",
                        ToastAndroid.LONG,
                        ToastAndroid.CENTER)
                }
            }
        }, {text: 'non', onPress: () => null}])

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
                            name='oldPass'
                            label='ancien mot de passe'/>
                        <AppFormField
                            autoCapitalize='none'
                            secureTextEntry
                            name='newPass'
                            label='nouveau mot de passe'/>
                        <AppFormField
                            autoCapitalize='none'
                            secureTextEntry
                            name='confirmNewPass'
                            label='confirm nouveau passe'/>
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
                            name='oldPin'
                            label='ancien pin'/>
                        <AppFormField
                            secureTextEntry
                            keyboardType='numeric'
                            name='newPin'
                            label='nouveau pin'/>
                        <AppFormField
                            secureTextEntry
                            keyboardType='numeric'
                            name='confirmNewPin'
                            label='confirmer le nouveau pin'/>
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
                   <AppSearchBar
                       onIconPress={() => handleSearch(resetData)}
                       onChangeText={val =>setResetData(val)}
                       value={resetData}
                   />
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
              <TouchableOpacity
                  onPress={() => {
                      setEditPin(false)
                      setEditPassword(false)
                      setResetParams(false)
                      setEditUsers(!editUsers)
                  }}
                  style={styles.link}>
                  <AppText>Edit users</AppText>
                  {!editUsers && <MaterialCommunityIcons name='chevron-right' size={30} color={defaultStyles.colors.dark}/>}
                  {editUsers && <MaterialCommunityIcons name='chevron-up' size={30} color={defaultStyles.colors.dark}/>}
              </TouchableOpacity>
              {editUsers && <View style={styles.editContainer}>
                  {allUser.length>0 && <View>
                      {allUser.map((user) => <Swipeable key={user.id.toString()} renderRightActions={() => <AppSwiper
                          containerStyle={{
                              alignItems: 'center',
                              justifyContent: 'center'
                          }}>
                          <AppIconButton
                              onPress={() => navigation.navigate(routes.EDIT_USER_COMPTE, user)}
                              iconName='account-edit'/>
                          <AppIconButton
                              onPress={()=>handleDeleteUser(user)}
                              iconColor={defaultStyles.colors.rougeBordeau}
                              iconName='account-remove' containerStyle={{
                              marginVertical: 15
                          }}/>
                      </AppSwiper>}>
                          <View style={{
                              marginVertical: 20
                          }}>
                              <MemberItem
                                  getMemberDetails={() => navigation.navigate(routes.USER_COMPTE, user)}
                                  selectedMember={user} showPhone={true} />
                          </View>

                      </Swipeable>)}
                  </View>
                      }
                  {allUser.length === 0 && <View>
                      <AppText>Aucun utilisateur trouvé</AppText>
                  </View>}
              </View>}
            </View>}
        </ScrollView>
            </>
    );
}

const styles = StyleSheet.create({
    editContainer: {
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