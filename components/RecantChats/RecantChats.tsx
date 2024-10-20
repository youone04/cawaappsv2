import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from "react-native"
import { router } from 'expo-router';
import moment from "moment";


export default function RecantChats({ data }: any) {
    const dataArray = Array.from(data, ([friendId, details]) => ({
        friendId,
        ...details
    }));

    const renderItem = ({ item }: { item: { friendId: string; username: string; lastMessage: string; lastTimestamp: any } }): JSX.Element => (
        <TouchableOpacity
            style={styles.item}
            onPress={() => router.push(`/chat-screen/${item.friendId}`)}
        >
            <Image style={styles.image} source={{ uri: 'https://i.pravatar.cc/300' }} />
            <View style={{ flex: 2 }}>
                <Text style={styles.title}>{item.username}</Text>
                <Text style={styles.description}>{item.lastMessage}</Text>
            </View>
            <View style={{ flex: 1 }}>
                <Text style={styles.description}>{moment(item.lastTimestamp).fromNow()}</Text>
            </View>
        </TouchableOpacity>
    );
    return (
        <FlatList
            data={dataArray.map((item: any) => item).sort((a, b) => new Date(b.lastTimestamp).getTime() - new Date(a.lastTimestamp).getTime())}
            renderItem={renderItem}
            keyExtractor={item => item.friendId}
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
        borderRadius: 45
    },
    title: {
        fontSize: 23,
        fontWeight: 'bold'
    },
    description: {
        fontSize: 14,
        marginTop: 3
    }
});