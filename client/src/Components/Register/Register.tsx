import { FormikHelpers, useFormik } from 'formik';
import { useLayoutEffect, useState } from 'react';
import { registerShema } from '../../Configurations/registerSchema';
import axios from "axios";
import CustomSubmitButton from '../../SubComponents/CustomSubmitButton/CustomSubmitButton';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginAdmin, logoutAdmin } from '../../Configurations/admin';
import { loginUser, logoutUser } from '../../Configurations/main';

interface IFormValues {
    nom: string;
    prenom: string;
    adress: string;
    phone: string;
    email: string;
    password: string;
    confirmPassword: string;
}

function Register() {

    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const URL: string = import.meta.env.VITE_SERVER as string;
    const dispatch = useDispatch();

    useLayoutEffect(() => {
        document.title = "Crée un compte";
    }, []);

    const onSubmit = async (values: IFormValues, action: FormikHelpers<IFormValues>) => {
        setLoading(true);
        try {
            const response = await axios.post(`${URL}/auth/register`, values, { withCredentials: true });
            if (response.data.success) {
                toast.success(response.data.message);
                action.resetForm();
                if (response.data.isAdmin) {
                    dispatch(logoutUser());
                    dispatch(loginAdmin(response.data.admin));
                } else {
                    dispatch(logoutAdmin());
                    dispatch(loginUser(response.data.user));
                }
                await new Promise((resolve) => setTimeout(resolve, 3000));
                navigate("/");
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.warning(error.response?.data.message);
            } else {
                toast.error("An Error Happening Please Try Later");
            }
        } finally {
            setLoading(false);
        }
        action.setSubmitting(false);
    };

    const { handleSubmit, handleBlur, handleChange, isSubmitting, values, errors, touched } = useFormik<IFormValues>({
        initialValues: {
            nom: "",
            prenom: "",
            adress: "",
            phone: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
        validationSchema: registerShema,
        onSubmit,
    });

    return (
        <div className="py-24 bg-slate-100 flex justify-center items-center">
            <div className="max-w-md w-full">
                <form onSubmit={handleSubmit} autoComplete="off" className="w-full max-w-lg p-8 bg-white shadow-md rounded-lg">

                    <h1 className="text-2xl font-semibold py-8 text-center" style={{ color: "var(--light-blue)" }}>S'inscrire</h1>

                    <div className="mb-4">
                        <label htmlFor="nom" className="block text-sm font-medium text-gray-700">Nom:</label>
                        <input
                            type="text"
                            name="nom"
                            id="nom"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.nom}
                            className={`p-2 w-full border ${touched.nom && errors.nom ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            placeholder="Nom"
                        />
                        {touched.nom && errors.nom && <p className="text-red-500 text-sm mt-1">{errors.nom}</p>}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="prenom" className="block text-sm font-medium text-gray-700">Prénom:</label>
                        <input
                            type="text"
                            name="prenom"
                            id="prenom"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.prenom}
                            className={`p-2 w-full border ${touched.prenom && errors.prenom ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            placeholder="Prénom"
                        />
                        {touched.prenom && errors.prenom && <p className="text-red-500 text-sm mt-1">{errors.prenom}</p>}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="adress" className="block text-sm font-medium text-gray-700">Adresse:</label>
                        <input
                            type="text"
                            name="adress"
                            id="adress"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.adress}
                            className={`p-2 w-full border ${touched.adress && errors.adress ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            placeholder="Adresse"
                        />
                        {touched.adress && errors.adress && <p className="text-red-500 text-sm mt-1">{errors.adress}</p>}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Téléphone:</label>
                        <input
                            type="text"
                            name="phone"
                            id="phone"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.phone}
                            className={`p-2 w-full border ${touched.phone && errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            placeholder="Téléphone"
                        />
                        {touched.phone && errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email:</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.email}
                            className={`p-2 w-full border ${touched.email && errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            placeholder="Email"
                        />
                        {touched.email && errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mot de passe:</label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.password}
                            className={`p-2 w-full border ${touched.password && errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            placeholder="Mot de passe"
                        />
                        {touched.password && errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                    </div>

                    <div className="mb-6">
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirmer le mot de passe:</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            id="confirmPassword"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.confirmPassword}
                            className={`p-2 w-full border ${touched.confirmPassword && errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            placeholder="Confirmer le mot de passe"
                        />
                        {touched.confirmPassword && errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                    </div>

                    <CustomSubmitButton value={"Enregistrer"} disabled={isSubmitting} loading={loading} />

                    <p className="leading-7 text-sm py-4">Vous avez déja un compte <Link to="/login" className="text-sky-400">Se connecter</Link></p>
                </form>
            </div>
        </div >
    );
}

export default Register;
