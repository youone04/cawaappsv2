//v1

import { lisApi } from '@/helper/api';
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import io, { Socket } from 'socket.io-client';

// Definisikan tipe untuk pesan dan user
interface Message {
  senderId: string;
  text: string;
}

interface User {
  userId: string;
  socketId: string;
}

const Chats = ({receiverId}: any) => {
  const [socket, setSocket] = useState<Socket | null>(null); // Socket tipe dengan nullable
  const [message, setMessage] = useState<string>(''); // Tipe string untuk pesan
  const [messages, setMessages] = useState<Message[]>([]); // State untuk menyimpan pesan
  const [userId, setUserId] = useState<string>(''); // UserId dummy
  const [users, setUsers] = useState<any[]>([]); // State untuk user online

  useEffect(() => {
    const dataUserLogin = JSON.parse(localStorage.getItem('dataUser')!);
    setUserId(dataUserLogin._id);
    // Inisialisasi koneksi socket
    const newSocket = io(lisApi.socket, {
      transports: ['websocket'], // Pastikan menggunakan WebSocket
    });
    setSocket(newSocket);

    // Saat terkoneksi
    newSocket.on('connect', () => {
      console.log('Connected to WebSocket');
      newSocket.emit('addUser', userId); // Emit event menambahkan user online
    });

    // Mendengarkan daftar user yang online
    newSocket.on('getUsers', (onlineUsers: { userId: string; socketId: string }[]) => {
      setUsers(onlineUsers); // Menyimpan user yang online
    });

    // Mendengarkan pesan yang diterima
    newSocket.on('getMessage', (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]); // Tambahkan pesan ke state
    });

    // Cleanup socket saat komponen di-unmount
    return () => {
      newSocket.disconnect();
    };
  }, [userId]);

  // Fungsi untuk mengirim pesan
  const sendMessage = () => {
    if (socket && message.trim()) {
      socket.emit('sendMessage', {
        senderId: userId,
        receiverId,
        text: message,
      });
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
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Text style={styles.messageText}>
            {item.senderId}: {item.text}
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

