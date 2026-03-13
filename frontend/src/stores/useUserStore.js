import { create } from 'zustand';
import axiosInstance from '../lib/axios.js'; // axiosInstance
import axios from "axios";
import { toast } from "react-hot-toast";

export const useUserStore = create((set, get) => ({
    user: null,
    loading: false,
    checkingAuth: true,

    signup: async (signUpData) => {
        set({ loading: true });

        try {
            const { username, email, password, maSinhVien } = signUpData;
            const res = await axiosInstance.post("/auth/signup", 
                                         { username, email, password, maSinhVien });

            set({ user: res.data.userData, loading: false });

            toast.success(res.data.message || "Account created successfully!");
            console.log("SignUp res: " , res);
            console.log("SignUp res.data: ", res.data);

        } catch(error) {
            set({ loading: false });
            toast.error(error?.response?.data?.message || "An error occurred");
            console.error("❌ Signup error:", error);
        }
    },

    login: async (loginData) => {
        set({ loading: true });

        try {
            const { email, password } = loginData;
            const res = await axiosInstance.post("/auth/login", { email, password });

            set({ user: res.data.userData, loading: false });

            toast.success(res.data.message || "Account log in successfully!");
            console.log("Login res: " , res);
            console.log("Login res.data: ", res.data);

        } catch(error) {
            set({ loading: false });
            toast.error(error?.response?.data?.message || "An error occurred");
            console.error("❌ Login error:", error);
        }
    },

    loginWithGoogle: async (access_token) => {
        set({ loading: true });

        try {
            const res = await axiosInstance.post("/auth/google", { access_token });

            set({ user: res.data.userData, loading: false });
            toast.success(res.data.message || "Google login successful!");

        } catch (error) {
            console.error("❌ Google login error:", error);
            toast.error(error?.response?.data?.message || "Google login failed");
            set({ loading: false });
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
			set({ user: null });
        } catch(error) {
            toast.error(error.response?.data?.message || "An error occurred during logout");
            console.error("❌ Logout error:", error);
        }
    },

    checkAuth: async () => {
        set({ checkingAuth: true });
        try {
            const response = await axiosInstance.get("/auth/profile");
            set({ user: response.data, checkingAuth: false });

        } catch(error) {

            console.error("❌ CheckAuth error:", error.message);
			set({ checkingAuth: false, user: null });
        }
    },

}));
