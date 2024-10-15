import CardComponent from "@/components/Card/Card"
import Title from "@/components/Chats/Title"
import { fetchData, lisApi } from "@/helper/api"
import { useState } from "react"
import {View, Text, StyleSheet, TextInput, TouchableOpacity} from "react-native"

export default function sendRequest(){
    const [pinUser, setPinUser] = useState('');
    const [data, setData] = useState(null);

    const searchPinUser = async (e:any) => {
       setPinUser(e.target.value)
    }

    const handleGetUserByPin = async() => {
        const dataUserLogin = JSON.parse(localStorage.getItem('dataUser')!);
       const data = await fetchData(
            lisApi.cawa + `/users/${dataUserLogin._id}/pin/${pinUser}`,
            "GET"
        );
        setData(data);
    }

    return (
       <View>
         <View>
            <TextInput onChange={searchPinUser} style={styles.textInput} placeholder="PIN" />
            <TouchableOpacity onPress={handleGetUserByPin}>
                <Text>Search</Text>
            </TouchableOpacity >
        </View>
        <CardComponent data={data}/>

       </View>
    )
}

const styles = StyleSheet.create({
    container: {
        display:'flex',
        flexDirection:'row',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
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
    textInput:{
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    }
})