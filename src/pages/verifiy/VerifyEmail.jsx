import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../stores/useUserStore";
import { toast } from "react-hot-toast";
import axios from "axios";

const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const { user, refreshUser } = useUserStore();
  
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [canResend, setCanResend] = useState(true);
  
  const inputRefs = useRef([]);

  // Redirecionar se email já está verificado
  useEffect(() => {
    if (user?.emailVerified) {
      toast.success("Seu email já está verificado!");
      navigate("/profile");
    }
  }, [user, navigate]);

  // Timer para reenvio
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  // Enviar código inicial automaticamente
  useEffect(() => {
    if (user && !user.emailVerified) {
      handleSendCode();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSendCode = async () => {
    setIsSending(true);
    try {
      const response = await axios.post("/api/auth/send-email-verification");
      toast.success(response.data.message);
      setTimeLeft(300); // 5 minutos = 300 segundos
      setCanResend(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Erro ao enviar código");
    } finally {
      setIsSending(false);
    }
  };

  const handleResendCode = async () => {
    if (!canResend) return;
    
    setIsSending(true);
    try {
      const response = await axios.post("/api/auth/resend-email-verification");
      toast.success(response.data.message);
      setTimeLeft(300);
      setCanResend(false);
      // Limpar código atual
      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (error) {
      const message = error.response?.data?.message || "Erro ao reenviar código";
      toast.error(message);
      // Se receber erro de rate limit, extrair tempo restante
      if (error.response?.status === 429) {
        const match = message.match(/(\d+)/);
        if (match) {
          setTimeLeft(parseInt(match[1]) * 60);
          setCanResend(false);
        }
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleChange = (index, value) => {
    if (value.length > 1) {
      value = value[0];
    }

    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus próximo input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-verificar quando completar 6 dígitos
    if (index === 5 && value) {
      const fullCode = newCode.join("");
      if (fullCode.length === 6) {
        handleVerify(fullCode);
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    
    if (!/^\d+$/.test(pastedData)) {
      toast.error("Cole apenas números");
      return;
    }

    const newCode = pastedData.split("").concat(Array(6).fill("")).slice(0, 6);
    setCode(newCode);

    // Auto-verificar se colar 6 dígitos
    if (pastedData.length === 6) {
      handleVerify(pastedData)
    } else {
      // Focar no próximo input vazio
      const nextIndex = Math.min(pastedData.length, 5)
      inputRefs.current[nextIndex]?.focus()
    }
  };

  const handleVerify = async (codeString = null) => {
    const finalCode = codeString || code.join("");
    
    if (finalCode.length !== 6) {
      toast.error("Digite o código completo");
      return;
    }

    setIsVerifying(true);
    try {
      const response = await axios.post("/api/auth/verify-email", { code: finalCode });
      toast.success(response.data.message);
      
      // Atualizar dados do usuário
      await refreshUser();
      
      // Redirecionar após 1.5s
      setTimeout(() => {
        navigate("/profile");
      }, 1500);
      
    } catch (error) {
      const message = error.response?.data?.message || "Erro ao verificar código";
      toast.error(message);
      
      // Limpar código se inválido
      if (message.includes("inválido") || message.includes("expirado")) {
        setCode(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-gradient-to-br from-purple-800/40 to-pink-800/40 backdrop-blur-sm rounded-3xl shadow-2xl border border-purple-500/30 overflow-hidden">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-8 text-center relative">
            <button
              onClick={() => navigate("/profile")}
              className="absolute left-4 top-4 text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail size={40} className="text-purple-600" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Verificar Email
            </h1>
            <p className="text-purple-100">
              Digite o código enviado para
            </p>
            <p className="text-white font-semibold mt-1">
              {user?.email}
            </p>
          </div>

          {/* Content */}
          <div className="p-8">
            
            {/* Código Inputs */}
            <div className="flex justify-center gap-2 mb-6">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  disabled={isVerifying}
                  className="w-12 h-14 text-center text-2xl font-bold bg-white/10 border-2 border-purple-400/30 rounded-xl text-white focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-400/50 transition-all disabled:opacity-50"
                />
              ))}
            </div>

            {/* Timer */}
            {timeLeft > 0 && (
              <div className="text-center mb-4">
                <div className="inline-flex items-center gap-2 bg-yellow-500/20 text-yellow-400 px-4 py-2 rounded-full text-sm">
                  <AlertCircle size={16} />
                  Código expira em: {formatTime(timeLeft)}
                </div>
              </div>
            )}

            {/* Botão Verificar */}
            <button
              onClick={() => handleVerify()}
              disabled={isVerifying || code.some(d => !d)}
              className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-4"
            >
              {isVerifying ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Verificando...
                </>
              ) : (
                <>
                  <CheckCircle size={20} />
                  Verificar Código
                </>
              )}
            </button>

            {/* Reenviar Código */}
            <div className="text-center">
              <p className="text-gray-300 text-sm mb-2">
                Não recebeu o código?
              </p>
              <button
                onClick={handleResendCode}
                disabled={!canResend || isSending}
                className="text-pink-400 hover:text-pink-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSending ? "Enviando..." : canResend ? "Reenviar código" : `Aguarde ${formatTime(timeLeft)}`}
              </button>
            </div>

            {/* Info */}
            <div className="mt-6 bg-blue-500/10 border border-blue-400/30 rounded-xl p-4">
              <p className="text-sm text-blue-200 text-center">
                💡 Verifique sua caixa de spam se não encontrar o email
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyEmailPage;