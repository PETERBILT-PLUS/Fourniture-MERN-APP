import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react"
import { toast } from "react-toastify";


export const useFetchOrders = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<any>(null);
    const URL: string = import.meta.env.VITE_SERVER as string;


    useEffect(() => {
        const getOrders = async () => {
            setLoading(true);
            try {
                const response: AxiosResponse<any, any> = await axios.get(`${URL}/order/get-orders`, { withCredentials: true });
                if (response.data.success) {
                    setOrders(response.data.order);
                }
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    toast.warning(error.response?.data?.message);
                } else {
                    setError(error);
                    console.error(error);
                    toast.error("An Error Happend check the console...");
                }
            } finally {
                setLoading(false);
            }
        }
        getOrders();
    }, []);

    return { orders, loading, error };
}