import AsyncStorage from '@react-native-async-storage/async-storage';

const OFFLINE_KEYS = {
    PENDING_USER: 'pendingUser',
    PENDING_ANSWERS: 'pendingAnswers',
    PENDING_SETTINGS: 'pendingSettings',
    IS_OFFLINE: 'isOffline'
};

export const OfflineStorage = {
    async markOffline(isOffline = true) {
        await AsyncStorage.setItem(OFFLINE_KEYS.IS_OFFLINE, JSON.stringify(isOffline));
    },

    async isOffline() {
        const value = await AsyncStorage.getItem(OFFLINE_KEYS.IS_OFFLINE);
        return value === 'true';
    },

    async savePendingUser(userData) {
        await AsyncStorage.setItem(OFFLINE_KEYS.PENDING_USER, JSON.stringify(userData));
    },

    async getPendingUser() {
        const data = await AsyncStorage.getItem(OFFLINE_KEYS.PENDING_USER);
        return data ? JSON.parse(data) : null;
    },

    async savePendingAnswers(answers) {
        const existing = await this.getPendingAnswers();
        const updated = [...(existing || []), answers];
        await AsyncStorage.setItem(OFFLINE_KEYS.PENDING_ANSWERS, JSON.stringify(updated));
    },

    async getPendingAnswers() {
        const data = await AsyncStorage.getItem(OFFLINE_KEYS.PENDING_ANSWERS);
        return data ? JSON.parse(data) : [];
    },

    async savePendingSettings(settings) {
        await AsyncStorage.setItem(OFFLINE_KEYS.PENDING_SETTINGS, JSON.stringify(settings));
    },

    async getPendingSettings() {
        const data = await AsyncStorage.getItem(OFFLINE_KEYS.PENDING_SETTINGS);
        return data ? JSON.parse(data) : null;
    },

    async clearPendingData() {
        await AsyncStorage.multiRemove([
            OFFLINE_KEYS.PENDING_USER,
            OFFLINE_KEYS.PENDING_ANSWERS,
            OFFLINE_KEYS.PENDING_SETTINGS,
            OFFLINE_KEYS.IS_OFFLINE
        ]);
    }
};