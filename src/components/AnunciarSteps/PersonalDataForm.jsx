import React, { useState } from "react";
import { motion } from "framer-motion";
import { User, Calendar, CreditCard, Upload, Camera, ChevronLeft, Check, AlertCircle } from "lucide-react";
import axios from "../../lib/axios";

const PersonalDataForm = ({ onComplete, onBack }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    cpf: "",
    dateOfBirth: "",
    displayName: ""
  });

  const [photos, setPhotos] = useState({
    personalPhoto: null,
    rgFrontPhoto: null,
    rgBackPhoto: null
  });

  const [previews, setPreviews] = useState({
    personalPhoto: null,
    rgFrontPhoto: null,
    rgBackPhoto: null
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

  const handlePhotoChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("A imagem deve ter no máximo 5MB");
      return;
    }

    setPhotos({ ...photos, [type]: file });

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviews({ ...previews, [type]: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const validateCPF = (cpf) => {
    const cleaned = cpf.replace(/\D/g, "");
    return cleaned.length === 11;
  };

  const validateAge = (date) => {
    const birthDate = new Date(date);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    return age >= 18;
  };

  const handleSubmit = async () => {
    // Validações
    if (!formData.fullName || formData.fullName.length < 3) {
      alert("Nome completo é obrigatório (mínimo 3 caracteres)");
      return;
    }

    if (!validateCPF(formData.cpf)) {
      alert("CPF inválido");
      return;
    }

    if (!formData.dateOfBirth) {
      alert("Data de nascimento é obrigatória");
      return;
    }

    if (!validateAge(formData.dateOfBirth)) {
      alert("Você deve ter no mínimo 18 anos");
      return;
    }

    if (!photos.personalPhoto || !photos.rgFrontPhoto || !photos.rgBackPhoto) {
      alert("Todas as fotos são obrigatórias");
      return;
    }

    setLoading(true);

    try {
      // Converter fotos para base64
      const toBase64 = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });

      const personalPhotoBase64 = await toBase64(photos.personalPhoto);
      const rgFrontBase64 = await toBase64(photos.rgFrontPhoto);
      const rgBackBase64 = await toBase64(photos.rgBackPhoto);

      // Enviar para o backend
      await axios.post("/vendor/profile", {
        fullName: formData.fullName,
        cpf: formData.cpf.replace(/\D/g, ""),
        dateOfBirth: formData.dateOfBirth,
        displayName: formData.displayName || formData.fullName,
        personalPhoto: personalPhotoBase64,
        rgFrontPhoto: rgFrontBase64,
        rgBackPhoto: rgBackBase64
      });

      alert("Perfil de vendedor criado! Aguarde a aprovação da equipe.");
      onComplete();
    } catch (error) {
      alert(error.response?.data?.message || "Erro ao criar perfil de vendedor");
    } finally {
      setLoading(false);
    }
  };

  const PhotoUpload = ({ type, label, icon: Icon, preview }) => (
    <div className="bg-white bg-opacity-5 rounded-xl p-4">
      <label className="block text-purple-200 text-sm font-semibold mb-3 flex items-center gap-2">
        <Icon className="h-4 w-4" />
        {label}
      </label>
      
      <div className="relative">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handlePhotoChange(e, type)}
          className="hidden"
          id={type}
        />
        <label
          htmlFor={type}
          className="block cursor-pointer"
        >
          {preview ? (
            <div className="relative group">
              <img
                src={preview}
                alt={label}
                className="w-full h-48 object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                <Camera className="h-8 w-8 text-white" />
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-purple-400 rounded-lg h-48 flex flex-col items-center justify-center hover:border-purple-300 transition-colors">
              <Upload className="h-12 w-12 text-purple-300 mb-2" />
              <span className="text-purple-200 text-sm">Clique para fazer upload</span>
              <span className="text-purple-300 text-xs mt-1">Máximo 5MB</span>
            </div>
          )}
        </label>
      </div>
    </div>
  );

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

          {/* Upload de Fotos */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Documentos de Verificação *</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <PhotoUpload
                type="personalPhoto"
                label="Foto Pessoal"
                icon={Camera}
                preview={previews.personalPhoto}
              />
              <PhotoUpload
                type="rgFrontPhoto"
                label="RG Frente"
                icon={CreditCard}
                preview={previews.rgFrontPhoto}
              />
              <PhotoUpload
                type="rgBackPhoto"
                label="RG Verso"
                icon={CreditCard}
                preview={previews.rgBackPhoto}
              />
            </div>
            <p className="text-purple-300 text-xs mt-3">
              * Certifique-se de que as fotos estejam nítidas e legíveis
            </p>
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