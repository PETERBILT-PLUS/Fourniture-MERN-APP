import { Link } from "react-router-dom";
import "./Footer.css";
import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { toast } from "react-toastify";

function Footer() {

  const [loading, setLoading] = useState<boolean>(false);
  const URL: string = import.meta.env.VITE_SERVER as string;
  const [data, setData] = useState<any>({});

  console.log(loading);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const response: AxiosResponse<any, any> = await axios.get(`${URL}/user/get-store-details`);
        if (response.data.success) {
          setData(response.data.details);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.warning(error.response?.data.message);
        } else {
          console.error(error);
          toast.error("An Error Happend Please Check the console");
        }
      } finally {
        setLoading(false);
      }
    }

    getData();
  }, []);


  return (
    <footer className="py-16 bg-gray-900 text-white">
      <div className="container mx-auto px-8">
        <div className="flex flex-col lg:flex-row justify-between items-start flex-wrap bg-blend-darken">
          {/* Logo and Description */}
          <div className="w-full lg:w-1/4 mb-8 lg:mb-0">
            <h4 className="text-4xl text-center lg:text-left py-6">LOGO</h4>
            <p className="leading-8 py-4 text-center lg:text-left">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas culpa numquam fugiat maiores, tempore dicta.
            </p>
          </div>

          {/* Quick Links */}
          <div className="w-full lg:w-1/4 mb-8 lg:mb-0">
            <h4 className="text-4xl text-center lg:text-left py-6">Liens Rapides</h4>
            <div className="flex flex-col justify-evenly items-center lg:items-start gap-5">
              <Link to="/">Accueil</Link>
              <Link to="/products">Produits</Link>
              <Link to="/contact">Contact</Link>
            </div>
          </div>

          {/* Contact Us */}
          <div className="w-full lg:w-1/4 mb-8 lg:mb-0">
            <h4 className="text-4xl text-center lg:text-left py-6">Nous Contacter</h4>
            <div className="flex flex-col justify-evenly items-center lg:items-start gap-5">
              <p>Adresse: الرحمة شارع مولاي تهامي إقامة ضحى ولد حمد</p>
              <p>Téléphone: {data?.phoneNumber}</p>
              <p>Email: {data?.email}</p>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}

export default Footer;
