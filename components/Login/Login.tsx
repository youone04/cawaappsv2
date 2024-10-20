import { useState } from "react";
import { StyleSheet, View, TextInput, Image, Text, SafeAreaView, TouchableOpacity } from "react-native"
import LayoutCard from "../LayoutCard";
import { fetchData, lisApi } from "@/helper/api";
import { storeDataStorage } from "@/helper/store";
import { router } from "expo-router";

const CardLogin = () => {
    const [auth, setAuth] = useState({
        username: '',
        password: ''
    })

    const handleLogin = async () => {
        try {
            const postLogin = await fetchData(
                `${lisApi.cawaMobile}/users/login`,
                "POST",
                JSON.stringify(auth)
            )
            console.log('postLogin',postLogin)
            if (postLogin.status === 200) {
               await storeDataStorage(JSON.stringify(postLogin.data))
                // localStorage.setItem('dataUser', JSON.stringify(postLogin.data))
                //redirect to home
                router.replace('/')
                // window.location.href = '/'
            }
        } catch (err) {
            console.log(err)
        }

    }

    return (
        <LayoutCard>
            <Image
                source={{ uri: 'https://via.placeholder.com/150' }} // Replace with your image URL
                style={styles.image}
            />
            <View style={styles.content}>
                <Text style={styles.label}>Username</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    onChange={(e) => setAuth({ ...auth, username: e.nativeEvent.text })}
                />

                <Text style={styles.label}>Password</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    onChange={(e) => setAuth({ ...auth, password: e.nativeEvent.text })}
                />

                <TouchableOpacity onPress={handleLogin} style={styles.button}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
            </View>
        </LayoutCard>
    );
};

const Login = () => {
    return (
        <SafeAreaView style={styles.container}>
            <CardLogin />
        </SafeAreaView>
    )
}

export default Login

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5', // Optional: background color
    },
    image: {
        width: '100%',
        height: 150,
    },
    content: {
        padding: 10,
    },
    label: {
        fontSize: 18,
        marginBottom: 5,
    },
    description: {
        fontSize: 14,
        color: '#666',
    },
    input: {
        borderWidth: 1,
        borderRadius: 4,
        padding: 10,
        marginBottom: 10,
    },
    button: {
        borderRadius: 4,
        backgroundColor: '#007bff'
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        padding: 10,
    },
});

