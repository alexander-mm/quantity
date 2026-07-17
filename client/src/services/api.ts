import axios from "axios";

import { env } from "@/config/env";

import { useAuthStore } from "@/store";

export const api = axios.create({

    baseURL: env.apiUrl,

    timeout: 10000,

    headers: {

        "Content-Type": "application/json"

    }

});

api.interceptors.request.use(

    (config) => {

        const token = useAuthStore.getState().token;

        if (token) {

            config.headers.Authorization = `Bearer ${token}`;

        }

        return config;

    },

    (error) => Promise.reject(error)

);