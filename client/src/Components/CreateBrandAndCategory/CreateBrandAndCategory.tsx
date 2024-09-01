import axios, { AxiosResponse } from "axios";
import React, { useLayoutEffect, useState } from "react";
import { toast } from "react-toastify";
import { useGetBrandsAndCategorys } from "../../hooks/useGetBrandsAndCategorys";

function CreateBrandAndCategory() {

    const [base64Image, setBase64Image] = useState<string | null>(null);
    const [category, setCategory] = useState<string | null>(null);
    const [brand, setBrand] = useState<{ name: string, base64Photo: string }>({ name: "", base64Photo: "" });
    const { brands, categorys, error, loading, setBrands, setCategorys } = useGetBrandsAndCategorys();
    const URL = import.meta.env.VITE_SERVER as string; // Ensure the URL is correctly configured

    useLayoutEffect(() => {
        document.title = "Crée brand et Catégorie";
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-100 flex flex-row justify-center items-center">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-row justify-center items-center bg-slate-100 min-h-screen">
                <p className="leading-8">{error.message}</p>
            </div>
        );
    }

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            try {
                const base64 = await convertImageToBase64(file);
                setBase64Image(base64);
                setBrand((prev) => ({ ...prev, base64Photo: base64 }));
            } catch (error) {
                console.error('Error converting image to base64:', error);
            }
        }
    };

    const convertImageToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onload = () => {
                resolve(reader.result as string);
            };

            reader.onerror = (error) => {
                reject(error);
            };
        });
    };

    const handleSaveBrand = async () => {
        if (!brand.name.trim() || !brand.base64Photo?.trim()) {
            toast.warning("Entrer Le nom du Brande Et la Photo");
            return;
        }

        try {
            const response: AxiosResponse<any, any> = await axios.post(`${URL}/admin-category/create-brand`, brand, { withCredentials: true });
            if (response.data.success) {
                toast.success("Brand Crée avec Succès");
                setBrands((prev) => [...prev, response.data.brand]);
                setBrand({ name: "", base64Photo: "" }); // Reset the brand state
                setBase64Image(null); // Reset the image preview
            }
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                toast.warning(error.response?.data.message);
            } else {
                console.error(error);
                toast.error(error?.message);
            }
        }
    };

    const handleSaveCategory = async () => {
        if (!category?.trim()) {
            toast.warning("Entrer Le nom du Category");
            return;
        }

        try {
            const response: AxiosResponse<any, any> = await axios.post(`${URL}/admin-category/create-category`, { category_name: category }, { withCredentials: true });
            if (response.data.success) {
                toast.success("Category Crée avec Succès");
                setCategorys((prev) => [...prev, response.data.category]);
                setCategory(""); // Reset the category state
            }
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                toast.warning(error.response?.data.message);
            } else {
                console.error(error);
                toast.error(error?.message);
            }
        }
    };

    return (
        <div className="py-24 min-h-screen bg-slate-100">
            <div className="container mx-auto px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    <div className="flex flex-col justify-evenly items-center lg:items-start">
                        <form autoComplete='off' className="flex flex-col justify-evenly items-center gap-8 lg:items-start">
                            <label htmlFor="brand-name" className="py-2">Nom Du Brand:</label>
                            <input
                                type="text"
                                id="brand-name"
                                name="brand-name"
                                placeholder="Nom du Brand"
                                className="p-2 rounded-md"
                                value={brand.name}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBrand((prev) => ({ ...prev, name: e.target.value }))}
                            />

                            <label htmlFor="brand-file" className="pb-2 pt-4">Brand Photo</label>
                            <input
                                type="file"
                                name="brand-file"
                                id="brand-file"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </form>

                        <div className="w-full flex flex-row justify-center lg:justify-start items-center mt-8">
                            {base64Image && <img src={base64Image} className="h-24 w-24 rounded-md" alt="brand Image" />}
                        </div>

                        <button
                            type="button"
                            onClick={handleSaveBrand}
                            className="bg-green-500 hover:bg-green-600 transition-all p-3 mt-8 rounded-md text-white"
                        >
                            Enregistrer
                        </button>

                        <div className="mt-8">
                            {brands && brands.map((elem: any, index: number) => (
                                <div className="flex flex-row justify-center items-center gap-8" key={index}>
                                    <h2 className="text-2xl">{elem.name}</h2>
                                    <img src={elem.base64Photo} alt={elem.name} className="h-12 w-12 rounded-md" />
                                </div>
                            ))}
                        </div>
                    </div>


                    <div className="flex flex-col justify-evenly items-center lg:items-start">
                        <form autoComplete="off" className="flex flex-col justify-evenly items-start">
                            <label htmlFor="category" className="py-2">Ajouter Une Catégory:</label>
                            <input
                                type="text"
                                id="category"
                                placeholder="Catégorie"
                                className="p-2 rounded-md"
                                value={category ? category : ""}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCategory(e.target.value)}
                            />

                            <button
                                type="button"
                                onClick={handleSaveCategory}
                                className="bg-blue-500 hover:bg-blue-600 transition-all p-3 mt-8 rounded-md text-white"
                            >
                                Enregistrer
                            </button>
                        </form>

                        <div className="mt-8">
                            <h1 className="text-xl py-4">Categorys Déja Existe:</h1>
                            {categorys?.map((elem: any, index: number) => (
                                <h2 className="text-2xl py-3" key={index}>- {elem.categoryName}</h2>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default CreateBrandAndCategory;
