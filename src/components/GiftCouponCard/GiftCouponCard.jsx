import React, { useEffect, useState } from "react";
import { useCartStore } from "../../stores/useCartStore";
import { motion } from "framer-motion";

const GiftCouponCard = () => {
  const [userInputCode, setUserInputCode] = useState("");
  const { coupon, isCouponApplied, applyCoupon, removeCoupon, getMyCoupon } =
    useCartStore();

  useEffect(() => {
    getMyCoupon();
  }, [getMyCoupon]);

  useEffect(() => {
    if (coupon) setUserInputCode(coupon.code);
  }, [coupon]);

  const handleApplyCoupon = () => {
    if (!userInputCode) return;
    applyCoupon(userInputCode);
  };

  const handleRemoveCoupon = async () => {
    await removeCoupon();
    setUserInputCode("");
  };

  return (
    <motion.div
      className="space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-sm sm:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="space-y-4">
        <div>
          <label
            htmlFor="voucher"
            className="mb-2 block text-sm font-medium text-gray-300"
          >
            Você tem voucher ou vale-presente?
          </label>
          <input
            type="text"
            id="voucher"
            className="block w-full rounded-lg border border-gray-600 bg-gray-700 
            p-2.5 text-sm text-white placeholder-gray-400 focus:border-[#FF1493] 
            focus:ring-[#FF1493]"
            placeholder="Enter code here"
            value={userInputCode}
            onChange={(e) => setUserInputCode(e.target.value)}
            required
          />
        </div>

        <motion.button
          type="button"
          className="flex w-full items-center justify-center rounded-lg bg-[#FF1493] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#FF1493] focus:outline-none focus:ring-4 focus:ring-[#FF1493]"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleApplyCoupon}
        >
          Aplicar código
        </motion.button>
      </div>
      {isCouponApplied && coupon && (
        <div className="mt-4">
          <h3 className="text-lg font-medium text-gray-300">Cupom Aplicado</h3>

          <p className="mt-2 text-sm text-gray-400">
            {coupon.code} - {coupon.discountPercentage}% off
          </p>

          <motion.button
            type="button"
            className="mt-2 flex w-full items-center justify-center rounded-lg bg-[#FF1493] 
            px-5 py-2.5 text-sm font-medium text-white hover:bg-[#FF1493] focus:outline-none
             focus:ring-4 focus:ring-[#FF1493]"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRemoveCoupon}
          >
            Remover cupom
          </motion.button>
        </div>
      )}

      {coupon && (
        <div className="mt-4">
          <h3 className="text-lg font-medium text-gray-300">
            Seu cupom disponível:
          </h3>
          <p className="mt-2 text-sm text-gray-400">
            {coupon.code} - {coupon.discountPercentage}% off
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default GiftCouponCard;
