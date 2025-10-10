import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useCartStore } from "../../stores/useCartStore";
import { MoveRight } from "lucide-react";
import axiosBaseURL from "../../lib/axios";
import { loadStripe } from "@stripe/stripe-js";

export const OrderSummary = () => {
  const stripePromise = loadStripe(
    "pk_live_51NFAveFEzCUcL26vubgynUhde9TGdM76Bv9ZR5AD2NmSYsRE7feZPpeyDhX6AqU3aPW2qdKwJ6fphd2Pw4cOWrl300O41aF9y1"
  );

  const { total, subTotal, coupon, isCouponApplied, cart } = useCartStore();

  const savings = subTotal && total ? subTotal - total : 0;

  const formattedSubtotal = subTotal ? subTotal.toFixed(2) : "0.00";
  const formattedTotal = total ? total.toFixed(2) : "0.00";
  const formattedSavings = savings ? savings.toFixed(2) : "0.00";

  const handlePayment = async () => {
    const stripe = await stripePromise;
    const res = await axiosBaseURL.post("/payments/create-checkout-session", {
      products: cart,
      couponCode: coupon ? coupon.code : null,
    });

    const session = res?.data;
    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      console.error("Error:", result.error);
    }
  };

  return (
    <motion.div
      className="space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-sm sm:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <p className="text-xl font-semibold text-[#FF1493]">Resumo do pedido</p>
      {/* space-y-4 means that the children of the div will have a space of 1rem
      between them. */}
      {/* and space-y-2 means that the children of the div will have a space of 0.5rem */}
      <div className="space-y-4">
        <div className="space-y-2">
          {/* dl means definition list. It is used to display a list of terms and their definitions. */}
          <dl className="flex items-center justify-between gap-4">
            {/* dt means definition term. It is used to define the term name. */}
            <dt className="text-base font-normal text-gray-300">
              Preço original
            </dt>
            {/* dd means definition description. It is used to define the term description. */}
            <dd className="text-base font-medium text-white">
              ${formattedSubtotal}
            </dd>
          </dl>

          {savings > 0 && (
            <dl className="flex items-center justify-between gap-4">
              <dt className="text-base font-normal text-gray-300">Desconto</dt>
              <dd className="text-base font-medium text-[#FF1493]">
                -${formattedSavings}
              </dd>
            </dl>
          )}

          {coupon && isCouponApplied && (
            <dl className="flex items-center justify-between gap-4">
              <dt className="text-base font-normal text-gray-300">
                Cupom ({coupon.code})
              </dt>
              <dd className="text-base font-medium text-[#FF1493]">
                -{coupon.discountPercentage}%
              </dd>
            </dl>
          )}
          <dl className="flex items-center justify-between gap-4 border-t border-gray-600 pt-2">
            <dt className="text-base font-bold text-white">Total</dt>
            <dd className="text-base font-bold text-[#FF1493]">
              ${formattedTotal}
            </dd>
          </dl>
        </div>

        <motion.button
          className="flex w-full items-center justify-center rounded-lg bg-[#FF1493] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#FF1493] focus:outline-none focus:ring-4 focus:ring-[#FF1493]"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePayment}
        >
          Fazer o pagamento
        </motion.button>

        <div className="flex items-center justify-center gap-2">
          <span className="text-sm font-normal text-gray-400">ou</span>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#FF1493] underline hover:text-[#FF1493] hover:no-underline"
          >
            Continuar comprando
            <MoveRight size={16} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
export default OrderSummary;
