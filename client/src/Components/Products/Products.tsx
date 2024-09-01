import axios, { AxiosResponse } from "axios";
import { useFetchProducts } from "../../hooks/useFetchProducts";
import "./Products.css";
import { toast } from "react-toastify";
import useProduct from "../../Configurations/basket";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useLayoutEffect } from "react";

function Products() {
    const authAdmin = useSelector((state: any) => state.admin.admin);
    const { data, loading, error } = useFetchProducts();
    const URL: string = import.meta.env.VITE_SERVER as string;
    const { products, setProducts } = useProduct();


    useLayoutEffect(() => {
        document.title = "Produits";
    }, []);

    if (loading) {
        return (
            <div className="flex flex-row justify-center items-center min-h-screen bg-slate-100">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex flex-row justify-center items-center min-h-screen bg-slate-100">
                <p className="leading-8">{error?.message}</p>
            </div>
        );
    }

    const handleAddProduct = async (_id: string) => {
        try {
            const response: AxiosResponse<any, any> = await axios.post(`${URL}/user-basket/add-to-basket`, { product: { _id: _id } }, { withCredentials: true });
            if (response.data.success) {
                toast.success("Prodiot ajouté au panier avec Succès");
                console.log(response.data);

                setProducts([...response.data.basket.products]);
                console.log(products);
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
        <div className="bg-slate-100 py-24 min-h-screen">
            <div className="container mx-auto px-8">




                <h2 className="text-3xl text-center pb-24">Produits:</h2>

                {!data.length && <h3 className="text-2xl text-center">Pas De Produit</h3>}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {data && data.map((elem: any, index: number) => {
                        return (
                            <div className="card glass shadow-md" key={index}>
                                <figure>
                                    <img
                                        src={elem.images[0]}
                                        alt={elem.name} />
                                </figure>
                                <div className="card-body">
                                    <h2 className="card-title text-2xl">{elem.name}</h2>
                                    <h3 className="card-title text-xl">{elem.price} DH</h3>
                                    <p>déscription: {elem.description}</p>
                                    <div className="flex flex-row justify-start items-center gap-5">
                                        <h3 className="text-xl">Brand: {elem.brand.name}</h3>
                                        <img className="w-12 h-12 rounded-full" src={elem.brand.base64Photo} alt={elem.name} />
                                    </div>

                                    <div className="card-actions justify-end gap-4 pt-4">
                                        {!!!authAdmin && (
                                            <>
                                                <Link to={`/get-single-product/${elem._id}`}><button className="see">Voir</button></Link>
                                                <button className="add-to-basket" onClick={() => handleAddProduct(elem._id)}>Ajouter</button>
                                            </>
                                        )}

                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    )
}

export default Products;