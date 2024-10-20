import AsyncStorage from '@react-native-async-storage/async-storage';

export async function storeDataStorage(value:any) {
    try {
      await AsyncStorage.setItem('@dataUser', value);
    } catch (e) {
        throw e
      // saving error
    }
  };

  export async function getDataStorage(){
    try {
      const value = await AsyncStorage.getItem('@dataUser');
      if (value !== null) {
        return JSON.parse(value)
      }
      return null
    } catch (e) {
        throw e
      // error reading value
    }
  };