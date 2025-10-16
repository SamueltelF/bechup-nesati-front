import React from "react";
import { Link } from "react-router-dom";
import { User, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { useUserStore } from "../../stores/useUserStore";

const AuthVerification = ({ onComplete }) => {
  const { user } = useUserStore();

  // Se já estiver logado, mostrar confirmação
  if (user) {
    return (
      <motion.div
        className="max-w-2xl mx-auto"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 border border-green-400 border-opacity-30 shadow-2xl text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-pulse">
            <User className="text-white" size={40} />
          </div>
          
          <h2 className="text-3xl font-bold mb-2 text-white">
            Bem-vindo, {user.name}!
          </h2>
          <p className="text-purple-200 mb-6">
            Sua conta está ativa e pronta para criar anúncios.
          </p>

          <div className="bg-purple-900 bg-opacity-30 rounded-xl p-5 mb-6 text-left">
            <div className="flex items-center justify-between mb-3">
              <span className="text-purple-300 text-sm font-medium">📧 Email:</span>
              <span className="text-white font-semibold">{user.email}</span>
            </div>
            <div className="h-px bg-purple-400 bg-opacity-20 mb-3"></div>
            <div className="flex items-center justify-between">
              <span className="text-purple-300 text-sm font-medium">👤 Nome:</span>
              <span className="text-white font-semibold">{user.name}</span>
            </div>
          </div>

          <button
            onClick={onComplete}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Continuar →
          </button>
        </div>
      </motion.div>
    );
  }

  // Se não estiver logado, mostrar opções de login/cadastro
  return (
    <motion.div
      className="max-w-4xl mx-auto"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid md:grid-cols-2 gap-6">
        {/* Login */}
        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 border border-purple-400 border-opacity-30 hover:border-opacity-60 transition-all shadow-xl text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <User className="text-white" size={40} />
          </div>
          
          <h3 className="text-2xl font-bold mb-3 text-white">Já tenho conta!</h3>
          <p className="text-purple-200 mb-6">
            Faça login para criar seu anúncio e começar a vender na Nesati.
          </p>

          <Link
            to="/login"
            state={{ from: "/anunciar" }}
            className="block w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Fazer Login
          </Link>
        </div>

        {/* Cadastro */}
        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 border border-pink-400 border-opacity-30 hover:border-opacity-60 transition-all shadow-xl text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <LogOut className="text-white" size={40} />
          </div>
          
          <h3 className="text-2xl font-bold mb-3 text-white">Criar nova conta</h3>
          <p className="text-purple-200 mb-6">
            Ainda não tem conta? Crie agora e comece a vender seus produtos.
          </p>

          <Link
            to="/signup"
            state={{ from: "/anunciar" }}
            className="block w-full bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Criar Conta
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default AuthVerification;