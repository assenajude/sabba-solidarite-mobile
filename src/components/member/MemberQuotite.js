import React from 'react';
import AppLabelWithValue from "../AppLabelWithValue";
import {View} from "react-native";
import AppIconButton from "../AppIconButton";
import useAuth from "../../hooks/useAuth";
import useManageAssociation from "../../hooks/useManageAssociation";
import {useDispatch, useSelector} from "react-redux";
import {getChangeMemberQuotite} from "../../store/slices/memberSlice";

function MemberQuotite(props) {
    const dispatch = useDispatch()
    const {isModerator, isAdmin} = useAuth()
    const isAuthorized = isAdmin() || isModerator()
    const memberQuotite = useSelector(state => state.entities.member.memberQuotite)
    const {formatFonds, getManagedAssociationFund} = useManageAssociation()

    const handleChangeQuotite = (label) => {
        if(label === 'increment' && memberQuotite +100 >= getManagedAssociationFund().quotite) {
            return alert("Votre quotité maximale est atteinte.")
        }
        if (label === 'decrement' && memberQuotite - 100 < 0) {
            return alert('La quotité ne peut être inferieure à zero.')
        }
        dispatch(getChangeMemberQuotite({label}))
    }

    return (
        <View>
            <AppLabelWithValue
                label='Quotité'
                value={formatFonds(memberQuotite)}/>
            {isAuthorized && <View style={{
                position: 'absolute',
                top: 0,
                right: 10
            }}>
                <AppIconButton
                    containerStyle={{marginBottom: 15}}
                    iconName="plus"
                    onPress={()=> handleChangeQuotite('increment')}/>
                <AppIconButton
                    iconName="minus"
                    onPress={() => handleChangeQuotite('decrement')}/>
            </View>}
        </View>
    );
}

export default MemberQuotite;