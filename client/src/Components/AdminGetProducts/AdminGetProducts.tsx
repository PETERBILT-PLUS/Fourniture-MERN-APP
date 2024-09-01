import { useState, useLayoutEffect } from 'react';
import { useFetchProducts } from '../../hooks/useFetchProducts.ts';
import DeleteConfirmationModal from '../../SubComponents/CustomSubmitButton/Modal/Modal.tsx';
import axios, { AxiosResponse } from "axios";
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

function AdminGetProducts() {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [productToDelete, setProductToDelete] = useState<string | null>(null);
    const { data, setData, loading, error } = useFetchProducts();
    const URL = import.meta.env.VITE_SERVER as string;

    const handleDeleteClick = (productId: string) => {
        setProductToDelete(productId);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setProductToDelete(null);
    };

    useLayoutEffect(() => {
        document.title = "Mes Produit";
    }, []);

    const handleConfirmDelete = async () => {
        if (productToDelete) {
            try {
                const response: AxiosResponse<any, any> = await axios.delete(`${URL}/admin/delete-product?_id=${productToDelete}`, { withCredentials: true });
                if (response.data.success) {
                    toast.success("Produit supprimé avec succès");
                    setData((prev) => prev.filter((elem) => elem._id !== productToDelete));
                }
            } catch (error: any) {
                if (axios.isAxiosError(error)) {
                    toast.warning(error.response?.data.message || "Erreur lors de la suppression");
                } else {
                    console.error(error);
                    toast.error("Une erreur s'est produite");
                }
            } finally {
                handleCloseModal();
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen w-full flex justify-center items-center bg-gray-100">
                <span className="loading loading-lg loading-spinner text-blue-600"></span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen w-full flex justify-center items-center bg-red-100">
                <p className="text-red-600 text-xl">{error?.message}</p>
            </div>
        );
    }

    return (
        <div className="py-24 bg-gray-50 min-h-screen">
            <div className="container mx-auto px-8">
                <h2 className="text-4xl text-center pb-16 text-gray-800">Produits</h2>

                {!data.length && <h3 className="text-2xl text-center py-12 text-gray-500">Pas de Produits</h3>}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {data.map((elem: any, index: number) => {
                        return (
                            <div key={index} className="flex flex-col bg-white shadow-lg rounded-lg overflow-hidden">
                                {/* Product Image */}
                                <img
                                    className="w-full h-56 object-cover"
                                    src={elem.images[0] || 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Dacia_Logan_III_%28cropped%29.jpg/1200px-Dacia_Logan_III_%28cropped%29.jpg'}
                                    alt={elem.name}
                                />

                                <div className="p-4 flex flex-col justify-between">
                                    <div className="mb-4">
                                        <h3 className="text-lg font-semibold text-gray-700">Nom: {elem.name}</h3>
                                        <p className="text-lg text-green-500">Prix: {elem.price} DH</p>
                                        <p className="text-sm text-blue-500">Stock: {elem.stock}</p>
                                    </div>

                                    <div className="flex flex-row items-center">
                                        {/* Category Image */}
                                        <div>
                                            <h4 className="text-sm text-gray-600">Categorie: {elem.category.categoryName}</h4>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-row justify-start items-center px-4 pt-0 pb-4">
                                    <h3 className="text-sm">Brand: {elem.brand.name}</h3>
                                    {/* Brand Image */}
                                    <img
                                        className="w-12 ml-2"
                                        src={elem.brand.base64Photo}
                                        alt={`${elem.brand.name} image`}
                                    />
                                </div>

                                <div className="flex flex-row justify-start items-center gap-5 pb-10 pt-4 px-4">
                                    <Link to={`/admin/edit-product/${elem._id}`}><button type="button" className="bg-blue-500 hover:bg-blue-600 transition-all text-white px-4 py-4 rounded-md">Modifier</button></Link>
                                    <button type="button" onClick={() => handleDeleteClick(elem._id)} className="bg-red-500 hover:bg-red-600 transition-all text-white px-4 py-4 rounded-md">Supprimer</button>
                                </div>

                                <DeleteConfirmationModal
                                    isOpen={isModalOpen}
                                    onClose={handleCloseModal}
                                    onConfirm={handleConfirmDelete}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default AdminGetProducts;
