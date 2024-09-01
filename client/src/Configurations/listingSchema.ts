import * as yup from "yup";

export interface IListing {
    name: string;
    description: string;
    price: number;
    category: string;
    brand: string;
    stock: number;
    images: string[];
}

// Define the schema for the listing
export const listingSchema = yup.object<IListing>().shape({
    name: yup.string().required("Entrer le nom du produit"),
    description: yup.string().required("Entrer la description"),
    price: yup.number().required("Entrer le prix").positive("Le prix doit être positif"),
    category: yup.string().required("Entrer la catégorie"),
    brand: yup.string().required("Entrer le Brand"), // Reference the brand schema
    stock: yup.number().required("Entrer le stock").min(0, "Le stock ne peut pas être négatif"), // Ensuring stock is a non-negative number
    images: yup.array().of(yup.string().url("L'URL de l'image n'est pas valide")).required("Ajouter au moins une image")
});