import React from 'react';
import {View, StyleSheet, TouchableWithoutFeedback, ScrollView} from "react-native";
import {MaterialCommunityIcons} from '@expo/vector-icons'

import defaultStyles from '../../utilities/styles'
import AppText from "../AppText";
import useManageAssociation from "../../hooks/useManageAssociation";
import CotisationItem from "./CotisationItem";

function MonthItem({month, showMonthDetail, showMonthItemDetail, monthCotisations, monthTotal, getCotisationDetails}) {
    const {formatFonds} = useManageAssociation()
    return (
        <View style={{backgroundColor:showMonthDetail?defaultStyles.colors.white:defaultStyles.colors.lightGrey}}>
            <TouchableWithoutFeedback onPress={showMonthItemDetail}>
                <View style={styles.container}>
                    <AppText style={{fontWeight: showMonthDetail? 'bold':'normal'}}>{month}</AppText>
                    <AppText>{formatFonds(monthTotal)}</AppText>
                   <MaterialCommunityIcons name={showMonthDetail?"chevron-down" : "chevron-right"} size={24} color="black" />
                </View>
            </TouchableWithoutFeedback>
          {showMonthDetail &&
          <View style={styles.detail}>
              {monthCotisations && monthCotisations.length>0 &&
              <View style={{
                  marginVertical: 10
              }}>
                  {monthCotisations.map(item =>
                      <CotisationItem
                          key={item.id.toString()}
                          cotisation={item}
                          cotisationDetail={item.showDetail}
                          getCotisationDetails={() => getCotisationDetails(item)}/>)}
              </View>
              }
                {monthCotisations.length === 0 && <AppText>pas de cotisations trouvées</AppText>}
            </View>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 20,
        paddingHorizontal: 10
    },
    detail: {
        paddingHorizontal: 20,
        paddingBottom: 20
    }
})
export default MonthItem;