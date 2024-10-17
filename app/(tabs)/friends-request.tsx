import { fetchData, lisApi } from '@/helper/api';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

export default function FriendsRequest() {
    const [data, setData] = useState({
        data: [],
        loading: true
    });

    useFocusEffect(
        useCallback(() => {
            getFriendRequest();
            return () => {
                console.log('Home tab is unfocused');
            }
        }, [])
    )

    const getFriendRequest = async () => {
        const dataUserLogin = JSON.parse(localStorage.getItem('dataUser')!);
        const response = await fetchData(
            `${lisApi.cawa}/users/${dataUserLogin._id}/friend-requests`,
            "GET"
        )
        setData(prev => ({ ...prev, data: response, loading: false }))
    }

    const postKonfirmasiFriend = async(idFriend: string) => {
        
        const dataUserLogin = JSON.parse(localStorage.getItem('dataUser')!);
        await fetchData(
            `${lisApi.cawa}/users/${dataUserLogin._id}/accept-friend/${idFriend}`,
            "POST"
        )

    }


    return (
        <View>
            {
                data.loading ? (
                    <Text>Loading...</Text>
                ) : (
                    <>
                        <Text>FriendsRequest</Text>
                        <FlatList
                            data={data.data}
                            keyExtractor={(item: any) => item._id}
                            renderItem={({ item }: { item: any }) =>
                                <View style={styles.listFriends} >
                                    <Text>{item.username}</Text>
                                    <View>
                                        <TouchableOpacity style={styles.textKonfirmasi} onPress={() => postKonfirmasiFriend(item._id)}>
                                            <Text >Konfirmasi</Text>
                                        </TouchableOpacity>
                                        <Text style={styles.textCancel}>Cancel</Text>
                                    </View>
                                </View>}
                        />
                    </>
                )
            }
        </View>
    );
}

const styles = StyleSheet.create({
    listFriends: {
        margin: 10
    },
    textKonfirmasi: {
        backgroundColor: 'blue',
        color: 'white',
        padding: 5,
        borderRadius: 5
    },
    textCancel: {
        backgroundColor: 'red',
        color: 'white',
        padding: 5,
        borderRadius: 5
    }
})    