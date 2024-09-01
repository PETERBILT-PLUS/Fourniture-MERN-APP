import axios, { AxiosResponse } from "axios";
import { useFetchOrdersAdmin } from "../../hooks/useFetchOrdersAdmin";
import { useState, useLayoutEffect } from "react";
import { toast } from "react-toastify";
import { useSocketContext } from "../../context/socketContext";
import audio from "../../assets/sounds/notification.mp3";


function Orders() {
    const { data, setData, loading, error } = useFetchOrdersAdmin();
    const [status, setStatus] = useState<string>("pending");
    const [saveLoading, setSaveLoading] = useState<boolean>(false);
    const URL = import.meta.env.VITE_SERVER as string;
    const socket = useSocketContext();

    console.log(saveLoading);

    useLayoutEffect(() => {
        document.title = "Ordres";
    }, []);

    socket?.socket?.on("newOrder", (order: any) => {
        setData([...data, order]);
        const myAudio = new Audio(audio);
        myAudio.play();
    })


    useLayoutEffect(() => {
        document.title = "Ordres";
    }, []);

    if (loading) {
        return (
            <div className="flex flex-row justify-center items-center min-h-screen bg-gray-100">
                <span className="loading-spinner loading text-center text-5xl loading-lg"></span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen w-screen bg-gray-100 flex flex-row justify-center items-center">
                {error?.message}
            </div>
        );
    }

    const saveProduct = async (order_id: string, status: string) => {
        setSaveLoading(true);
        try {
            if (!order_id || !status) return toast.warning("Enter Tous les informations");
            const response: AxiosResponse<any, any> = await axios.post(`${URL}/admin-order/change-order-status`, { order_id, status }, { withCredentials: true });

            if (response.data.success) {
                toast.success("Produit améliorer avec Succès");
                data.forEach((elem: any) => {
                    if (elem._id === order_id) {
                        elem.status = status;
                    }
                });

            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.warning(error.response?.data.message);
            } else {
                toast.error("Interna Server Error");
            }
        } finally {
            setSaveLoading(false);
        }
    }

    const deleteProduct = async (order_id: string) => {
        try {
            if (!order_id) {
                toast.warning("Entre Tous les informations");
                return false;
            }

            const response: AxiosResponse<any, any> = await axios.delete(`${URL}/admin-order/delete-order?order_id=${order_id}`, { withCredentials: true });
            if (response.data.success) {
                toast.success("Ordre Supprimer avec Succcès");
                setData((prev) => prev.filter((elem: any) => {
                    String(elem._id) !== String(order_id)
                }))
            }

        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.warning(error.response?.data.message);
            }
        }
    }

    return (
        <div className="py-24 bg-gray-100 min-h-screen">
            <div className="container mx-auto px-8">
                <section className="mb-12">
                    <h1 className="text-3xl text-center pb-12 text-gray-800">Orders</h1>

                    {!data.length && <h1 className="text-2xl text-center pb-12 text-gray-800">Pas D'orders</h1>}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {data?.map((order: any, index: number) => (
                            <div key={index} className="bg-white rounded-lg shadow-lg p-6 flex flex-col space-y-4">

                                {/* Customer Details */}
                                <div className="flex flex-row justify-between items-center border-b pb-4">
                                    <div className="flex flex-col justify-between items-start">
                                        <h2 className="text-2xl font-semibold text-gray-800">{order.customer?.nom} {order.customer?.prenom}</h2>
                                        <p className="text-gray-600">{order?.customer?.phone}</p>
                                        <p className="text-gray-600">Status: <span className={`font-semibold ${order?.status === 'pending' ? 'text-yellow-600' : 'text-green-600'}`}>{order.status}</span></p>
                                        <p className="text-gray-600 mt-2">Total Amount: <span className="font-bold text-gray-800">${order?.totalAmount}</span></p>
                                        <p className="text-gray-400 mt-1 text-sm">Ordered on {new Date(order?.createdAt).toLocaleDateString()}</p>
                                        <details className="dropdown">
                                            <summary className="btn m-1 px-8">{order.status}</summary>
                                            <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                                                <li><button type="button" onClick={() => setStatus("pending")}>Pending</button></li>
                                                <li><button type="button" onClick={() => setStatus("shipped")} >Shipped</button></li>
                                                <li><button type="button" onClick={() => setStatus("delivered")}>Delivered</button></li>
                                                <li><button type="button" onClick={() => setStatus("canceled")}>Canceled</button></li>
                                            </ul>
                                        </details>
                                    </div>
                                    <div className="flex flex-col justify-end items-center">
                                        <button type="button" className=" bg-green-500 transition-all rounded-md text-white self-end hover:bg-green-600 py-4 px-6 my-2" onClick={() => saveProduct(order._id, status)}>Enregistrer</button>
                                        <button type="button" className="bg-red-500 transition-all rounded-md text-white self-end hover:bg-red-600 py-4 px-6 my-2" onClick={() => deleteProduct(order._id)}>Supprimer</button>
                                    </div>
                                </div>

                                {/* Products Section */}
                                <div className="space-y-4" >
                                    <h3 className="text-xl font-medium text-gray-700">Products:</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        {order.products.map((productItem: any, i: number) => (
                                            <div key={i} className="flex items-start bg-gray-50 p-4 rounded-lg shadow-md">
                                                <div className="w-24 h-24 overflow-hidden rounded-md shadow-md">
                                                    <img
                                                        className="object-cover object-center w-full h-full"
                                                        src={productItem?.product?.images[0] || "https://via.placeholder.com/150"}
                                                        alt={productItem?.product?.name || "Product Image"}
                                                    />
                                                </div>
                                                <div className="ml-4 flex-1">
                                                    <h4 className="text-lg font-semibold text-gray-800">{productItem?.product?.name}</h4>
                                                    <p className="text-gray-600">Quantity: {productItem?.quantity}</p>
                                                    <p className="text-gray-800 font-bold">Price: ${productItem?.product?.price}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                            </div>
                        ))}
                    </div>
                </section >
            </div >
        </div >
    );
}

export default Orders;
