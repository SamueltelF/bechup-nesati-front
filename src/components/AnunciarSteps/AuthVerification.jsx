import React, { useState } from "react";
import { motion } from "framer-motion";
import { LogIn, UserPlus, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { useUserStore } from "../../stores/useUserStore";
import toast from "react-hot-toast";

const AuthVerification = ({ onComplete }) => {
  const { login, signup, user } = useUserStore();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  // Se já está logado, avança automaticamente
  React.useEffect(() => {
    if (user) {
      onComplete();
    }
  }, [user, onComplete]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // Login
        await login({ 
          identifier: formData.email, 
          password: formData.password 
        });
        toast.success("Login realizado com sucesso!");
        onComplete();
      } else {
        // Signup
        if (formData.password !== formData.confirmPassword) {
          toast.error("As senhas não coincidem");
          setLoading(false);
          return;
        }

        if (formData.password.length < 6) {
          toast.error("A senha deve ter no mínimo 6 caracteres");
          setLoading(false);
          return;
        }

        await signup({
          name: formData.name,
          email: formData.email,
          password: formData.password
        });
        toast.success("Conta criada com sucesso!");
        onComplete();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Erro ao processar requisição");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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
          {isLogin ? (
            <LogIn className="h-16 w-16 text-purple-300" />
          ) : (
            <UserPlus className="h-16 w-16 text-purple-300" />
          )}
        </div>

        <h2 className="text-2xl font-bold text-center text-white mb-2">
          {isLogin ? "Entre na sua conta" : "Crie sua conta"}
        </h2>
        <p className="text-center text-purple-200 mb-6">
          {isLogin 
            ? "Para continuar, faça login na sua conta" 
            : "Preencha os dados para criar sua conta"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300 h-5 w-5" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nome completo"
                required
                className="w-full pl-12 pr-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300 h-5 w-5" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="w-full pl-12 pr-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300 h-5 w-5" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Senha"
              required
              className="w-full pl-12 pr-12 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-300 hover:text-white"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          {!isLogin && (
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300 h-5 w-5" />
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirmar senha"
                required
                className="w-full pl-12 pr-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Carregando..." : isLogin ? "Entrar" : "Criar Conta"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-purple-200 hover:text-white transition-colors duration-200"
          >
            {isLogin ? (
              <>Não tem uma conta? <span className="font-semibold">Criar conta</span></>
            ) : (
              <>Já tem uma conta? <span className="font-semibold">Fazer login</span></>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default AuthVerification;