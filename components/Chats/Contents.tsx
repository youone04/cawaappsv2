import { View, Text, FlatList, StyleSheet, Image } from "react-native"
import { Link } from 'expo-router';

const DATA = [
    { id: '1', title: 'Yudi gunawan' },
    { id: '2', title: 'Sueb Kosasi' },
    { id: '3', title: 'Ujang' },
    // More items...
];
export default function Contents() {
    const renderItem = ({ item }: { item: { id: string; title: string } }): JSX.Element => (
        <View style={styles.item}>
            <Image style={styles.image} source={{ uri: 'https://i.pravatar.cc/300' }} />
            <View style={{ flex: 6 }}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>hari ini kerja?</Text>
            </View>
            <View style={{ flex: 1 }}>
                <Text style={styles.description}>10.00</Text>
                <Link href="/chat-screens.parent">View details</Link>
            </View>
        </View>
    );
    return (
        <FlatList
            data={DATA}
            renderItem={renderItem}
            keyExtractor={item => item.id}
        />
    )
}
const styles = StyleSheet.create({
    item: {
        marginVertical: 8,
        marginHorizontal: 8,
        flexDirection: 'row',
        gap: 5
    },
    image: {
        width: 45,
        height: 45,
        borderRadius: 25,
        flex: 1
    },
    title: {
        fontSize: 23,
        fontWeight: 'bold'
    },
    description: {
        fontSize: 16
    }
});