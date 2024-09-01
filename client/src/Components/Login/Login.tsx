import { FormikHelpers, useFormik } from "formik";
import { ILogin, loginShema } from "../../Configurations/loginSchema.ts";
import { useLayoutEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { useDispatch } from "react-redux";
import { loginAdmin, logoutAdmin } from "../../Configurations/admin.ts";
import { loginUser, logoutUser } from "../../Configurations/main.ts";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import CustomSubmitButton from "../../SubComponents/CustomSubmitButton/CustomSubmitButton.tsx";


function Login() {
    const [loading, setLoading] = useState<boolean>(false);
    const URL: string = import.meta.env.VITE_SERVER as string;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useLayoutEffect(() => {
        document.title = "Se Connecté";
    }, []);

    const onSubmit = async (values: ILogin, actions: FormikHelpers<ILogin>) => {
        setLoading(true);
        try {
            const response: AxiosResponse<any, any> = await axios.post(`${URL}/auth/login`, values, { withCredentials: true });
            if (response.data.success) {
                if (response.data.admin) {
                    console.log(response.data.admin);
                    dispatch(logoutUser());
                    dispatch(loginAdmin(response.data.admin));
                } else if (response.data.user) {
                    dispatch(logoutAdmin());
                    dispatch(loginUser(response.data.user));
                }
                toast.success(response?.data?.message);
                actions.resetForm();
                setLoading(false);
                await new Promise((resolve) => setTimeout(resolve, 3000));
                navigate("/");
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.warning(error.response?.data.message || "An error occurred");
            } else {
                toast.error("Error occurred");
                console.error(error);
            }
        }
    };

    const { handleSubmit, handleChange, handleBlur, isSubmitting, values, touched, errors } = useFormik<ILogin>({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: loginShema,
        onSubmit,
    });

    return (
        <section className="py-24 bg-slate-100 flex justify-center items-center">
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700">Email:</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.email}
                            className={`mt-1 p-2 w-full border rounded-md ${touched.email && errors.email ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder="Enter your email"
                        />
                        {touched.email && errors.email ? (
                            <div className="text-red-500 text-sm">{errors.email}</div>
                        ) : null}
                    </div>

                    <div className="mb-6">
                        <label htmlFor="password" className="block text-gray-700">Password:</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.password}
                            className={`mt-1 p-2 w-full border rounded-md ${touched.password && errors.password ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder="Enter your password"
                        />
                        {touched.password && errors.password ? (
                            <div className="text-red-500 text-sm">{errors.password}</div>
                        ) : null}
                    </div>

                    <CustomSubmitButton value={"Enregistrer"} disabled={isSubmitting} loading={loading} />

                    <p className="leading-7 text-sm py-4">Vous n'avez pas de compte <Link className="text-sky-400" to="/register">S'inscrire</Link></p>
                </form>
            </div>
        </section>
    );
}

export default Login;
