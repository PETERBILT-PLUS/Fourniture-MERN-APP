import { Link } from "react-router-dom";
import SVG from "../../assets/undraw_mobile_search_jxq5.svg";
import axios, { AxiosResponse } from "axios";
import "./Home.css";
import { useLayoutEffect, useState } from "react";
import { toast } from "react-toastify";
import CustomSubmitButton from "../../SubComponents/CustomSubmitButton/CustomSubmitButton";

function Home() {
    const baseURL = import.meta.env.VITE_SERVER;
    const [name, setName] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    useLayoutEffect(() => {
        document.title = "Acceuil";
    }, [])


    const sendMessage = async () => {
        try {
            setLoading(true);
            if (!name || !message) return alert("Veuillez remplir tous les champs");

            const res: AxiosResponse<any, any> = await axios.post(`${baseURL}/message/send-user-message`, { message: message, name: name }, {
                withCredentials: true,
            });

            if (res.data.success) {
                toast.success("Message envoyé avec succès");
                setName("");
                setMessage("");
                return false;
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 400) {
                    toast.warning(error.response?.data.message);
                    return false;
                }
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <section className="py-12 hero-section min-h-screen">
                <div className="container mx-auto px-12">
                    <div className="flex flex-col justify-center items-center lg:items-start">
                        <h1 className="text-3xl text-white text-center lg:text-start py-8">Bienvenue chez Tajhizat Yasin | تجهيــزات ياسين</h1>
                        <p className="leading-8 w-1/2 text-lg text-white text-center lg:text-start">Chez Tajhizat Yasin, nous offrons des équipements de haute qualité pour répondre à tous vos besoins professionnels. Notre engagement est de fournir des solutions efficaces, fiables et à la pointe de la technologie pour vous aider à exceller dans votre domaine.</p>
                        <Link to="/products" className="py-8">
                            <button type="button" className="reserve-btn">Réserver Maintenant</button>
                        </Link>
                    </div>
                </div>
            </section>

            <section className="py-24 lg:py-4 why-us-section min-h-screen bg-slate-100">
                <div className="container flex-wrap lg:flex-nowrap mx-auto px-8 text-center lg:text-start md:px-24 lg:px-72 flex flex-col justify-center items-center gap-10">
                    <h2 className="text-center text-3xl pt-20">Pourquoi Nous:</h2>
                    <div className="">
                        <p className="leading-8 text-base">Nous sommes dédiés à fournir un service exceptionnel à nos clients. Avec une vaste gamme de produits, un service clientèle réactif et une expertise dans le domaine, Tajhizat Yasin est votre partenaire de confiance pour tous vos besoins en équipements professionnels.</p>
                    </div>

                    <div className="flex flex-row justify-center items-center">
                        <img src={SVG} className="self-center" style={{ width: "300px", height: "450px" }} alt="svg logo" />
                    </div>
                </div>
            </section>

            <section className="pt-24 lg:pt-14 min-h-screen bg-slate-100">
                <h2 className="text-center text-3xl py-20">Localisation GPS</h2>
                <iframe src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3325.596459348746!2d-7.720806124305409!3d33.537876073354894!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMzPCsDMyJzE2LjQiTiA3wrA0MycwNS42Ilc!5e0!3m2!1sen!2sma!4v1725123342157!5m2!1sen!2sma" width="600" height="450" style={{ border: "0" }} allowFullScreen={""} className="w-full min-h-screen" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
            </section>

        </div>
    )
}

export default Home;
