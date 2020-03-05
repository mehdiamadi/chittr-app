import AsyncStorage from '@react-native-community/async-storage';

export const setToken = async(token) => {
    AsyncStorage.setItem('token', token);
}

export const setUserID = async(userID) => {
    AsyncStorage.setItem('userID', userID);
}

export let getToken = () => {
    return AsyncStorage.getItem('token');
}

export let getUserID = () => {
    return AsyncStorage.getItem('userID');
}