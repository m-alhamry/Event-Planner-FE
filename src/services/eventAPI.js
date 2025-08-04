import Client from "./api";

export const getEvents = async (params = {}) => {
    try {
        const response = await Client.get("/events/", { params });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getEvent = async (eventId) => {
    try {
        const response = await Client.get(`/events/${eventId}/`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const createEvent = async (eventData) => {
    try {
        const response = await Client.post("/events/create/", eventData);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const updateEvent = async (eventId, eventData) => {
    try {
        const response = await Client.put(`/events/${eventId}/update/`, eventData);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const deleteEvent = async (eventId) => {
    try {
        await Client.delete(`/events/${eventId}/delete/`);
    } catch (error) {
        throw error;
    }
}

export const getMyEvents = async () => {
    try {
        const response = await Client.get("/events/my-events/");
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getMyAttendingEvents = async () => {
    try {
        const response = await Client.get("/events/my-attending/");
        return response.data;
    } catch (error) {
        throw error;
    }
}