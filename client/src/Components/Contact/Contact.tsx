import axios, { AxiosResponse } from 'axios';
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { toast } from 'react-toastify';

function Contact() {
  const [loading, setLoading] = useState<boolean>(false);
  const URL: string = import.meta.env.VITE_SERVER as string;
  const [data, setData] = useState<any>({});

  useLayoutEffect(() => {
    document.title = "Contact";
  }, []);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-row justify-center items-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="bg-slate-100 py-24 min-h-screen">
      <div className="container mx-auto px-8">
        <div className="flex flex-col md:flex-row justify-center items-center gap-8">
          <h2 className="text-2xl">{data?.email}</h2>
          <h2 className="text-2xl">{data?.phoneNumber}</h2>
        </div>


        <div className="flex flex-col justify-start items-center mt-24">
          <div className="bg-white shadow-md max-w-md p-8 rounded-lg w-full">
            <p className="leading-8 text-center">Détail: {data?.detail}</p>
            <br />
            <hr />
            <br />
            <p className="leading-8 text-center">Déscription: {data?.description}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact;