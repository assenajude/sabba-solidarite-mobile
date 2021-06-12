import React from 'react';
import {ScrollView,Image, View, StyleSheet, TouchableOpacity} from 'react-native'
import AppText from "../components/AppText";
import colors from "../utilities/colors";
import { AntDesign, FontAwesome5 , MaterialCommunityIcons} from '@expo/vector-icons';

import defaulStyles from '../utilities/styles'
import AppHeaderGradient from "../components/AppHeaderGradient";


function HelpScreen({navigation}) {
    return (
        <ScrollView>
            <AppHeaderGradient/>
            <Image source={require('../../assets/help.jpg')} style={{
                width: '100%',
                height: 300
            }}/>
            <View style={{
                alignItems: 'center'
            }}>
                <AppText style={{color: colors.rougeBordeau, fontWeight: 'bold'}}>Avez-vous besoin d'aide?</AppText>
                <AppText style={{fontWeight: 'bold'}}>Contactez nous ici</AppText>
            </View>

                <View style={{marginTop: 40}}>
                    <View style={styles.phoneContact}>
                        <View style={{flexDirection: 'row',alignItems: 'center'}}>
                            <MaterialCommunityIcons name="whatsapp" size={40} color={defaulStyles.colors.vert} />
                            <MaterialCommunityIcons name="phone-outline" size={40} color="black" />
                        </View>
                        <AppText style={{fontSize: 18, fontWeight: 'bold'}}>+225 0708525827</AppText>
                    </View>
                    <View style={styles.messengerContact}>
                        <View style={{flexDirection: 'row'}}>
                            <MaterialCommunityIcons name="facebook" size={40} color={defaulStyles.colors.bleuFbi} />
                            <MaterialCommunityIcons name="facebook-messenger" size={40} color={defaulStyles.colors.bleuFbi} />
                        </View>
                        <AppText style={{fontWeight: 'bold', fontSize: 18}}>sabba.com</AppText>
                    </View>

                    <View style={styles.mailAdresse}>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <MaterialCommunityIcons name="email" size={40} color="black" />
                            <AppText style={{fontSize: 18, fontWeight: 'bold'}}>sabbatech@gmail.com</AppText>
                        </View>
                    </View>
                </View>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    phoneContact: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 20,
        marginHorizontal: 20
    },
    messengerContact: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 20,
        marginHorizontal: 20
    },
    mailAdresse: {
        marginVertical: 20,
        marginHorizontal: 20
    }
})

export default HelpScreen;