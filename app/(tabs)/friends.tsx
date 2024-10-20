import Title from "@/components/Chats/Title";
import { FlatList, StyleSheet, Text, View, TouchableOpacity, Image, TouchableWithoutFeedback } from "react-native";
import { useState,useCallback } from "react";
import { fetchData, lisApi } from "@/helper/api";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getDataStorage } from "@/helper/store";
import { useFocusEffect } from '@react-navigation/native';


export default function Friends() {
    const [friends, setFriends] = useState({
        loading: true,
        data: [],
        error: null
    });

    const [handlerLongpress, setHandlerLongpress] = useState(false)

    useFocusEffect(
        useCallback(() => {
            getData();
            return () => {
                setHandlerLongpress(false)
            }
            
        },[])
    )


    const getData = async () => {
        // const dataUserLogin = JSON.parse(localStorage.getItem('dataUser')!);
        const dataUserLogin: any = await getDataStorage();
        const friends = await fetchData(
            `${lisApi.cawaMobile}/users/${dataUserLogin._id}/friends`,
            "GET"
        )
        setFriends(prev => ({ ...prev, data: friends, loading: false, error: friends }))
    }

    return (
        <TouchableWithoutFeedback onPress={() => setHandlerLongpress(false)}>
            <View>
                <Title />
                {
                    friends.loading ?
                        (<Text>Loading..</Text>) :
                        (
                            <FlatList
                                data={friends.data}
                                keyExtractor={(item: any) => item._id}
                                renderItem={(item: any) => (
                                    <TouchableOpacity onLongPress={() => setHandlerLongpress(true)} onPress={() => router.push(`/chat-screen/${item.item._id}`)}>
                                        <View style={styles.container}>
                                            <Image style={styles.image} source={{ uri: 'https://i.pravatar.cc/300' }} />
                                            <View style={styles.username}>
                                                <Text style={styles.textUsername}>{item.item.username}</Text>
                                            </View>
                                            {
                                                handlerLongpress ?
                                                    (
                                                        <>
                                                            <TouchableOpacity>
                                                                <Ionicons name="close-circle" size={32} color="red" />
                                                            </TouchableOpacity>
                                                            <TouchableOpacity onPress={() => setHandlerLongpress(false)}>
                                                                <Ionicons name="arrow-forward-circle" size={32} color="black" />
                                                            </TouchableOpacity>

                                                        </>
                                                    ) :
                                                    (null)
                                            }
                                        </View>
                                    </TouchableOpacity>
                                )}
                            />
                        )

                }
            </View>

        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    container: {
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
    username: {
        flex: 1,
    },
    textUsername: {
        fontSize: 25,
        marginTop: 3,
        marginLeft: 5,
        fontWeight: 'bold'
    }

})