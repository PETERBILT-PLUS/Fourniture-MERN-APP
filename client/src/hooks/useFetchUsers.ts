import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react"
import { toast } from "react-toastify";


export const useFetchUsers = () => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<any>(null);
    const URL = import.meta.env.VITE_SERVER as string;

    useEffect(() => {
        const getUsers = async () => {
            setLoading(true)
            try {
                const response: AxiosResponse<any, any> = await axios.get(`${URL}/admin/get-users`, { withCredentials: true });
                if (response.data.success) {
                    setData(response.data.data);
                }
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    toast.warning(error.response?.data.message);
                    return false;
                } else {
                    setError(error);
                }
            } finally {
                setLoading(false);
            }
        }

        getUsers();
    }, []);

    return { data, setData, loading, error };
}