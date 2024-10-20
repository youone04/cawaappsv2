import CardComponent from "@/components/Card/Card"
import Title from "@/components/Chats/Title";
import { fetchData, lisApi } from "@/helper/api"
import { getDataStorage } from "@/helper/store";
import { useEffect, useState } from "react"
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native"

export default function sendRequest() {
    const [pinUser, setPinUser] = useState('');
    const [data, setData] = useState(null);
    const [dataFriend, setDataFriend] = useState({
        data: [],
        loading: true
    });

    const searchPinUser = async (value: any) => {
        setPinUser(value)
    }

    const handleGetUserByPin = async () => {
        // const dataUserLogin = JSON.parse(localStorage.getItem('dataUser')!);
        const dataUserLogin: any = await getDataStorage();
        console.log(dataUserLogin._id)
        const dataRes = await fetchData(
            lisApi.cawaMobile + `/users/${dataUserLogin._id}/pin/${pinUser}`,
            "GET"
        );
        console.log('dataRes',pinUser)
        setData(dataRes);
    }

    useEffect(() => {
        handleSendRequest();
    }, [])

    const handleSendRequest = async () => {
        // const dataUserLogin = JSON.parse(localStorage.getItem('dataUser')!);
        const dataUserLogin: any = await getDataStorage();
        const data = await fetchData(
            `${lisApi.cawaMobile}/users/${dataUserLogin._id}/sent-friend-requests`,
            "GET"
        );

        setDataFriend(prev => ({ ...prev, data: data, loading: false }))
    }
    return (
        <View>
            <Title />
            <View style={styles.container}>
                <View>
                    <TextInput onChangeText={searchPinUser} style={styles.textInput} placeholder="PIN" />
                    <TouchableOpacity style={styles.search} onPress={handleGetUserByPin}>
                        <Text style={styles.searchText}>Search</Text>
                    </TouchableOpacity >
                </View>
                {
                    data && (<CardComponent data={data} icon={true} />)
                }
                <View style={styles.line} />
                <CardComponent data={dataFriend.data} icon={false} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        padding: 10
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
    search:{
        padding: 10,
        backgroundColor: 'green',
        width: '17%',
        borderRadius: 5
    },
    searchText: {
        color: 'white'
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    line: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 10,
        marginTop: 10
    }
})