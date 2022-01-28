import React from 'react';
import { Text, Modal, TouchableOpacity, View } from 'react-native';

const Menu = ({
    onClose,
    visible
}) => (
        <Modal
            transparent
            animated
            animationType='slide'
            onRequestClose={onClose}
            visible={visible}
        >
            <TouchableOpacity
                activeOpacity={1}
                onPress={onClose}
                style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)', }}>

                <TouchableOpacity
                    activeOpacity={1}
                >

                </TouchableOpacity>
            </TouchableOpacity>

        </Modal>
    );

export default Menu;
