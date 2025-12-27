import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Phone, Check, Send, Loader2 } from "lucide-react";
import { useUserStore } from "../../stores/useUserStore";
import { toast } from "react-hot-toast";

const PhoneVerification = ({ onComplete }) => {
  const { 
    user, 
    updatePhone,
    sendPhoneVerification, 
    verifyPhoneCode, 
    resendPhoneVerification,
    loading 
  } = useUserStore();
  
  const [phone, setPhone] = useState(user?.phone || "");
  const [code, setCode] = useState("");
  const [step, setStep] = useState(user?.phone ? "verify" : "add");

  useEffect(() => {
    // Se já está verificado, avançar automaticamente
    if (user?.phone && user?.phoneVerified) {
      onComplete();
    }
  }, [user, onComplete]);

  const formatPhoneNumber = (value) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, "");
    
    // Formato: +55 85 99999-9999
    if (numbers.length <= 2) return `+${numbers}`;
    if (numbers.length <= 4) return `+${numbers.slice(0, 2)} ${numbers.slice(2)}`;
    if (numbers.length <= 9) return `+${numbers.slice(0, 2)} ${numbers.slice(2, 4)} ${numbers.slice(4)}`;
    return `+${numbers.slice(0, 2)} ${numbers.slice(2, 4)} ${numbers.slice(4, 9)}-${numbers.slice(9, 13)}`;
  };

  const handleAddPhone = async () => {
    const cleanPhone = phone.replace(/\D/g, "");
    
    if (cleanPhone.length < 12 || cleanPhone.length > 13) {
      toast.error("Digite um número válido no formato: +55 85 99999-9999");
      return;
    }

    try {
      await updatePhone(`+${cleanPhone}`);
      setStep("verify");
      
      // Enviar código automaticamente após adicionar
      setTimeout(async () => {
        try {
          await sendPhoneVerification();
        } catch (error) {
          console.error("Erro ao enviar código:", error);
        }
      }, 500);
    } catch (error) {
      console.error("Erro ao adicionar telefone:", error);
    }
  };

  const handleVerifyCode = async () => {
    if (code.length !== 6) {
      toast.error("Digite o código de 6 dígitos");
      return;
    }

    try {
      await verifyPhoneCode(code);
      toast.success("Telefone verificado! ✅");
      setTimeout(() => onComplete(), 1000);
    } catch (error) {
      console.error("Erro ao verificar:", error);
    }
  };

  const handleResendCode = async () => {
    try {
      await resendPhoneVerification();
    } catch (error) {
      console.error("Erro ao reenviar:", error);
    }
  };

  const handleSendCode = async () => {
    try {
      await sendPhoneVerification();
    } catch (error) {
      console.error("Erro ao enviar código:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-md mx-auto"
    >
      <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white border-opacity-20">
        <div className="flex justify-center mb-6">
          {step === "verify" ? (
            <div className="w-16 h-16 bg-green-500 bg-opacity-20 rounded-full flex items-center justify-center">
              <Check className="h-10 w-10 text-green-400" />
            </div>
          ) : (
            <div className="w-16 h-16 bg-purple-500 bg-opacity-20 rounded-full flex items-center justify-center">
              <Phone className="h-10 w-10 text-purple-300" />
            </div>
          )}
        </div>

        <h2 className="text-2xl font-bold text-center text-white mb-2">
          {step === "verify" ? "Verificar Telefone" : "Adicionar Telefone"}
        </h2>
        <p className="text-center text-purple-200 mb-6">
          {step === "verify"
            ? "Digite o código de 6 dígitos enviado via SMS"
            : "Adicione seu número no formato internacional"}
        </p>

        {step === "add" ? (
          <div className="space-y-4">
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300 h-5 w-5" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
                placeholder="+55 85 99999-9999"
                maxLength={18}
                className="w-full pl-12 pr-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="bg-purple-900 bg-opacity-30 p-3 rounded-lg">
              <p className="text-purple-200 text-xs">
                <strong>💡 Formato:</strong> +55 (código do país) + DDD + número
              </p>
            </div>

            <button
              onClick={handleAddPhone}
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  Adicionar e Enviar Código
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-purple-900 bg-opacity-30 p-4 rounded-lg text-center">
              <p className="text-purple-200 text-sm mb-1">📱 SMS enviado para:</p>
              <p className="text-white font-semibold text-lg">{phone}</p>
            </div>

            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              onKeyPress={(e) => e.key === 'Enter' && handleVerifyCode()}
              placeholder="000000"
              maxLength={6}
              className="w-full px-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white text-center text-2xl tracking-widest placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            <button
              onClick={handleVerifyCode}
              disabled={loading || code.length !== 6}
              className="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Verificando...
                </>
              ) : (
                <>
                  <Check className="h-5 w-5" />
                  Verificar Código
                </>
              )}
            </button>

            <div className="flex flex-col gap-2">
              <button
                onClick={handleResendCode}
                disabled={loading}
                className="w-full text-purple-200 hover:text-white transition-colors duration-200 text-sm py-2"
              >
                Não recebeu? <span className="font-semibold">Reenviar código</span>
              </button>

              <button
                onClick={() => setStep("add")}
                className="w-full text-purple-300 hover:text-white transition-colors duration-200 text-sm"
              >
                ← Alterar número
              </button>
            </div>
          </div>
        )}

        <div className="mt-6 p-3 bg-yellow-900 bg-opacity-20 rounded-lg border border-yellow-500 border-opacity-30">
          <p className="text-yellow-200 text-xs text-center">
            ⚠️ Certifique-se de que seu telefone pode receber SMS
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default PhoneVerification;