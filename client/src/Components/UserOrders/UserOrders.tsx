import { useLayoutEffect } from 'react'
import { useFetchOrders } from '../../hooks/useFetchOrders';

function UserOrders() {

    const { orders, loading, error } = useFetchOrders();

    useLayoutEffect(() => {
        document.title = "Mes Ordres";
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
            <div className="min-h-screen bg-slate-100 flex flex-row justify-center items-center">
                <h3 className="text-center text-3xl">{error?.message}</h3>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100 py-24">
            <div className="container mx-auto px-8">


                <h2 className="text-center text-3xl pb-14">Ordres:</h2>
                {!orders?.length && <h3 className="text-2xl text-center py-12">Pas D'ordre...</h3>}

                <div className="grid grid-cols-1">

                    {!!orders && orders?.map((obj: any) => {
                        return (
                            obj.products.map((elem: any) => {
                                return (
                                    <div className="rounded-md bg-white shadow-md grid grid-cols-1 lg:grid-cols-3">

                                        <div className="w-full h-auto rounded-md col-span-1">
                                            <img className="rounded-md w-full h-full" src={elem.product.images[0]} alt={elem.product.name} />
                                        </div>

                                        <div className="border-r-4 flex flex-col justify-start items-center lg:items-start py-8 gap-8 lg:gap-5 col-span-1 px-4">
                                            <h3 className="text-2xl text-center md:text-start">Nom: {elem.product.name}</h3>
                                            <h3 className="text-2xl text-center md:text-start">Prix: <span className="p-2 bg-green-500 rounded-md text-white">{elem.product.price}</span></h3>
                                            <h3 className="text-2xl text-center md:text-start">Quantité: <span className="p-2 bg-gray-500 rounded-md text-white">{elem.quantity}</span></h3>
                                            <h3 className="text-2xl text-center md:text-start">Total Produit: <span className="p-2 bg-sky-500 rounded-md text-white">{elem.quantity * elem.product.price}</span></h3>
                                        </div>

                                        <div className="col-span-1 flex flex-col justify-center underline items-center py-8">
                                            <h3 className="text-2xl text-center">Status: {obj.status === "pending" ? <span className="p-2 bg-sky-500 rounded-md text-white">{obj.status}</span> : <span className="p-2 bg-green-500 rounded-md text-white">{obj.status}</span>}</h3>
                                        </div>

                                    </div>
                                );
                            })


                        );
                    })}

                </div>
                {!!orders.length && <h4 className="text-3xl py-16 text-center">Total: <span className="p-2 bg-green-500 rounded-md text-white">{orders[0]?.totalAmount} DH</span></h4>}

            </div>
        </div>
    )
}

export default UserOrders;