import React from 'react';
import {TouchableWithoutFeedback, View, StyleSheet} from "react-native";
import AppText from "../AppText";
import useManageAssociation from "../../hooks/useManageAssociation";

function InformationItem({title, content, infoRead, onPress, infoDetail, dateDebut, dateFin}) {
    const {formatDate} = useManageAssociation()
    return (
        <>
            <View style={styles.mainContainer}>
                <TouchableWithoutFeedback onPress={onPress}>
                <View style={styles.container}>
                    <AppText style={{fontWeight: infoRead?'normal':'bold'}}>{title}</AppText>
                    {!infoDetail && <AppText numberOfLines={2}>{content}</AppText>}
                    {infoDetail && <AppText>{content}</AppText>}
                </View>
                </TouchableWithoutFeedback>
                    {infoDetail && <View>
                        <View style={styles.details}>
                            <AppText>du</AppText>
                            <AppText style={{marginLeft: 20}}>{formatDate(dateDebut)}</AppText>
                        </View>
                        <View style={styles.details}>
                            <AppText>au</AppText>
                            <AppText style={{marginLeft: 20, marginTop: 10}}>{formatDate(dateFin)}</AppText>
                        </View>
                    </View>}
            </View>
            </>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal:10,
        paddingVertical: 10,
    },
    details: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
        paddingHorizontal: 20
    },
    mainContainer: {
        marginBottom: 30
    }
})

export default InformationItem;