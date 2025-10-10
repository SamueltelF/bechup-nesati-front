import React from "react";
import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import CartItem from "../../components/CartItem/CartItem";
import PeopleAlsoBought from "../../components/PeopleAlsoBought/PeopleAlsoBought";
import OrderSummary from "../../components/OrderSummary/OrderSummary";
import GiftCouponCard from "../../components/GiftCouponCard/GiftCouponCard";
import { useCartStore } from "../../stores/useCartStore";

const CartPage = () => {
  const { cart } = useCartStore();

  return (
    <div className="relative z-10 container mx-auto px-4 py-8 ">
      {cart.length > 0 && (
        <motion.h1
          className="text-4xl font-bold mb-8 text-[#FF1493] text-center"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Itens no Carrinho
        </motion.h1>
      )}
      <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
        <motion.div
          className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {cart.length === 0 ? (
            <EmptyCartUI />
          ) : (
            <div className="space-y-6">
              {cart.map((item) => (
                <CartItem key={item._id} item={item} />
              ))}
            </div>
          )}
        </motion.div>
        {cart.length > 0 && (
          <motion.div
            className="mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <OrderSummary />
            <GiftCouponCard />
          </motion.div>
        )}
      </div>
      <div>{cart.length > 0 && <PeopleAlsoBought />}</div>
    </div>
  );
};

export default CartPage;

const EmptyCartUI = () => (
  <motion.div
    className="flex flex-col items-center justify-center space-y-4 py-16"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <ShoppingCart className="h-24 w-24 text-gray-300" />
    <h3 className="text-2xl font-semibold">Seu carrinho está vazio</h3>
    <p className="text-gray-400">
      Parece que você ainda não adicionou nada ao seu carrinho.
    </p>
    <Link
      className="mt-4 rounded-md bg-[#FF1493] px-6 py-2 text-white transition-colors hover:bg-[#FF1493]"
      to="/"
    >
      Comece a Comprar
    </Link>
  </motion.div>
);
