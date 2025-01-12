import { useEffect, useState } from "react";
import { fetchGraphQL } from "../services/graphql/client";
import { GET_PRODUCT } from "../services/graphql/queries";
import { Product } from "../services/graphql/types";



interface ProductResponse {
    data: {
        product: Product;
    };
}

export const useProduct = (productId: string) => {
    const [product, setProduct] = useState<Product | null>(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetchGraphQL<ProductResponse>(GET_PRODUCT, {
                    id: productId,
                });
                setProduct(response.data.product);
            } catch (error) {
                console.error("Failed to fetch product:", error);
            }
        };
        fetchProduct();
    }, [productId]);

    return product;
};
