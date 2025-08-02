import Client from "./api";

export const signup = async (userData) => {
    try {
        const response = await Client.post("/auth/signup/", userData);
        if (response.data && response.data.access_token && response.data.refresh_token) {
            const { access_token, refresh_token, user } = response.data;
            // Store tokens and user data in local storage
            localStorage.setItem("access_token", access_token);
            localStorage.setItem("refresh_token", refresh_token);
            localStorage.setItem("user", JSON.stringify(user));
            // Set the Authorization header for future requests
            Client.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
            return user;
        }
        throw new Error("Signup failed: Invalid response data");
    } catch (error) {
        console.error("Signup error:", error);
        throw error;
    }
}

export const signin = async (credentials) => {
    try {
        const response = await Client.post("/auth/signin/", credentials);
        if (response.data && response.data.access_token && response.data.refresh_token) {
            const { access_token, refresh_token, user } = response.data;
            // Store tokens and user data in local storage
            localStorage.setItem("access_token", access_token);
            localStorage.setItem("refresh_token", refresh_token);
            localStorage.setItem("user", JSON.stringify(user));
            // Set the Authorization header for future requests
            Client.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
            return user;
        }
        throw new Error("Signin failed: Invalid response data");
    } catch (error) {
        console.error("Signin error:", error);
        throw error;
    }
}

export const logout = async () => {
    try {
        const refreshToken = localStorage.getItem("refresh_token");
        if (refreshToken) {
            await Client.post("/auth/logout/", { refresh_token: refreshToken });
        }
    }
    catch (error) {
        console.error("Logout error:", error);
    } finally {
        // Clear local storage and remove Authorization header
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
        delete Client.defaults.headers.common["Authorization"];
        window.location.href = "/"; // Redirect to login page
    }
}

export const getProfile = async () => {
    try {
        const response = await Client.get("/auth/profile/");
        return response.data;
    } catch (error) {
        console.error("Get profile error:", error);
        throw error;
    }
}

export const updateProfile = async (profileData) => {
    try {
        const response = await Client.put("/auth/profile/", profileData);
        const updatedUser = response.data;
        // Update local storage with new user data
        localStorage.setItem("user", JSON.stringify(updatedUser));
        return updatedUser;
    } catch (error) {
        console.error("Update profile error:", error);
        throw error;
    }
}

export const updatePassword = async (passwordData) => {
    try {
        const response = await Client.put("/auth/password-update/", passwordData);
        const { access_token, refresh_token } = response.data;
        // Update tokens in local storage
        if (access_token && refresh_token) {
            localStorage.setItem("access_token", access_token);
            localStorage.setItem("refresh_token", refresh_token);
            Client.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
        }
        return response.data;
    } catch (error) {
        console.error("Update password error:", error);
        throw error;
    }
}

// Uncomment if I want to implement account deletion
// export const deleteAccount = async () => {
//     try {
//         await Client.delete("/auth/delete-account");
//         // Clear local storage and remove Authorization header
//         localStorage.removeItem("access_token");
//         localStorage.removeItem("refresh_token");
//         localStorage.removeItem("user");
//         delete Client.defaults.headers.common["Authorization"];
//         window.location.href = "/"; // Redirect to login page
//     } catch (error) {
//         console.error("Delete account error:", error);
//         throw error;
//     }
// }