import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { toast } from "react-toastify";



export const useFetchProducts = () => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<any>(null);
    const URL = import.meta.env.VITE_SERVER as string;

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response: AxiosResponse<any, any> = await axios.get(`${URL}/admin/get-products`, { withCredentials: true });
                if (response.data.success) {
                    setData(response.data.data);
                }
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    toast.warning(error.response?.data.messsage);
                } else {
                    console.error(error);
                    setError(error);
                }
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    return { data, setData, loading, error };
}