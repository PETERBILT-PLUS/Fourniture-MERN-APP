import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/autoplay';
import { useEffect, useLayoutEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios, { AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import useProduct from '../../Configurations/basket.ts';

function GetSingleProduct() {
    const params = useParams();
    const [product, setProduct] = useState<any>({});
    const [swiperSlider, setSwiperSlider] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const URL: string = import.meta.env.VITE_SERVER as string;
    const { products, setProducts } = useProduct();

    useLayoutEffect(() => {
        document.title = "Voir Produit";
    }, []);

    useEffect(() => {
        const getSingleProduct = async () => {
            setLoading(true)
            try {
                const response: AxiosResponse<any, any> = await axios.get(`${URL}/user/get-single-product?id=${params.id}`, { withCredentials: true });
                if (response.data.success) {
                    setProduct(response.data.product);
                }
            } catch (error: any) {
                if (axios.isAxiosError(error)) {
                    toast.warning(error.response?.data.message);
                } else {
                    console.error(error);
                    toast.error(error?.message);
                }
            } finally {
                setLoading(false);
            }
        }

        getSingleProduct();
    }, [params.id]);

    console.log(product);


    useLayoutEffect(() => {
        const handleResize = () => {
            const width = document.documentElement.offsetWidth;

            if (width < 768) {
                setSwiperSlider(1);
            } else if (width < 1024) {
                setSwiperSlider(2);
            } else {
                setSwiperSlider(3);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const addToCard = async () => {
        try {
            if (!params.id) return;
            const response: AxiosResponse<any, any> = await axios.post(`${URL}/user-basket/add-to-basket`, { product: { _id: params.id } }, { withCredentials: true });
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
                toast.error("Error Check the console");
            }
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-100 flex flex-row justify-center items-center">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }


    return (
        <div className="bg-slate-100 py-24 min-h-screen">
            <div className="container mx-auto">
                <Swiper
                    modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
                    spaceBetween={20}
                    slidesPerView={swiperSlider || 3}
                    navigation
                    pagination={{ clickable: true }}
                    scrollbar={{ draggable: true }}
                    autoplay={{ delay: 3000, disableOnInteraction: false }}
                    loop
                >
                    {!!product && product?.images?.map((elem: any, index: number) => (
                        <SwiperSlide key={index}>
                            <img
                                src={elem}
                                alt={product.name}
                                className="object-cover object-center w-full h-64 md:h-72 lg:h-80 rounded-lg"
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>

                <div className="container mx-auto px-8">

                    <div className="grid grid-cols-1 lg:grid-cols-2 py-24">
                        <div className="px-4 flex flex-col justify-evenly items-center lg:items-start border-t-4">
                            <h2 className="text-3xl py-3">Nom: <span className="p-2 bg-green-500 text-white rounded-md underline underline-offset-4">{product.name}</span></h2>
                            <h2 className="text-2xl py-3">Déscription: <span className="underline underline-offset-4">{product.description} DH</span></h2>
                            <h2 className="text-2xl py-3">Prix: {product.price} DH</h2>
                            <h3 className="text-2xl py-3">Stock: {product.stock} Pièce</h3>
                        </div>

                        <div className="flex flex-col justify-between items-center lg:items-start py-6 gap-10 border-t-4">
                            <div className="flex flex-row justify-evenly items-center gap-10">
                                <h3 className="text-2xl">Brand: {product?.brand?.name}</h3>
                                <img src={product?.brand?.base64Photo} className="h-12 w-12 rounded-full" alt={product?.brand?.name} />
                            </div>
                            <h3 className="text-2xl">Catégory: {product?.category?.categoryName}</h3>
                            <button type="button" className="px-4 py-3 text-white rounded-md bg-green-500" onClick={() => addToCard()}>Ajouter Au Panier</button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default GetSingleProduct;
