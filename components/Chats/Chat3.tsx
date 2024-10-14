//v3
import { lisApi } from '@/helper/api';
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList } from 'react-native';
import io, { Socket } from 'socket.io-client';

// const socket: Socket = io('http://localhost:8900', {
//   transports: ['websocket'], // Pastikan menggunakan WebSocket
// }); // Ganti dengan URL server Anda

interface Message {
  senderId: string;
  text: string;
}

const Chat = ({ receiverId }: any) => {
  const [userId, setUserId] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [friendsOnline, setFriendsOnline] = useState<string[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null); // Socket tipe dengan nullable

  const handleAddUser = () => {
    if (userId && socket) {
      socket.emit('addUser', userId);
    }
  };

  const handleSendMessage = () => {
    if (message && socket) {
      socket.emit('sendMessage', { senderId: userId, receiverId: receiverId, text: message });
      setMessage('');
    }
  };

  useEffect(() => {
    const dataUserLogin = JSON.parse(localStorage.getItem('dataUser')!);
    setUserId(dataUserLogin._id);

    const newSocket = io(lisApi.socket, {
      transports: ['websocket'], // Pastikan menggunakan WebSocket
    });

    setSocket(newSocket);

    // Saat terkoneksi
    newSocket.on('connect', () => {
      console.log('Connected to WebSocket');
      newSocket.emit('addUser', userId); // Emit event menambahkan user online
    });

    newSocket.on('getFriendsOnline', (onlineFriends: string[]) => {
      console.log('onlineFriends', onlineFriends)
      setFriendsOnline(onlineFriends);

    newSocket.on('getMessage', (data: Message) => {
        setMessages((prevMessages) => [...prevMessages, data]);
    });



    });

    return () => {
      newSocket.disconnect()
      // newSocket.off('getMessage');
      // newSocket.off('getFriendsOnline');
    };
  }, [userId]);

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="User ID"
        value={userId}
        onChangeText={setUserId}
        style={{ borderWidth: 1, marginBottom: 10, padding: 10 }}
      />
      <Button title="Add User" onPress={handleAddUser} />

      <Text style={{ marginVertical: 20 }}>Friends Online:</Text>
      <FlatList
        data={friendsOnline}
        keyExtractor={(item) => item}
        renderItem={({ item }) => <Text>{item}</Text>}
      />

      <TextInput
        placeholder="Type a message"
        value={message}
        onChangeText={setMessage}
        style={{ borderWidth: 1, marginBottom: 10, padding: 10 }}
      />
      <Button title="Send Message" onPress={handleSendMessage} />

      <Text style={{ marginVertical: 20 }}>Messages:</Text>
      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Text>{item.senderId}: {item.text}</Text>}
      />
    </View>
  );
};

export default Chat;