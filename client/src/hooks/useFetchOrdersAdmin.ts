import React, { useState, useEffect } from "react";
import axios, { AxiosResponse } from "axios";
import { toast } from "react-toastify";


export const useFetchOrdersAdmin = () => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<any>(null);
    const URL = import.meta.env.VITE_SERVER as string;

    useEffect(() => {
        const useFetchData = async () => {
            try {
                setLoading(true);
                const response: AxiosResponse<any, any> = await axios.get(`${URL}/admin-order/get-orders`, { withCredentials: true });
                if (response.data.success) {
                    setData(response.data.data);
                }
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    toast.warning(error.response?.data.message);
                    setError(error);
                } else {
                    console.error(error);
                    setError(error);
                    toast.error("an Error Happend please try Later");
                }
            } finally {
                setLoading(false);
            }
        }
        useFetchData();
    }, []);

    return { data, setData, loading, error };
};