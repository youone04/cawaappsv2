import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';

export default function CardComponent({ data }: any) {
    return (
        <View>

            <View>
                <Text>{data?.data?.name}</Text>
                <Text>{data?.data?.username}</Text>
                <Text>{data?.data?.email}</Text>
            </View>

            <View>
                {
                    !data?.data?.isFriend && (
                            <TouchableOpacity>
                                <Ionicons name="person-add" size={32} color="black" />
                            </TouchableOpacity>
                    )
                }
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        borderWidth: 1,
        margin: 2
    }

})