import Title from "@/components/Chats/Title";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from "react";
import { fetchData, lisApi } from "@/helper/api";
import { Link } from "expo-router";

export default function Friends() {
    const [friends, setFriends] = useState({
        loading: true,
        data: [],
        error: null
    });

    useEffect(() => {
        getData()
    }, [])

    const getData = async () => {
        const dataUserLogin = JSON.parse(localStorage.getItem('dataUser')!);
        const friends = await fetchData(
            `${lisApi.cawa}/users/${dataUserLogin._id}/friends`,
            "GET"
        )
        setFriends(prev => ({ ...prev, data: friends, loading: false, error: friends }))
    }

    return (
        <>
            <Title />
            {
                friends.loading ?
                    (<Text>Loading..</Text>) :
                    (
                        <FlatList
                            data={friends.data}
                            keyExtractor={(item: any) => item._id}
                            renderItem={(item: any) => (
                                <View style={styles.container}>
                                    <Link
                                        href={`/chat-screen/${item.item._id}`}

                                    > 
                                    <Text>{item.item.username}</Text>
                                    </Link>
                                </View>
                            )}
                        />
                    )

            }

        </>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        borderWidth: 1,
        margin: 2
    }

})