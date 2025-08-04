import Client from "./api";

export const getUserStats = async () => {
    try {
        const response = await Client.get('/stats/user/');
        return response.data;
    } catch (error) {
        throw error;
    }
};