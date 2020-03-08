import AsyncStorage from '@react-native-community/async-storage';

export const setToken = async (token) => {
    AsyncStorage.setItem('token', token);
}

export const storeNewDraft = async (draft) => {
    try {
        getDrafts().then(result => {
            var tempDrafts = JSON.parse(result);
            tempDrafts.push(draft);
            storeDrafts(JSON.stringify(tempDrafts));
        })
    } catch (e) {
        console.log(e);
    }
}

export const storeDrafts = async (drafts) => {
    try {
        await AsyncStorage.setItem('drafts', JSON.stringify(drafts))
    } catch (e) {
        console.log(e);
    }
}

export const getDrafts = async () => {
    try {
        const value = await AsyncStorage.getItem('drafts')
        if (value !== null) {
            return JSON.parse(value);
        }
    } catch (e) {
        console.log(e);
    }
}

export const removeDrafts = async () => {
    try {
        await AsyncStorage.removeItem('drafts')
    } catch (e) {
        console.log(e);
    }
}

export const deleteDraftAPI = async (index) => {
    try {
        getDrafts().then(result => {
            var tempDrafts = JSON.parse(result);
            tempDrafts.splice(index, 1);
            if (tempDrafts.length == 0) { // if drafts array is empty then remove from AsyncStorage
                removeDrafts();
            }
            else {
                storeDrafts(JSON.stringify(tempDrafts));
            }
        })
    } catch (e) {
        console.log(e);
    }
}