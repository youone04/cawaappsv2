// import React, { useEffect, useState } from 'react';
// import { View, Text, TextInput, Button, FlatList } from 'react-native';
// import { io, Socket } from 'socket.io-client';

// interface ChatMessage {
//   senderId: string;
//   message: string;
// }

// const ChatScreen: React.FC = () => {
//   const [message, setMessage] = useState<string>('');
//   const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
//   const [onlineFriends, setOnlineFriends] = useState<string[]>([]);

//   const userId = localStorage.getItem('userId'); // Set userId dari user yang login
//   let socket: Socket;
//   useEffect(() => {
//     // Inisialisasi socket
//     socket = io('http://localhost:3000', { query: { userId } });
//     // Dengar event ketika teman online
//     socket.on('friendOnline', (friendId: string) => {
//       console.log(`Teman dengan ID ${friendId} sedang online.`);
//       setOnlineFriends((prevFriends) => [...prevFriends, friendId]);
//     });

//     // Dengar event ketika teman offline
//     socket.on('friendOffline', (friendId: string) => {
//       console.log(`Teman dengan ID ${friendId} sedang offline.`);
//       setOnlineFriends((prevFriends) => prevFriends.filter((id) => id !== friendId));
//     });

//     // Dengar pesan masuk
//     socket.on('receiveMessage', (payload: ChatMessage) => {
//       console.log(`Pesan diterima dari ${payload.senderId}: ${payload.message}`);
//       setChatMessages((prevMessages) => [...prevMessages, payload]);
//     });

//     // Bersihkan listener ketika komponen unmount
//     return () => {
//       socket.off('friendOnline');
//       socket.off('friendOffline');
//       socket.off('receiveMessage');
//       socket.disconnect();
//     };
//   }, []);

//   const sendMessage = () => {
//     socket = io('http://localhost:3000', { query: { userId } });
//     // return
//     const recipientId = localStorage.getItem('sendToid'); // ID teman yang akan dikirimi pesan
//     socket.emit('sendMessage', { senderId: userId, recipientId, message });
//     // setChatMessages((prevMessages) => [...prevMessages, { senderId: userId, message }]);
//     setMessage(''); // Kosongkan input setelah pesan dikirim
//   };

//   return (
//     <View style={{ padding: 20 }}>
//       <Text>Friends Online: {onlineFriends.join(', ')}</Text>

//       <FlatList
//         data={chatMessages}
//         keyExtractor={(_, index) => index.toString()}
//         renderItem={({ item }) => (
//           <Text>{item.senderId}: {item.message}</Text>
//         )}
//       />

//       <TextInput
//         value={message}
//         onChangeText={setMessage}
//         placeholder="Type a message"
//         style={{ borderColor: 'gray', borderWidth: 1, marginBottom: 10, padding: 5 }}
//       />

//       <Button title="Send Message" onPress={sendMessage} />
//     </View>
//   );
// };

// export default ChatScreen;

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

const ChatScreen = () => {
  const [socket, setSocket] = useState<Socket | null>(null); // Socket tipe dengan nullable
  const [message, setMessage] = useState<string>(''); // Tipe string untuk pesan
  const [messages, setMessages] = useState<Message[]>([]); // State untuk menyimpan pesan
  const [userId, setUserId] = useState<string>('user123'); // UserId dummy
  const [users, setUsers] = useState<any[]>([]); // State untuk user online

  useEffect(() => {
    const id = localStorage.getItem('userId') || 'user123';
    setUserId(id);
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
      const receiverId = localStorage.getItem('sendToid'); // Ganti dengan receiverId yang valid
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

export default ChatScreen;

