import React from 'react';
import { Platform, TouchableNativeFeedback, View, TouchableOpacity, Image } from 'react-native';

const Button = ({
    customIcon,
    icon,
    onLongPress = () => { },
    onPress = () => { },
    style = {},
    iconStyle = {}
}) => (Platform.OS == 'ios' ?
    <TouchableOpacity
        onLongPress={onLongPress}
        onPress={onPress}
        style={style}
    >
        <View style={{ padding: 10, overflow: 'hidden', borderRadius: 100 }}>
            {customIcon ? customIcon : <Image source={icon} style={{ width: 25, height: 25, ...iconStyle }} />}
        </View>
    </TouchableOpacity> :
    <TouchableNativeFeedback
        onLongPress={onLongPress}
        useForeground
        background={TouchableNativeFeedback.Ripple('white')}
        style={style}
        // hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
        onPress={onPress}
    >
        <View style={{ padding: 10, overflow: 'hidden', borderRadius: 100 }}>
            {customIcon ? customIcon : <Image source={icon} style={{ width: 25, height: 25, ...iconStyle }} />}
        </View>
    </TouchableNativeFeedback>
    );

export default Button;
