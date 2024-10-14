//v1

import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import io, { Socket } from 'socket.io-client';
import * as Types from "@/helper/types"

const Chats = ({receiverId, data}: any) => {
  const [socket, setSocket] = useState<Socket | null>(null); // Socket tipe dengan nullable
  const [message, setMessage] = useState<string>(''); // Tipe string untuk pesan
  const [messages, setMessages] = useState<Types.Message[]>([]); // State untuk menyimpan pesan
  const [userId, setUserId] = useState<string>(''); // UserId dummy
  const [users, setUsers] = useState<any[]>([]); // State untuk user online

  useEffect(() => {

    if(data.data) setMessages(prev => [...prev, ...data.data])

    const dataUserLogin = JSON.parse(localStorage.getItem('dataUser')!);
    setUserId(dataUserLogin._id);
    // Inisialisasi koneksi socket
    const newSocket = io('http://localhost:8900', {
      transports: ['websocket'], // Pastikan menggunakan WebSocket
    });
    setSocket(newSocket);

    // Saat terkoneksi
    newSocket.on('connect', () => {
      console.log('Connected to WebSocket');
      newSocket.emit('addUser', userId); // Emit event menambahkan user online
    });

    // Mendengarkan daftar user yang online
    newSocket.on('getFriendsOnline', (onlineUsers: { userId: string; socketId: string }[]) => {
      console.log('getFriendsOnline',onlineUsers)
        setUsers(onlineUsers)
    });

    // Mendengarkan pesan yang diterima
    newSocket.on('getMessage', (message: Types.Message) => {
      console.log('socket on getMessage',message)
      if(message.from === receiverId) setMessages((prevMessages) => [...prevMessages, message]); // Tambahkan pesan ke state
     
    });

    // Cleanup socket saat komponen di-unmount
    // return () => {
    //   // newSocket.emit('disconnectMod', userId)
    //   newSocket.disconnect();
    // };
  }, [userId, data.data]);

  // Fungsi untuk mengirim pesan
  const sendMessage = () => {
    if (socket && message.trim()) {
      const dataUserLogin = JSON.parse(localStorage.getItem('dataUser')!);
      const from = {
        from: userId, //senderId
        to: receiverId,
        message: message,
        username: dataUserLogin.username
      }
      socket.emit('sendMessage', from);
      setMessages(prev => [...prev, from])
      setMessage(''); // Reset pesan setelah dikirim
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>User ID: {userId}</Text>

      {/* Daftar User yang Online */}
      <Text style={styles.subTitle}>Users Online:</Text>
      <FlatList
        data={users.filter((user) => user !== userId)}
        keyExtractor={(item) => item.userId}
        renderItem={({ item, index }) => (
          <View key={index} style={styles.userContainer}>
            <Text style={styles.userText}>User: {item}</Text>
            {/* <Text style={styles.socketText}>Socket ID: {item.socketId}</Text> */}
          </View>
        )}
      />

      {/* Daftar Pesan */}
      <Text style={styles.subTitle}>Messages:</Text>
      <FlatList
        data={messages}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <Text style={styles.messageText}>
            {item.from}: {item.message}
          </Text>
        )}
      />

      {/* Input Pesan */}
      <TextInput
        value={message}
        onChangeText={setMessage}
        placeholder="Type a message"
        style={styles.input}
      />
      <Button title="Send Message" onPress={sendMessage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  userContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  userText: {
    fontSize: 14,
    fontWeight: '600',
  },
  socketText: {
    fontSize: 12,
    color: '#888',
  },
  messageText: {
    fontSize: 14,
    paddingVertical: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
});

export default Chats;

