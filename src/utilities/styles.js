import {Platform} from "react-native";
import colors from "./colors";

export default {
    text: {
        fontSize: 15,
        fontFamily: Platform.OS === 'android'?'Roboto':'Avenir',
    },
    colors
}