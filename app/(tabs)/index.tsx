import Title from "@/components/Chats/Title"
import RecantChats from "@/components/RecantChats/RecantChats"
import { fetchData, lisApi } from "@/helper/api"
import { useEffect, useState } from "react"
import { Text } from "react-native"

export default function RecantChatsParent() {
    const [data, setData] = useState({
        data: [],
        loading: true
    })

    useEffect(() => {
        getData()
    }, [])

    const getData = async () => {
        const dataUserLogin = JSON.parse(localStorage.getItem('dataUser')!);
        const recantChat = await fetchData(
            `${lisApi.cawa}/chats/recent/${dataUserLogin._id}`,
            "GET"
        )
        setData(prev => ({ ...prev, data: recantChat, loading: false }))
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