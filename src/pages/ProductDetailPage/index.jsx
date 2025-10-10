import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShoppingCart, ArrowLeft, Heart, Star, User } from "lucide-react";
import toast from "react-hot-toast";
import { useUserStore } from "../../stores/useUserStore";
import { useCartStore } from "../../stores/useCartStore";
import { useProductStore } from "../../stores/useProductStore";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUserStore();
  const { addToCart } = useCartStore();
  const { products, fetchAllProducts, loading: productsLoading } = useProductStore();
  const [isFavorite, setIsFavorite] = useState(false);

  // Busca o produto pelos dados do store
  const product = products.find(p => p._id === id);

  useEffect(() => {
    // Se não tem produtos carregados, busca todos
    if (products.length === 0) {
      fetchAllProducts();
    }
  }, [products.length, fetchAllProducts]);

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Faça login para adicionar produtos ao carrinho", { 
        id: "login",
        duration: 3000,
        style: {
          background: '#1f2937',
          color: '#fff',
          border: '1px solid #FF1493'
        }
      });
      navigate("/login");
      return;
    }

    if (!product) {
      toast.error("Produto não encontrado", { id: "product-not-found" });
      return;
    }

    addToCart(product);
    toast.success("Produto adicionado ao carrinho!", { 
      id: "cart-success",
      duration: 3000,
      style: {
        background: '#1f2937',
        color: '#fff',
        border: '1px solid #FF1493'
      }
    });
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const toggleFavorite = () => {
    if (!user) {
      toast.error("Faça login para favoritar produtos", { id: "login-favorite" });
      return;
    }
    setIsFavorite(!isFavorite);
    toast.success(
      isFavorite ? "Removido dos favoritos" : "Adicionado aos favoritos",
      {
        style: {
          background: '#1f2937',
          color: '#fff',
          border: '1px solid #FF1493'
        }
      }
    );
  };

  // Loading state
  if (productsLoading && products.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF1493] mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando produto...</p>
        </div>
      </div>
    );
  }

  // Product not found
  if (!product && !productsLoading) {
    return (
      <div className="text-center py-16">
        <h1 className="text-3xl font-bold text-white mb-4">Produto não encontrado</h1>
        <p className="text-gray-400 mb-6">O produto que você está procurando não existe ou foi removido.</p>
        <button
          onClick={handleGoBack}
          className="bg-[#FF1493] text-white px-6 py-3 rounded-lg hover:bg-[#E6127A] transition-colors"
        >
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Perfil do Usuário - Canto Superior */}
      {user && (
        <div className="flex justify-end mb-4">
          <div className="flex items-center bg-gray-800/50 rounded-lg px-4 py-2">
            <User size={20} className="text-[#FF1493] mr-2" />
            <span className="text-white font-medium">{user.name}</span>
            <span className="text-gray-400 ml-2">({user.email})</span>
          </div>
        </div>
      )}

      {/* Navegação */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={handleGoBack}
          className="flex items-center text-gray-300 hover:text-white transition-colors group"
        >
          <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Voltar
        </button>
        
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <span>Home</span>
          <span>/</span>
          <span>{product?.category || "Produto"}</span>
          <span>/</span>
          <span className="text-[#FF1493]">{product?.name}</span>
        </div>
      </div>

      {product && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Imagem do Produto */}
          <div className="space-y-4">
            <div className="relative group">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-96 lg:h-[500px] object-cover rounded-lg shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg" />
              
              {/* Badge de Produto em Destaque */}
              {product.isFeatured && (
                <div className="absolute top-4 left-4">
                  <span className="bg-gradient-to-r from-[#FF1493] to-[#E6127A] text-white px-3 py-1 rounded-full text-sm font-medium">
                    ⭐ Destaque
                  </span>
                </div>
              )}

              {/* Botão Favoritar */}
              <button
                onClick={toggleFavorite}
                className="absolute top-4 right-4 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
              >
                <Heart 
                  size={20} 
                  className={`${isFavorite ? 'fill-red-500 text-red-500' : 'text-white'} transition-colors`}
                />
              </button>
            </div>
          </div>

          {/* Informações do Produto */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-4">
                {product.name}
              </h1>
              
              {/* Categoria */}
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-sm text-gray-400 bg-gray-800 px-3 py-1 rounded-full">
                  {product.category}
                </span>
                {product.isFeatured && (
                  <span className="text-sm text-[#FF1493] bg-[#FF1493]/20 px-3 py-1 rounded-full">
                    Produto em Destaque
                  </span>
                )}
              </div>

              {/* Preço */}
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-5xl font-bold text-[#FF1493]">
                  R$ {typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
                </span>
              </div>
            </div>

            {/* Descrição */}
            <div className="border-t border-gray-700 pt-6">
              <h3 className="text-xl font-semibold text-white mb-3">
                Descrição do Produto
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {product.description || "Este é um produto de alta qualidade com excelente custo-benefício. Perfeito para quem busca qualidade e durabilidade."}
              </p>
            </div>

            {/* Informações Técnicas */}
            <div className="bg-gray-800/50 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-white mb-3">
                Informações do Produto
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">ID do Produto:</span>
                  <p className="text-white font-mono">{product._id}</p>
                </div>
                <div>
                  <span className="text-gray-400">Categoria:</span>
                  <p className="text-white capitalize">{product.category}</p>
                </div>
                <div>
                  <span className="text-gray-400">Status:</span>
                  <p className="text-green-400">Disponível</p>
                </div>
                <div>
                  <span className="text-gray-400">Adicionado em:</span>
                  <p className="text-white">
                    {product.createdAt ? new Date(product.createdAt).toLocaleDateString('pt-BR') : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Ações */}
            <div className="space-y-4 pt-6">
              <button
                onClick={handleAddToCart}
                className="w-full flex items-center justify-center px-8 py-4 rounded-lg text-lg font-medium bg-[#FF1493] text-white hover:bg-[#E6127A] hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#FF1493] focus:ring-opacity-50 transition-all duration-200"
              >
                <ShoppingCart size={24} className="mr-3" />
                Adicionar ao Carrinho
              </button>

              {user && (
                <button
                  onClick={() => navigate('/cart')}
                  className="w-full bg-transparent border-2 border-[#FF1493] text-[#FF1493] px-8 py-4 rounded-lg text-lg font-medium hover:bg-[#FF1493] hover:text-white transition-colors"
                >
                  Ver Carrinho
                </button>
              )}
            </div>

            {/* Informações de Entrega */}
            <div className="bg-gray-800/50 rounded-lg p-6 mt-8">
              <h4 className="text-lg font-semibold text-white mb-4">
                Informações de Entrega
              </h4>
              <ul className="text-gray-300 space-y-2">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-[#FF1493] rounded-full mr-3"></span>
                  Entrega rápida em até 3 dias úteis
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-[#FF1493] rounded-full mr-3"></span>
                  Frete grátis para compras acima de R$ 100
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-[#FF1493] rounded-full mr-3"></span>
                  Garantia de qualidade
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-[#FF1493] rounded-full mr-3"></span>
                  Suporte ao cliente 24/7
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;