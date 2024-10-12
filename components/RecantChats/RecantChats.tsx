import { View, Text, FlatList, StyleSheet, Image } from "react-native"
import { Link } from 'expo-router';
import moment from "moment";


export default function RecantChats({data}:any) {

    const renderItem = ({ item }: { item: { friendId: string; username: string; lastMessage:string; lastTimestamp:string } }): JSX.Element => (
        <View style={styles.item}>
            <Image style={styles.image} source={{ uri: 'https://i.pravatar.cc/300' }} />
            <View style={{ flex: 2 }}>
                <Text style={styles.title}>{item.username}</Text>
                <Text style={styles.description}>{item.lastMessage}</Text>
            </View>
            <View style={{ flex: 1 }}>
                <Text style={styles.description}>{moment(item.lastTimestamp).fromNow()}</Text>
                <Link
                 href={`/chat-screen/${item.friendId}`}
                >View details</Link>
            </View>
        </View>
    );
    return (
        <FlatList
            data={data}
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