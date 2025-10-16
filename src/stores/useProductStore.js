import { create } from "zustand";
import toast from "react-hot-toast";
import axiosBaseURL from "../lib/axios";
import { cacheChecking } from "../helpers/cacheHelper";

export const useProductStore = create((set, get) => ({
  products: [],
  loading: false,
  cacheTimestamp: null,

  setProducts: (products) => set({ products }),

  createProduct: async (productData) => {
  try {
    set({ loading: true });
    if (!productData.image) {
      set({ loading: false });
      return toast.error("Por favor selecione uma imagem");
    }
    // MUDANÇA: endpoint agora é /products/create
    const response = await axiosBaseURL.post("/products/create", productData);
    
    set((prevState) => ({
      products: [...prevState.products, response.data.product],
      loading: false,
    }));
    toast.success("Produto criado com sucesso");
  } catch (error) {
    set({ loading: false });
    toast.error(error?.response?.data.message || "Erro ao criar produto");
  }
},

  fetchAllProducts: async (forceRefetch = false) => {
    // if (cacheChecking(get, forceRefetch)) return;

    set({ loading: true });

    try {
      const response = await axiosBaseURL.get("/products");
      set({
        products: response?.data?.products,
        cacheTimestamp: Date.now(),
        loading: false,
      });
    } catch (error) {
      set({ loading: false });
      toast.error(error?.response?.data.error || "Failed to fetch product");
    }
  },

  fetchProductsByCategory: async (category) => {
    set({ loading: true });
    try {
      const response = await axiosBaseURL.get(`/products/category/${category}`);
      set({ products: response?.data?.products, loading: false });
    } catch (error) {
      set({ loading: false });
      toast.error(
        error?.response?.data.error || "Failed to fetch products by category"
      );
    }
  },

  deleteProduct: async (productId) => {
  set({ loading: true });
  try {
    // MUDANÇA: endpoint agora é /products/delete/:id
    await axiosBaseURL.delete(`/products/delete/${productId}`);
    set((prevState) => ({
      products: prevState.products.filter(
        (product) => product._id !== productId
      ),
      loading: false,
    }));
    toast.success("Produto deletado com sucesso");
  } catch (error) {
    set({ loading: false });
    toast.error(error?.response?.data.message || "Erro ao deletar produto");
  }
},

  toggleFeaturedProduct: async (productId) => {
    set({ loading: true });
    try {
      const response = await axiosBaseURL.patch(`/products/${productId}`);
      const updatedProduct = response?.data?.updatedProduct;

      set((prevProducts) => ({
        products: prevProducts.products.map((product) =>
          product._id === productId
            ? { ...product, isFeatured: updatedProduct.isFeatured }
            : product
        ),
        loading: false,
      }));
      toast.success("Product updated successfully");
    } catch (error) {
      set({ loading: false });
      toast.error(error?.response?.data.error || "Failed to update product");
    }
  },
  fetchFeaturedProducts: async () => {
    set({ loading: true });
    try {
      const response = await axiosBaseURL.get("/products/featured");
      console.log("Featured products response:", response);
      set({ products: response?.data?.products, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch products", loading: false });
      console.log("Error fetching featured products:", error);
    }
  },
  fetchMyProducts: async (filters = {}) => {
  set({ loading: true });
  try {
    const response = await axiosBaseURL.get("/products/my-products", {
      params: filters
    });
    set({ 
      products: response?.data?.products, 
      loading: false 
    });
    return response.data;
  } catch (error) {
    set({ loading: false });
    toast.error(error?.response?.data.message || "Erro ao buscar produtos");
  }
},

// Atualizar produto
updateProduct: async (productId, productData) => {
  set({ loading: true });
  try {
    const response = await axiosBaseURL.put(`/products/update/${productId}`, productData);
    
    set((prevState) => ({
      products: prevState.products.map((product) =>
        product._id === productId ? response.data.product : product
      ),
      loading: false,
    }));
    toast.success("Produto atualizado com sucesso");
    return response.data.product;
  } catch (error) {
    set({ loading: false });
    toast.error(error?.response?.data.message || "Erro ao atualizar produto");
    throw error;
  }
},

// Atualizar estoque
updateStock: async (productId, stock) => {
  set({ loading: true });
  try {
    const response = await axiosBaseURL.patch(`/products/stock/${productId}`, { stock });
    
    set((prevState) => ({
      products: prevState.products.map((product) =>
        product._id === productId ? response.data.product : product
      ),
      loading: false,
    }));
    toast.success("Estoque atualizado com sucesso");
  } catch (error) {
    set({ loading: false });
    toast.error(error?.response?.data.message || "Erro ao atualizar estoque");
  }
},

// Buscar produtos de um vendedor específico
fetchVendorProducts: async (vendorId, filters = {}) => {
  set({ loading: true });
  try {
    const response = await axiosBaseURL.get(`/products/vendor/${vendorId}`, {
      params: filters
    });
    set({ 
      products: response?.data?.products, 
      loading: false 
    });
    return response.data;
  } catch (error) {
    set({ loading: false });
    toast.error(error?.response?.data.message || "Erro ao buscar produtos");
  }
},

// Buscar detalhes de um produto
fetchProductDetails: async (productId) => {
  set({ loading: true });
  try {
    const response = await axiosBaseURL.get(`/products/details/${productId}`);
    set({ loading: false });
    return response.data;
  } catch (error) {
    set({ loading: false });
    toast.error(error?.response?.data.message || "Erro ao buscar produto");
    return null;
  }
},
}));
