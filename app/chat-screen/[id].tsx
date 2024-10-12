import { useRouter, useLocalSearchParams } from 'expo-router';
import Chats from '@/components/Chats/Chats';
import { fetchData, lisApi } from '@/helper/api';
import { useEffect } from 'react';
import { View } from 'react-native';


export default function ChatScreenParent() {
  const router = useLocalSearchParams();

  useEffect(() => {
    getData();

  },[])

  const getData = async() => {
    const dataUserLogin = JSON.parse(localStorage.getItem('dataUser')!);
   const data =  await fetchData(
    `${lisApi.cawa}/chats/current/${dataUserLogin._id}/${router.id}`,
    "GET"
   )

  }

  return (
    <View>
      <Chats receiverId={router.id} />
    </View>
  );
}