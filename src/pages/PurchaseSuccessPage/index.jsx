import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { CheckCircle, HandHeart, ArrowRight } from "lucide-react";
import { useCartStore } from "../../stores/useCartStore";
import axiosBaseURL from "../../lib/axios";
import Confetti from "react-confetti";
import { useState } from "react";

const PurchaseSuccessPage = () => {
  const [isProcessing, setIsProcessing] = useState(true);
  const { clearCart } = useCartStore();
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleCheckoutSuccess = async (sessionId) => {
      try {
        // Limpar o carrinho após a compra bem-sucedida
        const response = await axiosBaseURL.post("/payments/checkout-success", {
          sessionId,
        });
        console.log("Resposta de sucesso do checkout: ", response);
        clearCart();
      } catch (error) {
        console.error("Erro ao limpar o carrinho: ", error);
      } finally {
        setIsProcessing(false);
      }
    };

    const session_id = new URLSearchParams(window.location.search).get(
      "session_id"
    );

    if (session_id) {
      handleCheckoutSuccess(session_id);
    } else {
      setIsProcessing(false);
      setError("Nenhum ID de sessão encontrado");
    }
  }, [clearCart]);

  if (isProcessing) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div className="h-screen flex items-center justify-center px-4">
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        gravity={0.1}
        style={{ zIndex: 99 }}
        numberOfPieces={700}
        recycle={false}
      />

      <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-xl overflow-hidden relative z-10">
        <div className="p-6 sm:p-8">
          <div className="flex justify-center">
            <CheckCircle className="text-[#FF1493] w-16 h-16 mb-4" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-center text-[#FF1493] mb-2">
            Compra Bem-Sucedida!
          </h1>

          <p className="text-gray-300 text-center mb-2">
            Obrigado pelo seu pedido!
          </p>
          <p className="text-[#FF1493] text-center text-sm mb-6">
            Verifique a caixa de spam do seu e-mail
          </p>
          <div className="bg-gray-700 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Suporte</span>
              <span className="text-sm font-semibold text-[#FF1493]">
                62 93618-0708
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Entrega estimada</span>
              <span className="text-sm font-semibold text-[#FF1493]">
                imediata
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <button
              className="w-full bg-[#FF1493] hover:bg-[#FF1493] text-white font-bold py-2 px-4
                rounded-lg transition duration-300 flex items-center justify-center"
            >
              <HandHeart className="mr-2" size={18} />
              Obrigado por confiar em nós!
            </button>
            <Link
              to={"/"}
              className="w-full bg-gray-700 hover:bg-gray-600 text-[#FF1493] font-bold py-2 px-4 
                rounded-lg transition duration-300 flex items-center justify-center"
            >
              Continuar Comprando
              <ArrowRight className="ml-2" size={18} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseSuccessPage;
