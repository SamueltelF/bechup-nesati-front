import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { LogIn, Mail, Lock, ArrowRight, Loader, AlertCircle } from "lucide-react";
import { useUserStore } from "../../stores/useUserStore";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const { email, password } = formData;
  const { login, loading } = useUserStore();

  // Validação de email
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Validação do formulário
  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email é obrigatório";
    } else if (!validateEmail(email)) {
      newErrors.email = "Email inválido";
    }

    if (!password) {
      newErrors.password = "Senha é obrigatória";
    } else if (password.length < 6) {
      newErrors.password = "Senha deve ter no mínimo 6 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Limpar erro do campo ao digitar
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    await login(email, password);
  };

  return (
    <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gradient-to-br min-h-screen">
      <motion.div
        className="sm:mx-auto sm:w-full sm:max-w-md"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="mt-6 text-center text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-400 bg-clip-text text-transparent">
          Entre em sua conta!
        </h2>
      </motion.div>

      <motion.div
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="bg-gradient-to-b from-purple-800 to-purple-900 py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-purple-600">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-purple-200"
              >
                Email
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-purple-400" aria-hidden="true" />
                </div>
                <input
                  id="email"
                  type="email"
                  name="email"
                  required
                  value={email}
                  onChange={onChange}
                  className={`block w-full px-3 py-3 pl-10 bg-purple-700 border ${
                    errors.email ? 'border-red-500' : 'border-purple-500'
                  } rounded-xl shadow-sm placeholder-purple-300 text-white focus:outline-none focus:ring-2 ${
                    errors.email ? 'focus:ring-red-400' : 'focus:ring-purple-400'
                  } focus:border-purple-400 sm:text-sm transition duration-300`}
                  placeholder="seu@email.com"
                />
              </div>
              {errors.email && (
                <div className="mt-1 flex items-center text-red-400 text-xs">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.email}
                </div>
              )}
            </div>

            {/* Senha */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-purple-200"
              >
                Senha
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-purple-400" aria-hidden="true" />
                </div>
                <input
                  id="password"
                  type="password"
                  name="password"
                  required
                  value={password}
                  onChange={onChange}
                  className={`block w-full px-3 py-3 pl-10 bg-purple-700 border ${
                    errors.password ? 'border-red-500' : 'border-purple-500'
                  } rounded-xl shadow-sm placeholder-purple-300 text-white focus:outline-none focus:ring-2 ${
                    errors.password ? 'focus:ring-red-400' : 'focus:ring-purple-400'
                  } focus:border-purple-400 sm:text-sm transition duration-300`}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <div className="mt-1 flex items-center text-red-400 text-xs">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.password}
                </div>
              )}
            </div>

            {/* Link de recuperação de senha */}
            <div className="flex items-center justify-end">
              <Link
                to="/forgot-password"
                className="text-xs text-purple-300 hover:text-pink-400 transition duration-300"
              >
                Esqueceu sua senha?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent 
                rounded-xl shadow-lg text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-purple-700
                hover:from-purple-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2
                focus:ring-purple-600 transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader
                    className="mr-2 h-5 w-5 animate-spin"
                    aria-hidden="true"
                  />
                  Carregando...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-5 w-5" aria-hidden="true" />
                  Entrar
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-purple-300">
            Não tem uma conta?
            <Link
              to="/signup"
              className="font-medium text-pink-400 hover:text-purple-300 transition duration-300 ml-1"
            >
              Registre-se agora <ArrowRight className="inline h-4 w-4" />
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;