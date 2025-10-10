import React, { useState } from "react";
import { motion } from "framer-motion";
import { Camera, User, Mail, Phone, Shield, Lock, Save, Eye, EyeOff, Trash2, AtSign } from "lucide-react";
import { useUserStore } from "../../stores/useUserStore";
import { toast } from "react-hot-toast";

const ProfilePage = () => {
  const { 
    user, 
    loading,
    updateProfilePicture, 
    deleteProfilePicture,
    updateName,
    updateEmail,
    updatePhone 
  } = useUserStore();
  
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    passwordForEmail: "",
  });

  const [showPasswordForEmail, setShowPasswordForEmail] = useState(false);
  const [isUpdating, setIsUpdating] = useState({
    name: false,
    email: false,
    phone: false,
    picture: false,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tamanho (máx 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Imagem muito grande. Máximo 5MB");
        return;
      }

      // Validar tipo
      if (!file.type.startsWith('image/')) {
        toast.error("Arquivo deve ser uma imagem");
        return;
      }

      setIsUpdating(prev => ({ ...prev, picture: true }));
      
      try {
        await updateProfilePicture(file);
        // A foto já foi atualizada no store, React vai re-renderizar automaticamente
      } catch (error) {
        console.error("Erro ao fazer upload:", error);
      } finally {
        setIsUpdating(prev => ({ ...prev, picture: false }));
      }
    }
  };

  const handleDeletePicture = async () => {
    if (!window.confirm("Deseja realmente remover sua foto de perfil?")) {
      return;
    }

    setIsUpdating(prev => ({ ...prev, picture: true }));
    try {
      await deleteProfilePicture();
      // A foto já foi removida do store, React vai re-renderizar automaticamente
    } catch (error) {
      console.error("Erro ao deletar foto:", error);
    } finally {
      setIsUpdating(prev => ({ ...prev, picture: false }));
    }
  };

  const handleUpdateName = async (e) => {
    e.preventDefault();
    
    if (!formData.name || formData.name.trim() === "") {
      toast.error("Nome não pode estar vazio");
      return;
    }

    if (formData.name === user?.name) {
      toast.error("Nome não foi alterado");
      return;
    }

    setIsUpdating(prev => ({ ...prev, name: true }));
    try {
      await updateName(formData.name);
    } catch (error) {
      console.error("Erro ao atualizar nome:", error);
    } finally {
      setIsUpdating(prev => ({ ...prev, name: false }));
    }
  };

  const handleUpdateEmail = async (e) => {
    e.preventDefault();
    
    if (!formData.email || formData.email.trim() === "") {
      toast.error("Email não pode estar vazio");
      return;
    }

    if (formData.email === user?.email) {
      toast.error("Email não foi alterado");
      return;
    }

    if (!user?.phone || !user?.phoneVerified) {
      toast.error("Você precisa ter um número verificado para trocar o email");
      return;
    }

    if (!formData.passwordForEmail) {
      toast.error("Digite sua senha para confirmar a alteração");
      return;
    }

    setIsUpdating(prev => ({ ...prev, email: true }));
    try {
      await updateEmail(formData.email, formData.passwordForEmail);
      setFormData(prev => ({ ...prev, passwordForEmail: "" }));
    } catch (error) {
      console.error("Erro ao atualizar email:", error);
    } finally {
      setIsUpdating(prev => ({ ...prev, email: false }));
    }
  };

  const handleUpdatePhone = async (e) => {
    e.preventDefault();
    
    if (formData.phone === user?.phone) {
      toast.error("Número não foi alterado");
      return;
    }

    setIsUpdating(prev => ({ ...prev, phone: true }));
    try {
      await updatePhone(formData.phone);
    } catch (error) {
      console.error("Erro ao atualizar telefone:", error);
    } finally {
      setIsUpdating(prev => ({ ...prev, phone: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 mb-8">
            Meu Perfil
          </h1>

          <div className="bg-gradient-to-br from-purple-800/40 to-pink-800/40 backdrop-blur-sm rounded-3xl shadow-2xl border border-purple-500/30 overflow-hidden">
            
            {/* Foto de Perfil */}
            <div className="relative bg-gradient-to-r from-purple-600 mt-10 to-pink-600 h-48 flex items-end justify-center pb-16">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 mt-10 border-white overflow-hidden bg-white shadow-xl">
                  {user?.profilePicture ? (
                    <img 
                      src={user.profilePicture} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                      key={user.profilePicture} // Force re-render quando URL mudar
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-400 to-pink-400">
                      <User size={48} className="text-white" />
                    </div>
                  )}
                  
                  {isUpdating.picture && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    </div>
                  )}
                </div>

                <label 
                  htmlFor="profile-upload" 
                  className="absolute bottom-0 right-0 bg-gradient-to-r from-pink-500 to-purple-600 p-3 rounded-full cursor-pointer hover:scale-110 transition-transform shadow-lg disabled:opacity-50"
                >
                  <Camera size={20} className="text-white" />
                  <input
                    id="profile-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={isUpdating.picture}
                    className="hidden"
                  />
                </label>

                {user?.profilePicture && (
                  <button
                    onClick={handleDeletePicture}
                    disabled={isUpdating.picture}
                    className="absolute bottom-0 left-0 bg-red-500 p-3 rounded-full cursor-pointer hover:scale-110 transition-transform shadow-lg disabled:opacity-50"
                  >
                    <Trash2 size={20} className="text-white" />
                  </button>
                )}
              </div>
            </div>

            {/* Conteúdo */}
            <div className="p-8 space-y-6">
              
              {/* Tipo de Conta e Username */}
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-4 border border-purple-400/30 flex items-center gap-3">
                  <Shield className="text-pink-400" size={24} />
                  <div>
                    <p className="text-sm text-gray-300">Tipo de Conta</p>
                    <p className="text-lg font-bold text-white uppercase">
                      {user?.role === "admin" ? "Administrador" : "Cliente"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Nome */}
              <form onSubmit={handleUpdateName}>
                <label className="flex items-center gap-2 text-white font-medium mb-2">
                  <User size={18} className="text-pink-400" />
                  Nome
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="flex-1 px-4 py-3 bg-white/10 border border-purple-400/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-400/50 transition-all"
                    placeholder="Seu nome"
                  />
                  <button
                    type="submit"
                    disabled={isUpdating.name || loading}
                    className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isUpdating.name ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <Save size={18} />
                        Salvar
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Email */}
              <form onSubmit={handleUpdateEmail}>
                <label className="flex items-center gap-2 text-white font-medium mb-2">
                  <Mail size={18} className="text-pink-400" />
                  Email
                  {user?.emailVerified && (
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                      Verificado
                    </span>
                  )}
                  {!user?.emailVerified && user?.email && (
                    <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full">
                      Não verificado
                    </span>
                  )}
                </label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="flex-1 px-4 py-3 bg-white/10 border border-purple-400/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-400/50 transition-all"
                      placeholder="seu@email.com"
                    />
                  </div>
                  
                  {formData.email !== user?.email && (
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <input
                          type={showPasswordForEmail ? "text" : "password"}
                          name="passwordForEmail"
                          value={formData.passwordForEmail}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 pr-12 bg-white/10 border border-purple-400/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-400/50 transition-all"
                          placeholder="Senha para confirmar"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswordForEmail(!showPasswordForEmail)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-pink-400 transition-colors"
                        >
                          {showPasswordForEmail ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                      <button
                        type="submit"
                        disabled={isUpdating.email || loading}
                        className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {isUpdating.email ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        ) : (
                          <>
                            <Save size={18} />
                            Salvar
                          </>
                        )}
                      </button>
                    </div>
                  )}
                  
                  {(!user?.phone || !user?.phoneVerified) && (
                    <p className="text-sm text-yellow-400">
                      ⚠️ Você precisa ter um número verificado para trocar o email
                    </p>
                  )}
                </div>
              </form>

              {/* Telefone */}
              <form onSubmit={handleUpdatePhone}>
                <label className="flex items-center gap-2 text-white font-medium mb-2">
                  <Phone size={18} className="text-pink-400" />
                  Telefone
                  {user?.phoneVerified && (
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                      Verificado
                    </span>
                  )}
                  {!user?.phoneVerified && user?.phone && (
                    <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full">
                      Não verificado
                    </span>
                  )}
                </label>
                <div className="flex gap-2">
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="flex-1 px-4 py-3 bg-white/10 border border-purple-400/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-400/50 transition-all"
                    placeholder="(85) 99999-9999"
                  />
                  <button
                    type="submit"
                    disabled={isUpdating.phone || loading}
                    className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isUpdating.phone ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <Save size={18} />
                        Salvar
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Informação sobre senha */}
              <div className="bg-blue-500/10 border border-blue-400/30 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Lock className="text-blue-400 mt-1" size={20} />
                  <div>
                    <p className="text-white font-medium mb-1">Alterar Senha</p>
                    <p className="text-sm text-gray-300">
                      A funcionalidade de alteração de senha estará disponível em breve. 
                      Entre em contato com o suporte se precisar redefinir sua senha.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;