import {useLocalSearchParams } from 'expo-router';
import Chats from '@/components/Chats/Chats';
import { fetchData, lisApi } from '@/helper/api';
import { useEffect, useState } from 'react';
import { View } from 'react-native';




export default function ChatScreenParent() {
  const router = useLocalSearchParams();
  const [data, setData] = useState({
    data: [],
    loading: true
  })


  useEffect(() => {
    getData();

  },[])

  const getData = async() => {
    const dataUserLogin = JSON.parse(localStorage.getItem('dataUser')!);
   const data =  await fetchData(
    `${lisApi.cawa}/chats/current/${dataUserLogin._id}/${router.id}`,
    "GET"
   )
   setData(prev => ({ ...prev, data: data, loading: false })) 
  }

  return (
    <View>
      <Chats receiverId={router.id} data={data} />
    </View>
  );
}