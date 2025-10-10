import React, { useEffect, useState } from "react";
import CategoryItem from "../../components/CategoryItem/CategoryItem";
import { useProductStore } from "../../stores/useProductStore";
import FeaturedProducts from "../../components/FeaturedProducts/FeaturedProducts";
import { motion } from "framer-motion";
import { categories } from "../../utils/homeCategories/categories.js";
import { ChevronLeft, ChevronRight } from "lucide-react";

const HomePage = () => {
  const { fetchFeaturedProducts, products, isLoading } = useProductStore();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Dados do carrossel - banners promocionais
  const banners = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=400&fit=crop",
      title: "Ofertas Imperdíveis",
      subtitle: "Até 70% de desconto em produtos selecionados",
      bgColor: "from-purple-600 to-pink-600"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=400&fit=crop",
      title: "Frete Grátis",
      subtitle: "Em compras acima de R$ 99",
      bgColor: "from-blue-600 to-purple-600"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200&h=400&fit=crop",
      title: "Lançamentos",
      subtitle: "Confira as novidades da semana",
      bgColor: "from-pink-600 to-red-600"
    }
  ];

  useEffect(() => {
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);

  // Auto-play do carrossel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  return (
    <div className="relative min-h-screen text-white overflow-hidden ">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-20">
        
        {/* Carrossel de Banners */}
        <div className="relative w-full h-64 md:h-80 lg:h-96 mb-12 rounded-2xl overflow-hidden shadow-2xl">
          {banners.map((banner, index) => (
            <div
              key={banner.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${banner.bgColor} opacity-90`} />
              <img
                src={banner.image}
                alt={banner.title}
                className="w-full h-full object-cover mix-blend-overlay"
              />
              <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: index === currentSlide ? 1 : 0, y: index === currentSlide ? 0 : 20 }}
                  transition={{ duration: 0.6 }}
                  className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-2xl"
                >
                  {banner.title}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: index === currentSlide ? 1 : 0, y: index === currentSlide ? 0 : 20 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-xl md:text-2xl text-white drop-shadow-lg"
                >
                  {banner.subtitle}
                </motion.p>
              </div>
            </div>
          ))}

          {/* Botões de navegação */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 backdrop-blur-sm p-3 rounded-full transition-all duration-300 group"
          >
            <ChevronLeft className="text-white group-hover:scale-110 transition-transform" size={24} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 backdrop-blur-sm p-3 rounded-full transition-all duration-300 group"
          >
            <ChevronRight className="text-white group-hover:scale-110 transition-transform" size={24} />
          </button>

          {/* Indicadores */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "bg-white w-8"
                    : "bg-white/50 hover:bg-white/75"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Seção de Categorias */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 mb-8">
            Categorias
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {categories.map((category) => (
              <CategoryItem category={category} key={category.name} />
            ))}
          </div>
        </motion.div>

        {/* Seção de Produtos em Destaque por Categoria */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 mb-8">
            Ofertas do Dia
          </h2>
          {!isLoading && products.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.slice(0, 8).map((product) => (
                <div
                  key={product._id}
                  className="bg-gradient-to-br from-purple-800/40 to-pink-800/40 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-purple-500/30"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    {product.discount && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        -{product.discount}%
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-pink-400">
                        R$ {product.price?.toFixed(2)}
                      </span>
                      <button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg transition-all duration-300 font-medium">
                        Ver mais
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Seção "Você Pode Gostar" */}
        {!isLoading && products.length > 0 && (
          <FeaturedProducts featuredProducts={products} />
        )}
      </div>
    </div>
  );
};

export default HomePage;