import { View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { fetchData, lisApi } from "@/helper/api";

export default function CardComponent({ data, icon }: any) {

    const handleFriendRequest = async () => {
        const dataUserLogin = JSON.parse(localStorage.getItem('dataUser')!);
        await fetchData(
            `${lisApi.cawa}/users/${dataUserLogin._id}/friend-request/${data?.data?._id}`,
            "POST"
        )

    }

    return (
        <View>
            <View>
                {
                    Array.isArray(data) ? (
                      <FlatList
                        data={data}
                        keyExtractor={(item: any) => item._id}
                        renderItem={({ item }: { item: any }) => (
                            <View style={styles.containerSendRequest}>
                                <Text>{item.username}</Text>
                                <TouchableOpacity>
                                    <Text>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                        />
                    ) : (
                        <>
                            <Text>{data?.data?.name}</Text>
                            <Text>{data?.data?.username}</Text>
                            <Text>{data?.data?.email}</Text>
                        </>
                    )
                }
            </View>

            {
                icon && (
                    <View>
                        {
                            !data?.data?.isFriend && !data?.data?.isSentRequest && (
                                <TouchableOpacity onPress={handleFriendRequest}>
                                    <Ionicons name="person-add" size={32} color="black" />
                                </TouchableOpacity>
                            )
                        }
                    </View>
                )
            }

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        borderWidth: 1,
        margin: 2
    },
    containerSendRequest: {
        padding: 10,
        borderWidth: 1,
        margin: 2,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    }

})