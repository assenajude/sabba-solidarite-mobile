import React from 'react';
import {TouchableWithoutFeedback, View} from "react-native";

import {MaterialCommunityIcons} from "@expo/vector-icons";
import defaultStyles from "../utilities/styles";
import AppText from "./AppText";

function NavigHeaderButton({onPress, iconName, title}) {
    return (
        <TouchableWithoutFeedback onPress={onPress}>
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginHorizontal: 10
            }}>
                <MaterialCommunityIcons name={iconName} size={24} color={defaultStyles.colors.white} />
                <AppText style={{color: defaultStyles.colors.white}}>{title}</AppText>
            </View>
        </TouchableWithoutFeedback>
    );
}

export default NavigHeaderButton;