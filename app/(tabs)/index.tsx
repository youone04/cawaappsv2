import Title from "@/components/Chats/Title"
import RecantChats from "@/components/RecantChats/RecantChats"
import { fetchData, lisApi } from "@/helper/api"
import { useEffect, useState, useCallback } from "react"
import { Text } from "react-native"
import io, { Socket } from 'socket.io-client';
import * as Types from "@/helper/types"
import { useFocusEffect } from '@react-navigation/native';

export default function RecantChatsParent() {
    const [_socket, setSocket] = useState<Socket | null>(null); // Socket tipe dengan nullable
    const [userId, setUserId] = useState<string>(''); // UserId dummy
    const [data, setData] = useState({
        data: new Map(),
        loading: true
    })

    useFocusEffect(
        useCallback(() => {
            getData();
            return () => {
                console.log('Home tab is unfocused');
            };
        }, [])
    );

    useEffect(() => {
        const dataUserLogin = JSON.parse(localStorage.getItem('dataUser')!);
        setUserId(dataUserLogin._id);

        // Saat terkoneksi
        const newSocket = io(lisApi.socket, {
            transports: ['websocket'], // Pastikan menggunakan WebSocket
        });
        setSocket(newSocket);

        // Mendengarkan pesan yang diterima
        newSocket.on('getMessage', (message: Types.Message) => {
            console.log('message recent', message)
            // const mapData = new Map();
            data.data.set(message.from, {
                friendId: message.from,
                username: message.username,
                lastMessage: message.message,
                lastTimestamp: message.lastTimestamp
            })
            setData(prev => ({ ...prev, data: data.data, loading: false }))

        });

        newSocket.on('connect', () => {
            console.log('Connected to WebSocket');
            newSocket.emit('addUser', dataUserLogin._id); // Emit event menambahkan user online
        });

        newSocket.on('getMessage', (message: Types.Message) => {
            console.log('message recent', message)
            // const mapData = new Map();
            data.data.set(message.from, {
                friendId: message.from,
                username: message.username,
                lastMessage: message.message,
                lastTimestamp: message.lastTimestamp
            })
            setData(prev => ({ ...prev, data: data.data, loading: false }))

        });

        return () => {
            // newSocket.disconnect();
        };
    }, [data.data])


    const getData = async () => {
        const dataUserLogin = JSON.parse(localStorage.getItem('dataUser')!);
        const recantChat = await fetchData(
            `${lisApi.cawa}/chats/recent/${dataUserLogin._id}`,
            "GET"
        )

        const dataReceantChat = Array.from(recantChat)
        const mapData = new Map();
        dataReceantChat.forEach((item: any) => {
            mapData.set(item.friendId, {
                friendId: item.friendId,
                username: item.username,
                lastMessage: item.lastMessage,
                lastTimestamp: item.lastTimestamp
            })
        })

        setData(prev => ({ ...prev, data: mapData, loading: false }))
    }
    return (
        <>
            {
                data.loading ?
                    (<Text>Loading...</Text>) :
                    (<>
                        <Title />
                        <RecantChats data={data.data} />
                    </>
                    )

            }

        </>
    )
}