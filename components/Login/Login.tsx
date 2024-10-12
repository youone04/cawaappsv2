import { useState } from "react";
import { StyleSheet, View, TextInput, Image, Text, Button, SafeAreaView, TouchableOpacity } from "react-native"


const Card = () => {
    const [auth , setAuth] = useState({
        username: '',
        password: ''
    })

    const handleLogin = async() => {
       try{
        const postLogin = await fetch('http://localhost:3001/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(auth)
        })
        const dataLogin = await postLogin.json()
        if(dataLogin.status === 200){
            localStorage.setItem('dataUser', JSON.stringify(dataLogin.data))
            //redirect to home
            window.location.href = '/'
        }
       }catch(err){
           console.log(err)
       }
        
    }

    return (
        <View style={styles.card}>
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
        </View>
    );
};

const Login = () => {
    return (
        <SafeAreaView style={styles.container}>
            <Card />
        </SafeAreaView>
    )
}

export default Login

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5', // Optional: background color
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        elevation: 3, // For Android shadow
        shadowColor: '#000', // For iOS shadow
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        margin: 10,
        overflow: 'hidden',
        height: 400,
        width: '90%', // Optional: adjust width
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
    button:{
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

