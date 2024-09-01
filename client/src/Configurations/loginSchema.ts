import * as yup from "yup";

export interface ILogin {
    email: string;
    password: string;
}


export const loginShema = yup.object<ILogin>().shape({
    email: yup.string().email("Entrer des Carateres e-mail").required("Entrer votre e-mail"),
    password: yup.string().required("Entrer votre Mot De passe"),
});