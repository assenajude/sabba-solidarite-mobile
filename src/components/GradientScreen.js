import React from 'react';
import {LinearGradient} from 'expo-linear-gradient'

function GradientScreen({children}) {
    return (
        <LinearGradient
            start={[0,1]}
            end={[1,0]}
            colors={['#efd807','#ffedff','#ffe3ff','#860432']}
            style={{
                flex: 1
            }}>
            {children}
        </LinearGradient>
    );
}

export default GradientScreen;