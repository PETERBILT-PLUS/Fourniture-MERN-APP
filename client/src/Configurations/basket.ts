import { create } from "zustand";

interface IBrand {
    name: string;
    base64photo: string;
}

interface IProduct {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    brand: IBrand;
    stock: number;
    images: string[];
    createdAt: Date;
    updatedAt: Date;
}

interface ProductState {
    products: IProduct[];
    setProducts: (products: IProduct[]) => void;
    addProduct: (product: IProduct) => void;
    updateProduct: (updatedProduct: IProduct) => void;
    removeProduct: (productName: string) => void;
}

const useProduct = create<ProductState>((set) => ({
    products: [],
    setProducts: (products) => set({ products }),
    addProduct: (product) => set((state) => ({
        products: [...state.products, product],
    })),
    updateProduct: (updatedProduct) => set((state) => ({
        products: state.products.map((product) =>
            product._id === updatedProduct._id ? updatedProduct : product
        ),
    })),
    removeProduct: (productName) => set((state) => ({
        products: state.products.filter((product) => product.name !== productName),
    })),
}));

export default useProduct;
