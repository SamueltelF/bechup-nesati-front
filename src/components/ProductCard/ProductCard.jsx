import React from "react";
import { ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";
import { useUserStore } from "../../stores/useUserStore";
import { useCartStore } from "../../stores/useCartStore";
import { useNavigate } from "react-router-dom"; // Adicione esta importação

const ProductCard = ({ product }) => {
  const { user } = useUserStore();
  const { addToCart } = useCartStore();
  const navigate = useNavigate(); // Hook para navegação

  const handleAddToCart = (e) => {
    e.stopPropagation(); // Previne que o clique do botão acione o clique do card
    if (!user) {
      toast.error("Faça login para adicionar produtos ao carrinho", { id: "login" });
      return;
    } else {
      addToCart(product);
    }
  };

  const handleProductClick = () => {
    // Navega para a página do produto usando o ID
    navigate(`/produto/${product.id}`);
  };

  return (
    <div 
      className="flex w-full relative flex-col overflow-hidden rounded-lg border border-gray-700 shadow-lg cursor-pointer hover:border-[#FF1493] transition-colors"
      onClick={handleProductClick}
    >
      <div className="relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl">
        <img
          className="object-cover w-full"
          src={product.image}
          alt="product image"
        />
        <div className="absolute inset-0 bg-black bg-opacity-20" />
      </div>
      <div className="mt-4 px-5 pb-5">
        <h5 className="text-xl font-semibold tracking-tight text-white">
          {product.name}
        </h5>
        <div className="mt-2 mb-5 flex items-center justify-between">
          <p>
            <span className="text-3xl font-bold text-[#FF1493]">
              {product.price} R$
            </span>
          </p>
        </div>
        <button
          className="flex items-center justify-center rounded-lg bg-[#FF1493] px-5 py-2.5 text-center text-sm font-medium
       text-white hover:bg-[#FF1493] focus:outline-none focus:ring-4 focus:ring-[#FF1493]"
          onClick={handleAddToCart}
        >
          <ShoppingCart size={22} className="mr-2" />
          Carrinho
        </button>
      </div>
    </div>
  );
};

export default ProductCard;