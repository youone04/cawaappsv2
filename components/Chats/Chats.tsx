//v1

import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, FlatList, StyleSheet,
  KeyboardAvoidingView, Platform, TouchableOpacity, SafeAreaView, Dimensions
} from 'react-native';
import io, { Socket } from 'socket.io-client';
import * as Types from "@/helper/types"
import { fetchData, lisApi } from '@/helper/api';
import Ionicons from '@expo/vector-icons/Ionicons';
import moment from 'moment';
import { getDataStorage } from '@/helper/store';

const Chats = ({ receiverId, data }: any) => {
  const [socket, setSocket] = useState<Socket | null>(null); // Socket tipe dengan nullable
  const [message, setMessage] = useState<string>(''); // Tipe string untuk pesan
  const [messages, setMessages] = useState<Types.Message[]>([]); // State untuk menyimpan pesan
  const [userId, setUserId] = useState<string>(''); // UserId dummy
  const [users, setUsers] = useState<any[]>([]); // State untuk user online
  const { height } = Dimensions.get('window');

  useEffect(() => {
    if (data.data) setMessages(prev => [...prev, ...data.data])
      getUserId()
    // const dataUserLogin = JSON.parse(localStorage.getItem('dataUser')!);
    // setUserId(dataUserLogin._id);
    // Inisialisasi koneksi socket
    const newSocket = io(lisApi.socket, {
      transports: ['websocket'], // Pastikan menggunakan WebSocket
    });
    setSocket(newSocket);

    // Saat terkoneksi
    newSocket.on('connect', async () => {
      console.log('Connected to WebSocket');
      const dataUserLogin: any = await getDataStorage();
      newSocket.emit('addUser', dataUserLogin._id); // Emit event menambahkan user online
    });

    // Mendengarkan daftar user yang online
    newSocket.on('getFriendsOnline', (onlineUsers: { userId: string; socketId: string }[]) => {
      setUsers(onlineUsers)
    });

    // Mendengarkan pesan yang diterima
    newSocket.on('getMessage', (message: Types.Message) => {
      if (message.from === receiverId) setMessages((prevMessages) => [...prevMessages, message]); // Tambahkan pesan ke state

    });

    // Cleanup socket saat komponen di-unmount
    return () => {
      newSocket.disconnect();
    };
  }, [userId, data.data]);

  // Fungsi untuk mengirim pesan
  const sendMessage = async () => {
    if (socket && message.trim()) {
      // const dataUserLogin = JSON.parse(localStorage.getItem('dataUser')!);
      const dataUserLogin: any = await getDataStorage();
      const from = {
        from: userId, //senderId
        to: receiverId,
        message: message,
        username: dataUserLogin.username
      }
      await fetchData(
        `${lisApi.cawaMobile}/chats/send`,
        "POST",
        JSON.stringify(from)
      )
      socket.emit('sendMessage', from);
      setMessages(prev => [...prev, from])
      setMessage(''); // Reset pesan setelah dikirim
    }
  };

 const getUserId = async () => {
    const dataUserLogin: any = await getDataStorage();
    setUserId(dataUserLogin._id);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
        <FlatList
          data={messages}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={[styles.chatMessages, item.from === userId ? styles.chatMessagesRight : styles.chatMessagesLeft]}>
              <Text style={[styles.messageText, item.from === userId ? styles.messageTextRight : styles.messageTextLeft]}>
                {item.message}
              </Text>
              
              <Text style={styles.timeMessage}>{moment(item.timestamp).format('HH:mm')}</Text>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 80, height: (height - 60) }} // Add padding at the bottom for the input field
        />
      </View>
      {/* Input Pesan */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={90}  // Offset to prevent overlap with the keyboard
      >
        <View style={styles.inputContainer}>
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Masukan pesan"
            style={styles.input}
          />
          {
            message ?
              (
                <TouchableOpacity onPress={sendMessage} style={styles.iconSend}>
                  <Ionicons name="send" size={24} color="black" />
                </TouchableOpacity>
              ) : <View/>
          }
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>

  );
};

const styles = StyleSheet.create({
  container: {
    padding: 5,
    flex: 1,
    position: 'relative',
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
    color: '#888'
  },
  messageText: {
    fontSize: 14,
    paddingVertical: 5,
  },
  inputContainer: {
    position: 'absolute', // Position the input container absolutely
    bottom: 0, // Align it to the bottom
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff', // Optional: Set background color
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 15,
    height: 40,
  },
  chatMessages: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 10,
  },
  chatMessagesRight: {
    alignSelf: 'flex-end',
    backgroundColor: '#004225',
    // marginLeft: 5,
    // marginRight: 5,
    padding: 10,
    borderRadius: 10
  },
  chatMessagesLeft: {
    alignSelf: 'flex-start',
    backgroundColor: '#E5E5EA',
    // marginLeft: 5,
    padding: 10,
    borderRadius: 10,
  },
  messageTextRight: {
    color: '#fff',
  },
  messageTextLeft: {
    color: '#000',
  },
  timeMessage: {
    fontSize: 10,
    color: '#888',
    alignSelf: 'flex-end',
  },
  iconSend: {
    marginLeft: 5
  }
});

export default Chats;

