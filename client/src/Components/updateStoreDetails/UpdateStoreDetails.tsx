import React, { useLayoutEffect, useState } from 'react';
import CustomSubmitButton from '../../SubComponents/CustomSubmitButton/CustomSubmitButton.tsx';
import axios, { AxiosResponse } from 'axios';
import { toast } from 'react-toastify';

function UpdateStoreDetails() {
    const [loading, setLoading] = useState<boolean>(false);
    const [details, setDetails] = useState<{ email?: string; phone?: string; detail?: string; description?: string }>({
        email: "",
        phone: "",
        detail: "",
        description: "",
    });

    const URL: string = import.meta.env.VITE_SERVER as string;

    useLayoutEffect(() => {
        document.title = "Magasin Détails";
    }, []);

    const submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response: AxiosResponse<any, any> = await axios.put(`${URL}/admin/set-store-details`, { storeData: details }, { withCredentials: true });
            if (response.data.success) {
                toast.success('Store details updated successfully!');
                localStorage.setItem("storeDetailId", response.data.store._id);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.warning(error.response?.data.message);
            } else {
                console.error(error);
                toast.error("An Error Happened, please check the console");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value,
        }));
    };

    return (
        <div className="py-24 min-h-screen bg-slate-100">
            <div className="container mx-auto px-8">
                <h2 className="text-3xl text-center text-sky-600 mb-8">Store Details:</h2>

                <div className="flex flex-row justify-center items-center">
                    <form onSubmit={submit} autoComplete="off" className="w-full max-w-md">
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-mail</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                value={details.email}
                                onChange={handleInputChange}
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Téléphone</label>
                            <input
                                type="text"
                                name="phone"
                                id="phone"
                                value={details.phone}
                                onChange={handleInputChange}
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="detail" className="block text-sm font-medium text-gray-700">Détail</label>
                            <input
                                type="text"
                                name="detail"
                                id="detail"
                                value={details.detail}
                                onChange={handleInputChange}
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
                            />
                        </div>

                        <div className="mb-6">
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                            <input
                                type="text"
                                name="description"
                                id="description"
                                value={details.description}
                                onChange={handleInputChange}
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
                            />
                        </div>

                        <CustomSubmitButton value="Enregistrer" disabled={loading} loading={loading} />
                    </form>
                </div>
            </div>
        </div>
    );
}

export default UpdateStoreDetails;
