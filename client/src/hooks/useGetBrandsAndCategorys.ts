import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react"
import { toast } from "react-toastify";


export const useGetBrandsAndCategorys = () => {
    const [categorys, setCategorys] = useState<any[]>([]);
    const [brands, setBrands] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<any>(null);
    const URL = import.meta.env.VITE_SERVER as string;


    useEffect(() => {
        const useFetchBrandsAndCategorys = async () => {
            setLoading(true);
            try {
                const response: AxiosResponse<any, any> = await axios.get(`${URL}/admin-category/get-category-product`);
                if (response.data.success) {
                    setCategorys(response.data.data.categorys);
                    setBrands(response.data.data.brands);
                }
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    toast.warning(error.response?.data.message);
                } else {
                    toast.error("An Error Happend");
                    console.error(error);
                    setError(error);
                }
            } finally {
                setLoading(false);
            }
        }

        useFetchBrandsAndCategorys();
    }, []);

    return { categorys, setCategorys, brands, setBrands, loading, error };
}