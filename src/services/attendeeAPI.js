import Client from "./api";

export const getEventAttendees = async (eventId) => {
    try {
        const response = await Client.get(`/events/${eventId}/attendees/`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const joinEvent = async (eventId) => {
    try {
        const response = await Client.post(`/events/${eventId}/attend/`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const confirmAttendance = async (eventId) => {
    try {
        const response = await Client.post(`/events/${eventId}/confirm-attendance/`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const declineAttendance = async (eventId) => {
    try {
        const response = await Client.post(`/events/${eventId}/decline-attendance/`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const leaveEvent = async (eventId) => {
    try {
        const response = await Client.post(`/events/${eventId}/cancel-attendance/`);
        return response.data;
    } catch (error) {
        throw error;
    }
}