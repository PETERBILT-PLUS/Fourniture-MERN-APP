import * as yup from "yup";


interface IRegisterShema {
    nom: string;
    premon: string,
    adress: string;
    phrone: string,
    email: string;
    password: string;
    confirmPassword: string,
}

export const registerShema = yup.object<IRegisterShema>().shape({
    nom: yup.string().required("Entrer Votre Nom"),
    prenom: yup.string().required("Enter Votre Prenom"),
    adress: yup.string().required("Entrer Votre Adress"),
    phone: yup.string().required("Entrer Vitre Téléphone"),
    email: yup.string().email("Entrer Des Caracteres e-mail").required("Entrer votre Email"),
    password: yup.string().required("Entrer votre mot de passe"),
    confirmPassword: yup.string().oneOf([yup.ref("password", undefined)], "Le Mot De passe est non Valide"),
});