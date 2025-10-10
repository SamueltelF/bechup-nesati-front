// helpers/productHelpers.js
import fetcher from "../fetcher";

export const fetchProductsHelper = async (endpoint) => {
  const { data, error } = await fetcher(endpoint); // Use your custom fetcher
  if (error) {
    throw new Error(error.message || "Falha ao buscar produtos");
  }
  return data.products;
};
