import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { OfflineStorage } from '../utils/offlineStorage';
import { API_CONFIG } from '../config/api.config';

const API_URL = API_CONFIG.BASE_URL;

const handleApiError = async (error) => {
    console.error('API Error:', error);
    await OfflineStorage.markOffline(true);
    
    Alert.alert(
        'Verbindingsfout',
        'We kunnen geen verbinding maken met de server. Je gegevens worden later automatisch gesynchroniseerd.',
        [{ text: 'OK' }]
    );
    
    return { offline: true };
};

class ApiService {
    static async syncOfflineData() {
        try {
            // Try to sync pending user first
            const pendingUser = await OfflineStorage.getPendingUser();
            if (pendingUser) {
                const user = await this.createUser(pendingUser.name, pendingUser.email);
                await AsyncStorage.setItem('userId', user.id.toString());
            }

            // Sync pending answers
            const userId = await AsyncStorage.getItem('userId');
            if (userId) {
                const pendingAnswers = await OfflineStorage.getPendingAnswers();
                for (const answer of pendingAnswers) {
                    await this.saveAnswers(userId, answer.role, answer.answers);
                }

                // Sync pending settings
                const pendingSettings = await OfflineStorage.getPendingSettings();
                if (pendingSettings) {
                    await this.updateUserSettings(userId, pendingSettings);
                }
            }

            // Clear pending data after successful sync
            await OfflineStorage.clearPendingData();
            await OfflineStorage.markOffline(false);
            return true;
        } catch (error) {
            console.error('Sync failed:', error);
            return false;
        }
    }

    static async createUser(name) {
        try {
            const response = await fetch(`${API_URL}/users/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name }),
            });

            if (!response.ok) {
                throw new Error('Failed to create user');
            }
            
            const data = await response.json();
            if (data && typeof data.id === 'number' && data.name === name) {
                await AsyncStorage.setItem('userId', data.id.toString());
                await AsyncStorage.setItem('userName', data.name);
                return data;
            } else {
                console.error('Invalid user data:', data);
                throw new Error(`Invalid user data received: ${JSON.stringify(data)}`);
            }
        } catch (error) {
            await OfflineStorage.savePendingUser({ name });
            return handleApiError(error);
        }
    }

    static async saveAnswers(userId, role, answers) {
        try {
            const response = await fetch(`${API_URL}/answers/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: userId, role, answers }),
            });

            if (!response.ok) {
                return handleApiError(new Error('Failed to save answers'));
            }
            return await response.json();
        } catch (error) {
            await OfflineStorage.savePendingAnswers({ role, answers });
            return handleApiError(error);
        }
    }

    static async getUserAnswers(userId) {
        try {
            const response = await fetch(`${API_URL}/users/${userId}/answers`);
            if (!response.ok) {
                return handleApiError(new Error('Failed to fetch answers'));
            }
            return await response.json();
        } catch (error) {
            return handleApiError(error);
        }
    }

    static async updateUserSettings(userId, settings) {
        if (!userId || isNaN(userId)) {
            throw new Error('Invalid user ID');
        }
        try {
            const response = await fetch(`${API_URL}/users/${userId}/settings`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings),
            });

            if (!response.ok) {
                return handleApiError(new Error('Failed to update settings'));
            }
            return await response.json();
        } catch (error) {
            await OfflineStorage.savePendingSettings(settings);
            return handleApiError(error);
        }
    }

    static async getUserSettings(userId) {
        if (!userId || isNaN(userId)) {
            throw new Error('Invalid user ID');
        }
        try {
            const response = await fetch(`${API_URL}/users/${userId}/settings`);
            if (!response.ok) {
                return handleApiError(new Error('Failed to fetch settings'));
            }
            return await response.json();
        } catch (error) {
            return handleApiError(error);
        }
    }

    static async deleteUser(userId) {
        try {
            const response = await fetch(`${API_URL}/users/${userId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) {
                throw new Error('Failed to delete user');
            }

            // Clear local storage
            await AsyncStorage.multiRemove([
                'userId',
                'userName',
                'userRole'
            ]);

            // Clear offline storage
            await OfflineStorage.clearPendingData();

            return true;
        } catch (error) {
            console.error('Delete user error:', error);
            return handleApiError(error);
        }
    }

    static async updateUser(userId, userData) {
        if (!userId || isNaN(userId)) {
            throw new Error('Invalid user ID');
        }
        try {
            const response = await fetch(`${API_URL}/users/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                throw new Error('Failed to update user');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Update user error:', error);
            return handleApiError(error);
        }
    }
}

export default ApiService; 