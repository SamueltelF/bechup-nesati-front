import React, { useState } from "react";
import { motion } from "framer-motion";
import { User, Calendar, CreditCard, ChevronLeft, Check, AlertCircle } from "lucide-react";
import { useUserStore } from "../../stores/useUserStore";
import { toast } from "react-hot-toast";

const PersonalDataForm = ({ onComplete, onBack }) => {
  const { submitVendorApplication, loading } = useUserStore();
  
  const [formData, setFormData] = useState({
    fullName: "",
    cpf: "",
    dateOfBirth: "",
    displayName: ""
  });

 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "cpf") {
      const formatted = value.replace(/\D/g, "")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
      setFormData({ ...formData, cpf: formatted });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };


  const validateCPF = (cpf) => {
    const cleaned = cpf.replace(/\D/g, "");
    if (cleaned.length !== 11) return false;
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cleaned)) return false;
    
    return true;
  };

  const validateAge = (date) => {
    const birthDate = new Date(date);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1 >= 18;
    }
    
    return age >= 18;
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      toast.error("Nome completo é obrigatório");
      return false;
    }

    if (formData.fullName.trim().split(" ").length < 2) {
      toast.error("Por favor, insira seu nome completo");
      return false;
    }

    if (!validateCPF(formData.cpf)) {
      toast.error("CPF inválido");
      return false;
    }

    if (!formData.dateOfBirth) {
      toast.error("Data de nascimento é obrigatória");
      return false;
    }

    if (!validateAge(formData.dateOfBirth)) {
      toast.error("Você deve ter no mínimo 18 anos");
      return false;
    }

    return true;
  };


  const handleSubmit = async () => {
    // Validar formulário
    if (!validateForm()) {
      return;
    }

    try {
      // Enviar para o backend através do store
      const result = await submitVendorApplication({
        fullName: formData.fullName.trim(),
        cpf: formData.cpf.replace(/\D/g, ""),
        dateOfBirth: formData.dateOfBirth,
        displayName: formData.displayName.trim() || formData.fullName.trim(),
      });

      if (result.success) {
        toast.success("Solicitação enviada com sucesso!");
        setTimeout(() => {
          onComplete();
        }, 1500);
      }

    } catch (error) {
      console.error("Erro ao enviar:", error);
      toast.error("Erro ao processar solicitação. Tente novamente.");
    }
  };

  

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white border-opacity-20">
        <div className="flex justify-center mb-6">
          <User className="h-16 w-16 text-purple-300" />
        </div>

        <h2 className="text-3xl font-bold text-center text-white mb-2">
          Dados Pessoais
        </h2>
        <p className="text-center text-purple-200 mb-8">
          Preencha seus dados para verificação de identidade
        </p>

        {/* Alerta Informativo */}
        <div className="bg-blue-900 bg-opacity-30 border border-blue-400 rounded-lg p-4 mb-6 flex gap-3">
          <AlertCircle className="h-6 w-6 text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-100">
            <p className="font-semibold mb-1">Seus dados estão seguros</p>
            <p>Todas as informações são criptografadas e usadas apenas para verificação de identidade conforme legislação brasileira.</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Dados Básicos */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-purple-200 text-sm font-semibold mb-2 flex items-center gap-2">
                <User className="h-4 w-4" />
                Nome Completo *
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="João Silva Santos"
                className="w-full px-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-purple-200 text-sm font-semibold mb-2 flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                CPF *
              </label>
              <input
                type="text"
                name="cpf"
                value={formData.cpf}
                onChange={handleInputChange}
                placeholder="000.000.000-00"
                maxLength={14}
                className="w-full px-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-purple-200 text-sm font-semibold mb-2 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Data de Nascimento *
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                className="w-full px-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-purple-200 text-sm font-semibold mb-2 flex items-center gap-2">
                <User className="h-4 w-4" />
                Nome de Exibição (opcional)
              </label>
              <input
                type="text"
                name="displayName"
                value={formData.displayName}
                onChange={handleInputChange}
                placeholder="Como quer ser chamado"
                className="w-full px-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Status de Aprovação */}
          <div className="bg-yellow-900 bg-opacity-30 border border-yellow-400 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-200 mb-2 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Processo de Aprovação
            </h4>
            <ul className="text-yellow-100 text-sm space-y-1 ml-7">
              <li>• Após enviar, sua solicitação será analisada pela equipe</li>
              <li>• O processo leva de 24 a 72 horas úteis</li>
              <li>• Você receberá um email com o resultado</li>
              <li>• Documentos com informações ilegíveis serão rejeitados</li>
            </ul>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex gap-4 mt-8">
          <button
            onClick={onBack}
            disabled={loading}
            className="flex-1 py-3 bg-white bg-opacity-10 text-white font-semibold rounded-lg hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-5 w-5" />
            Voltar
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Enviando...
              </>
            ) : (
              <>
                <Check className="h-5 w-5" />
                Enviar para Aprovação
              </>
            )}
          </button>
        </div>

        <p className="text-center text-purple-300 text-xs mt-4">
          Ao enviar, você confirma que todas as informações são verdadeiras
        </p>
      </div>
    </motion.div>
  );
};

export default PersonalDataForm;