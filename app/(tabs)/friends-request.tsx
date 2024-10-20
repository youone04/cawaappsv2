import Title from '@/components/Chats/Title';
import { Colors } from '@/constants/Colors';
import { fetchData, lisApi } from '@/helper/api';
import { getDataStorage } from '@/helper/store';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { Image, View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

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
        // const dataUserLogin = JSON.parse(localStorage.getItem('dataUser')!);
        const dataUserLogin: any = await getDataStorage();
        const response = await fetchData(
            `${lisApi.cawaMobile}/users/${dataUserLogin._id}/friend-requests`,
            "GET"
        )
        setData(prev => ({ ...prev, data: response, loading: false }))
    }

    const postKonfirmasiFriend = async (idFriend: string) => {
        // const dataUserLogin = JSON.parse(localStorage.getItem('dataUser')!);
        const dataUserLogin: any = await getDataStorage();
        await fetchData(
            `${lisApi.cawaMobile}/users/${dataUserLogin._id}/accept-friend/${idFriend}`,
            "POST"
        )

    }


    return (
        <View>
            <Title />
            {
                data.loading ? (
                    <Text>Loading...</Text>
                ) : (
                    <>
                        <Text style={styles.textFriendsRequest}>Friend Request</Text>
                        <FlatList
                            data={data.data}
                            keyExtractor={(item: any) => item._id}
                            renderItem={({ item }: { item: any }) =>
                                <View style={styles.listFriends} >
                                    <View style={styles.contentList}>
                                        <Image style={styles.image} source={{ uri: 'https://i.pravatar.cc/300' }} />
                                        <Text style={styles.username}>{item.username}</Text>
                                    </View>
                                    <View style={styles.containterButton}>
                                        <TouchableOpacity style={styles.textKonfirmasi} onPress={() => postKonfirmasiFriend(item._id)}>
                                            <Text style={styles.textColorWhite}>Konfirmasi</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.textCancel}>
                                            <Text style={styles.textColorWhite}>Cancel</Text>
                                        </TouchableOpacity>
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
    textColorWhite:{
        color: 'white',
        fontWeight: 'bold'
    },
    textFriendsRequest: {
        display: 'flex',
        flexDirection: 'row',
        gap: 10,
        flexWrap: 'wrap',
        textAlign: 'center',
    },
    contentList: {
        display: 'flex', 
        flexDirection: 'row', 
        gap: 10
    },
    username:{
        fontSize: 25,
        fontWeight: 'bold'
    },
    image: {
        width: 45,
        height: 45,
        borderRadius: 45
    },
    listFriends: {
        margin: 10,
        backgroundColor: Colors.light.background,
        padding: 10,
        borderRadius: 10
    },
    containterButton: {
        flex: 1,
        padding: 8,
        display: 'flex',
        flexDirection: 'row',
        gap: 10,
        // justifyContent: 'space-between'
    },
    textKonfirmasi: {
        backgroundColor: 'blue',
        color: 'white',
        padding: 8,
        borderRadius: 5
    },
    textCancel: {
        backgroundColor: 'red',
        color: 'white',
        padding: 8,
        borderRadius: 5
    }
})    