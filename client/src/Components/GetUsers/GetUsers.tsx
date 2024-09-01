import { useLayoutEffect } from 'react'
import { useFetchUsers } from '../../hooks/useFetchUsers';
import axios, { AxiosResponse } from 'axios';
import { toast } from 'react-toastify';

function GetUsers() {

    const { data, setData, loading, error } = useFetchUsers();
    const URL = import.meta.env.VITE_SERVER as string;


    useLayoutEffect(() => {
        document.title = "Utilisateurs";
    }, []);
    

    if (loading) {
        return (
            <div className="flex flex-row justify-center items-center min-h-screen">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-row justify-center items-center min-h-screen">
                {error?.message}
            </div>
        );
    }

    const deleteUser = async (user_id: string) => {
        try {
            const response: AxiosResponse<any, any> = await axios.delete(`${URL}/admin/delete-user?user_id=${user_id}`, { withCredentials: true });

            if (response.data.success) {
                toast.success("Utilisateur supprimer avec Succès")
                setData((prev) => prev.filter((elem: any) => String(elem._id) !== String(user_id)));
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.warning(error.response?.data.message);
            } else {
                console.error(error);
                toast.error("An Error Happend");
            }
        }
    }

    return (
        <div className="py-24 min-h-screen bg-slate-100">
            <div className="container mx-auto px-8">


                <h2 className="pb-8 text-3xl text-center">Utilisateurs</h2>
                

                {!data.length && <h2 className="pb-6 text-2xl text-center">Pas D'utilisateurs</h2>}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {data?.map((elem: any, index: number) => {
                        return (
                            <div key={index} className="shadow-md rounded-md p-4 bg-white flex flex-col justify-center items-start">
                                <h3 className="text-xl my-2">Nom: {elem.nom} {elem.prenom}</h3>
                                <h4 className="text-xl text-sky-600 my-2">E-mail: {elem.email}</h4>
                                <button type="button" className="p-4 bg-red-600 my-6 rounded-md text-white" onClick={() => deleteUser(elem._id)}>Supprimer</button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    )
}

export default GetUsers;