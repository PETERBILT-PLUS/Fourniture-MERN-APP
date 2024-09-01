import axios, { AxiosResponse } from "axios";
import useProduct from "../../Configurations/basket.ts";
import { toast } from "react-toastify";
import { useEffect, useState, useLayoutEffect } from "react";


function Basket() {
    const { products, updateProduct, setProducts } = useProduct();
    const URL: string = import.meta.env.VITE_SERVER as string;
    const [basket, setBasket] = useState<any>([]);


    useLayoutEffect(() => {
        document.title = "Panier";
    }, []);

    useEffect(() => {
        const getBasket = async () => {
            try {
                const response: AxiosResponse<any, any> = await axios.get(`${URL}/user-basket/get-basket`, { withCredentials: true });
                if (response.data.success) {
                    setBasket(response.data.data);
                }
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    toast.warning(error.response?.data?.messsage);
                } else {
                    console.error(error);
                    toast.error("An Error Happend Check the Console");
                }
            }
        }

        getBasket();
    }, []);

    const decrement = async (_id: string) => {
        console.log(_id);
        try {
            const response: AxiosResponse<any, any> = await axios.post(`${URL}/user-basket/minus-product-quantity`, { product: { product: _id } }, { withCredentials: true });
            if (response.data.success) {
                console.log(response.data);
                const finder = response.data.basket.products.find((elem: any) => String(elem.product._id) === String(_id));
                if (!finder) {
                    setProducts([...products.filter((elem: any) => String(elem.product._id) !== String(_id))]);
                } else {
                    updateProduct(finder);
                }
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

    const increment = async (_id: string) => {
        try {
            const response: AxiosResponse<any, any> = await axios.post(`${URL}/user-basket/add-product-quantity`, { product: { _id: _id } }, { withCredentials: true });
            if (response.data.success) {
                updateProduct(response.data.basket.products.find((elem: any) => String(elem.product._id) === String(_id)))
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.warning(error.response?.data?.message);
            } else {
                console.error(error);
                toast.error("An Error Happend");
            }
        }
    }

    const makeOrder = async () => {
        try {
            const response: AxiosResponse<any, any> = await axios.post(`${URL}/order/create-order`, null, { withCredentials: true });
            if (response.data.success) {
                toast.success("Ordre Crée avec Succès");
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.warning(error.response?.data?.message);
            } else {
                console.error(error);
                toast.error("An Error Happend Check the console");
            }
        }
    }

    return (
        <div className="py-24 min-h-screen bg-slate-100">
            <div className="container mx-auto px-8">
                <h2 className="text-3xl text-center pb-16">Panier:</h2>

                {!products.length && <h3 className="text-center text-2xl">Pas De Produit</h3>}

                <div className="grid grid-cols-1 gap-10">
                    {products && products.map((elem: any, index: number) => {
                        if (!elem || !elem.product) return null;
                        return (
                            <div key={index} className="bg-white shadow-md grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 rounded-md">
                                <div className="flex flex-row justify-center items-center gap-10 h-auto md:col-span-1 w-full">
                                    <img className="w-full h-full rounded-md" src={elem.product.images[0]} alt={elem.product.name} />
                                </div>

                                <div className="grid grid-cols-2 md:col-span-2">

                                    <div className="col-span-2 flex flex-col justify-evenly items-center gap-3 lg:gap-0 lg:items-start lg:col-span-1 border-r-2 p-4">
                                        <h2 className="text-2xl py-1">Nom: {elem.product.name}</h2>
                                        <h3 className="text-2xl py-1">Prix: <span className="bg-green-500 px-2 py-1 rounded-md text-white">{elem.product.price} DH</span></h3>
                                        <div className="flex flex-row justify-start items-center gap-8 py-4">
                                            <h3 className="tect-2xl">Brand: {elem.product.brand.name}</h3>
                                            <img className="h-10 w-10 rounded-full" src={elem.product.brand.base64Photo} alt={elem.product.brand.name} />
                                        </div>
                                        <h3 className="text-xl">Quantité: {elem.quantity}</h3>
                                        <h3 className="text-xl mt-4">Stock: {elem.product.stock}</h3>
                                    </div>

                                    <div className="col-span-2 lg:col-span-1 p-4">
                                        <h2 className="text-2xl text-center py-1">Facture:</h2>
                                        <h2 className="text-2xl text-center py-1">{elem.product.price * elem.quantity} DH</h2>
                                        <div className="flex flex-row  justify-center items-center gap-8 mt-20">
                                            <button type="button" className="text-xl bg-red-500 px-4 py-2 rounded-md text-white" onClick={() => decrement(elem.product._id)}>-</button>
                                            <span>{elem.quantity}</span>
                                            <button type="button" className="text-xl bg-green-500 px-4 py-2 rounded-md text-white" onClick={() => increment(elem.product._id)}>+</button>
                                        </div>
                                    </div>


                                </div>

                            </div>
                        )
                    })}
                </div>

                <div className="flex flex-col justify-evenly items-center gap-8 py-24">
                    {!!products.length && <h3 className="text-center text-3xl py-6">Total: <span className="bg-green-500 p-2 rounded-md text-white">{products.map((elem: any) => elem.quantity * elem.product.price).reduce((prev, acc) => prev + acc, 0)} DH</span></h3>}
                    {!!products.length && <button type="button" className="bg-green-600 p-4 rounded-md text-white" onClick={() => makeOrder()}>Ordre Maintenant</button>}
                </div>
            </div>
        </div>
    )
}

export default Basket;