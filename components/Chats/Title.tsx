import { View, StyleSheet, Text } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';

export default function Title() {
    return (
        <View style={styles.header}>
            <View style={styles.sectiontext}>
                <Text style={styles.text}>CawaApps</Text>
            </View>
            <View style={styles.sectionIcon}>
            <Ionicons name="camera" size={32} color="white" />
            <Ionicons name="search" size={32} color="white" />
            <Ionicons name="ellipsis-vertical" size={32} color="white" />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: 'black',
        color: 'white',
        padding: 10,
        flexDirection: 'row',
        position: 'static',
    },
    text: {
        fontSize: 25,
        color: 'white',
        fontWeight:'bold'
    },
    sectiontext: {
        flex: 2
    },
    sectionIcon: {
        flex: 1,
        flexDirection: 'row',
        gap: 20
    }

})