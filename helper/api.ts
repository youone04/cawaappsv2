// import { dataUserLogin } from "./store"

export const lisApi = {
    cawa : 'http://localhost:3001',
    socket: 'http://localhost:8900'
}

export async function fetchData(endpoint:string, method:string, body: any = null){
    try {
        const friends = await fetch(`${endpoint}`, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: body
        })
        return await friends.json()
    } catch (error) {
        return error
    }
}