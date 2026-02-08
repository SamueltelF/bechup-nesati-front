import { useState } from "react";
import { Link } from "react-router-dom";
import { UserPlus, Mail, Lock, User, ArrowRight, Loader, Phone, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useUserStore } from "../../stores/useUserStore";
import Footer from "../../components/footer/Footer";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  const { signUp, loading } = useUserStore();

  // Validações
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePhone = (phone) => {
    if (!phone) return true; // Telefone é opcional
    // Remove caracteres não numéricos
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length >= 10 && cleaned.length <= 11;
  };

  const validateForm = () => {
    const newErrors = {};

    // Nome
    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Nome deve ter no mínimo 3 caracteres";
    }

    // Email
    if (!formData.email.trim()) {
      newErrors.email = "Email é obrigatório";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Email inválido";
    }

    // Telefone (opcional)
    if (formData.phone && !validatePhone(formData.phone)) {
      newErrors.phone = "Telefone inválido";
    }

    // Senha
    if (!formData.password) {
      newErrors.password = "Senha é obrigatória";
    } else if (formData.password.length < 6) {
      newErrors.password = "Senha deve ter no mínimo 6 caracteres";
    }

    // Confirmar senha
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirmação de senha é obrigatória";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "As senhas não coincidem";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Limpar erro do campo ao digitar
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  // Validar formulário
  if (!validateForm()) {
    return;
  }

  // ✅ AGUARDAR RETORNO DO SIGNUP
  const success = await signUp(formData);

  // ✅ LIMPAR FORMULÁRIO APENAS SE SUCESSO
  if (success === true) {
    setFormData({
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    });
    setErrors({}); // Limpar erros também
  }
  // Se success === false, mantém os dados para o usuário corrigir
};

  return (
    <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gradient-to-br min-h-screen">
      <motion.div
        className="sm:mx-auto sm:w-full sm:max-w-md"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="mt-6 text-center text-3xl font-extrabold bg-gradient-to-r from-purple-300 to-pink-400 bg-clip-text text-transparent">
          Crie sua conta
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
            
            {/* Nome */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-purple-200"
              >
                Nome completo
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-purple-400" aria-hidden="true" />
                </div>
                <input
                  id="name"
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className={`block w-full px-3 py-3 pl-10 bg-purple-700 border ${
                    errors.name ? 'border-red-500' : 'border-purple-500'
                  } rounded-xl shadow-sm placeholder-purple-300 text-white focus:outline-none focus:ring-2 ${
                    errors.name ? 'focus:ring-red-400' : 'focus:ring-purple-400'
                  } focus:border-purple-400 sm:text-sm transition duration-300`}
                  placeholder="João da Silva"
                />
              </div>
              {errors.name && (
                <div className="mt-1 flex items-center text-red-400 text-xs">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.name}
                </div>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-purple-200"
              >
                Endereço de e-mail
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
                  value={formData.email}
                  onChange={handleChange}
                  className={`block w-full px-3 py-3 pl-10 bg-purple-700 border ${
                    errors.email ? 'border-red-500' : 'border-purple-500'
                  } rounded-xl shadow-sm placeholder-purple-300 text-white focus:outline-none focus:ring-2 ${
                    errors.email ? 'focus:ring-red-400' : 'focus:ring-purple-400'
                  } focus:border-purple-400 sm:text-sm transition duration-300`}
                  placeholder="voce@exemplo.com"
                />
              </div>
              {errors.email && (
                <div className="mt-1 flex items-center text-red-400 text-xs">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.email}
                </div>
              )}
            </div>

            {/* Telefone (opcional) */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-purple-200"
              >
                Telefone <span className="text-purple-400">(opcional)</span>
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-purple-400" aria-hidden="true" />
                </div>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`block w-full px-3 py-3 pl-10 bg-purple-700 border ${
                    errors.phone ? 'border-red-500' : 'border-purple-500'
                  } rounded-xl shadow-sm placeholder-purple-300 text-white focus:outline-none focus:ring-2 ${
                    errors.phone ? 'focus:ring-red-400' : 'focus:ring-purple-400'
                  } focus:border-purple-400 sm:text-sm transition duration-300`}
                  placeholder="(85) 99999-9999"
                />
              </div>
              {errors.phone && (
                <div className="mt-1 flex items-center text-red-400 text-xs">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.phone}
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
                  value={formData.password}
                  onChange={handleChange}
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
              <p className="mt-1 text-xs text-purple-300">
                Mínimo 6 caracteres
              </p>
            </div>

            {/* Confirmar Senha */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-purple-200"
              >
                Confirmar Senha
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-purple-400" aria-hidden="true" />
                </div>
                <input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`block w-full px-3 py-3 pl-10 bg-purple-700 border ${
                    errors.confirmPassword ? 'border-red-500' : 'border-purple-500'
                  } rounded-xl shadow-sm placeholder-purple-300 text-white focus:outline-none focus:ring-2 ${
                    errors.confirmPassword ? 'focus:ring-red-400' : 'focus:ring-purple-400'
                  } focus:border-purple-400 sm:text-sm transition duration-300`}
                  placeholder="••••••••"
                />
              </div>
              {errors.confirmPassword && (
                <div className="mt-1 flex items-center text-red-400 text-xs">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.confirmPassword}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent 
                rounded-xl shadow-lg text-sm font-medium text-white bg-gradient-to-r from-pink-400 to-purple-500
                hover:from-pink-500 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2
                focus:ring-purple-500 transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
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
                  <UserPlus className="mr-2 h-5 w-5" aria-hidden="true" />
                  Inscrever-se
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-purple-300">
            Já tem uma conta?{" "}
            <Link
              to="/login"
              className="font-medium text-pink-400 hover:text-purple-300 transition duration-300"
            >
              Faça login aqui <ArrowRight className="inline h-4 w-4" />
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUpPage;