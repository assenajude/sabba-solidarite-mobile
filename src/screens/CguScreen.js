import React from 'react';
import {Asset} from 'expo-asset'
import PDFReader from "rn-pdf-reader-js";
import {View} from "react-native";

import AppDownloadButton from "../components/AppDownloadButton";

function CguScreen(props) {

    const url = Asset.fromModule(require('../../assets/cgu.pdf')).uri

    return (
        <>
       <PDFReader
           withPinchZoom={true}
           source={{uri: url}}/>
       <View style={{
           position: 'absolute',
           top: 0,
           right: 20
       }}>
           <AppDownloadButton url={url} label='Sabbat-Solidarite_cgu'/>
       </View>
       </>
    );
}

export default CguScreen;