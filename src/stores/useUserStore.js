import { create } from "zustand";
import axiosBaseURL from "../lib/axios";
import { toast } from "react-hot-toast";

export const useUserStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem("user")) || null,
  loading: false,
  checkingAuth: false,

  // ============================================
  // AUTENTICAÇÃO
  // ============================================

  signUp: async ({ name, email, password, confirmPassword, phone }) => {
    set({ loading: true });

    if (password !== confirmPassword) {
      set({ loading: false });
      return toast.error("As senhas não coincidem");
    }

    try {
      const response = await axiosBaseURL.post("/auth/signup", {
        email,
        name,
        password,
        phone: phone || null,
      });
      
      if (!response) {
        return toast.error("Falha na criação da conta");
      }
      
      toast.success("Conta criada com sucesso");
      set({ user: response?.data, loading: false });
      localStorage.setItem("user", JSON.stringify(response?.data));
    } catch (error) {
      set({ loading: false });
      if (error?.response?.status === 429) {
        toast.error(
          error?.response?.data?.message ||
            "Muitas tentativas. Por favor, tente novamente mais tarde."
        );
      } else {
        toast.error(error.response?.data?.message || "Erro ao criar conta");
      }
    }
  },

  login: async (email, password) => {
  set({ loading: true });
  try {
    // ✅ CORRIGIDO: Envia "identifier" como o backend espera
    const response = await axiosBaseURL.post("/auth/login", {
      identifier: email,  // Backend espera "identifier", não "email"
      password,
    });

    set({ user: response?.data?.user, loading: false });
    localStorage.setItem("user", JSON.stringify(response?.data?.user));
    toast.success("Login realizado com sucesso!");
  } catch (error) {
    set({ loading: false });
    if (error.response?.status === 429) {
      toast.error(
        error?.response?.data?.message ||
          "Muitas tentativas. Por favor, tente novamente mais tarde."
      );
    } else {
      toast.error(error.response?.data?.message || "Credenciais inválidas");
    }
  }
},

  checkAuth: async () => {
    set({ checkingAuth: true, loading: true });

    try {
      const response = await axiosBaseURL.get("/auth/profile");
      set({ user: response?.data?.user, checkingAuth: false, loading: false });
      localStorage.setItem("user", JSON.stringify(response?.data?.user));
    } catch (error) {
      set({ checkingAuth: false, user: null, loading: false });
      localStorage.removeItem("user");

      console.log("checkAuth error:", error.message);
      
      if (error.response?.data?.code !== "USER_DELETED") {
        toast.error("Sessão expirada");
      }
    }
  },

  logout: async () => {
    set({ loading: true });
    try {
      await axiosBaseURL.post("/auth/logout");
      set({ user: null, loading: false });
      localStorage.removeItem("user");
      toast.success("Logout realizado com sucesso!");
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "Erro ao fazer logout");
    }
  },

  forceLogout: () => {
    set({ user: null, loading: false, checkingAuth: false });
    localStorage.removeItem("user");
    window.location.href = "/login";
  },

  refreshToken: async () => {
    if (get().checkingAuth) return;

    set({ checkingAuth: true, loading: true });
    try {
      const response = await axiosBaseURL.post("/auth/refresh-token");
      set({ checkingAuth: false, loading: false });
      return response?.data;
    } catch (error) {
      set({ loading: false, checkingAuth: false });
      toast.error(error.response?.data?.message || "Erro ao renovar token");
      throw error;
    }
  },

  // ============================================
  // PERFIL - FOTO E DADOS BÁSICOS
  // ============================================

  refreshUser: async () => {
    try {
      const response = await axiosBaseURL.get("/auth/profile");
      const userData = response?.data?.user;
      set({ user: userData });
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
    }
  },

  updateProfilePicture: async (imageFile) => {
    set({ loading: true });
    try {
      const reader = new FileReader();
      reader.readAsDataURL(imageFile);
      
      return new Promise((resolve, reject) => {
        reader.onload = async () => {
          try {
            const response = await axiosBaseURL.post("/auth/profile/picture", {
              image: reader.result,
            });
            
            const updatedUser = { 
              ...get().user, 
              profilePicture: response.data.profilePicture 
            };
            
            set({ user: updatedUser, loading: false });
            localStorage.setItem("user", JSON.stringify(updatedUser));
            
            toast.success("Foto atualizada com sucesso!");
            resolve(response.data);
          } catch (error) {
            set({ loading: false });
            toast.error(error.response?.data?.message || "Erro ao atualizar foto");
            reject(error);
          }
        };
        reader.onerror = () => {
          set({ loading: false });
          toast.error("Erro ao processar imagem");
          reject(new Error("Erro ao processar imagem"));
        };
      });
    } catch (error) {
      set({ loading: false });
      toast.error("Erro ao atualizar foto");
    }
  },

  deleteProfilePicture: async () => {
    set({ loading: true });
    try {
      await axiosBaseURL.delete("/auth/profile/picture");
      
      const updatedUser = { ...get().user, profilePicture: null };
      set({ user: updatedUser, loading: false });
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      toast.success("Foto removida com sucesso!");
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "Erro ao remover foto");
    }
  },

  updateName: async (newName) => {
    set({ loading: true });
    try {
      const response = await axiosBaseURL.put("/auth/profile/name", {
        newName: newName.trim(),
      });

      const updatedUser = { ...get().user, name: newName.trim() };
      set({ user: updatedUser, loading: false });
      localStorage.setItem("user", JSON.stringify(updatedUser));

      toast.success("Nome atualizado com sucesso");
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "Erro ao atualizar nome");
      throw error;
    }
  },

  updateEmail: async (newEmail, password) => {
    set({ loading: true });
    try {
      const response = await axiosBaseURL.put("/auth/profile/email", {
        newEmail: newEmail.trim().toLowerCase(),
        password,
      });

      const updatedUser = { 
        ...get().user, 
        email: response.data.email || newEmail.trim().toLowerCase(),
        emailVerified: response.data.emailVerified || false
      };
      set({ user: updatedUser, loading: false });
      localStorage.setItem("user", JSON.stringify(updatedUser));

      toast.success("Email atualizado com sucesso");
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "Erro ao atualizar email");
      throw error;
    }
  },

 updatePhone: async (newPhone) => {
  set({ loading: true });
  try {
    const response = await axiosBaseURL.put("/auth/update-phone", {
      newPhone: newPhone ? newPhone.trim() : "",
    });

    const updatedUser = { 
      ...get().user, 
      phone: response.data.phone || newPhone || null,
      phoneVerified: response.data.phoneVerified || false
    };
    set({ user: updatedUser, loading: false });
    localStorage.setItem("user", JSON.stringify(updatedUser));

    toast.success("Número atualizado com sucesso");
  } catch (error) {
    set({ loading: false });
    toast.error(error.response?.data?.message || "Erro ao atualizar número");
    throw error;
  }
},

  updatePassword: async (currentPassword, newPassword, confirmNewPassword) => {
    set({ loading: true });
    
    if (newPassword !== confirmNewPassword) {
      set({ loading: false });
      return toast.error("As senhas não coincidem");
    }

    try {
      await axiosBaseURL.put("/auth/profile/password", {
        currentPassword,
        newPassword,
      });

      set({ loading: false });
      toast.success("Senha atualizada com sucesso");
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "Erro ao atualizar senha");
      throw error;
    }
  },

  // ============================================
  // VERIFICAÇÃO DE EMAIL E TELEFONE
  // ============================================

  sendEmailVerification: async () => {
    set({ loading: true });
    try {
      const response = await axiosBaseURL.post("/auth/send-email-verification");
      set({ loading: false });
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "Erro ao enviar código");
      throw error;
    }
  },

  verifyEmailCode: async (code) => {
    set({ loading: true });
    try {
      const response = await axiosBaseURL.post("/auth/verify-email", { code });
      
      const updatedUser = { ...get().user, emailVerified: true };
      set({ user: updatedUser, loading: false });
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "Erro ao verificar código");
      throw error;
    }
  },

  resendEmailVerification: async () => {
    set({ loading: true });
    try {
      const response = await axiosBaseURL.post("/auth/resend-email-verification");
      set({ loading: false });
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "Erro ao reenviar código");
      throw error;
    }
  },

  // ============================================
  // DADOS PESSOAIS ADICIONAIS
  // ============================================

  updatePersonalData: async (data) => {
    set({ loading: true });
    try {
      const response = await axiosBaseURL.put("/auth/profile/personal-data", data);

      const updatedUser = { 
        ...get().user, 
        fullName: data.fullName,
        cpf: data.cpf,
        birthDate: data.birthDate
      };
      set({ user: updatedUser, loading: false });
      localStorage.setItem("user", JSON.stringify(updatedUser));

      toast.success("Dados pessoais atualizados com sucesso");
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "Erro ao atualizar dados pessoais");
      throw error;
    }
  },

  uploadPersonalPhoto: async (imageFile) => {
    set({ loading: true });
    try {
      const reader = new FileReader();
      reader.readAsDataURL(imageFile);
      
      return new Promise((resolve, reject) => {
        reader.onload = async () => {
          try {
            const response = await axiosBaseURL.post("/auth/profile/personal-photo", {
              image: reader.result,
            });
            
            const updatedUser = { 
              ...get().user, 
              personalPhoto: response.data.personalPhoto 
            };
            
            set({ user: updatedUser, loading: false });
            localStorage.setItem("user", JSON.stringify(updatedUser));
            
            toast.success("Foto pessoal atualizada com sucesso!");
            resolve(response.data);
          } catch (error) {
            set({ loading: false });
            toast.error(error.response?.data?.message || "Erro ao atualizar foto pessoal");
            reject(error);
          }
        };
        reader.onerror = () => {
          set({ loading: false });
          toast.error("Erro ao processar imagem");
          reject(new Error("Erro ao processar imagem"));
        };
      });
    } catch (error) {
      set({ loading: false });
      toast.error("Erro ao atualizar foto pessoal");
    }
  },

  getBalance: async () => {
    try {
      const response = await axiosBaseURL.get("/auth/balance");
      const updatedUser = { 
        ...get().user, 
        balance: response.data.balance 
      };
      set({ user: updatedUser });
      localStorage.setItem("user", JSON.stringify(updatedUser));
      return response.data.balance;
    } catch (error) {
      toast.error(error.response?.data?.message || "Erro ao buscar saldo");
    }
  },

  // ============================================
  // PERFIL DE VENDEDOR (ADMIN PROFILE)
  // ============================================

  createAdminProfile: async (data) => {
    set({ loading: true });
    try {
      const response = await axiosBaseURL.post("/admin-profile/create", data);
      toast.success("Perfil de vendedor criado com sucesso!");
      set({ loading: false });
      return response.data;
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "Erro ao criar perfil de vendedor");
      throw error;
    }
  },

  getAdminProfile: async () => {
    set({ loading: true });
    try {
      const response = await axiosBaseURL.get("/admin-profile/me");
      set({ loading: false });
      return response.data.adminProfile;
    } catch (error) {
      set({ loading: false });
      if (error.response?.status !== 404) {
        toast.error(error.response?.data?.message || "Erro ao buscar perfil");
      }
      return null;
    }
  },

  updateAdminProfile: async (data) => {
    set({ loading: true });
    try {
      const response = await axiosBaseURL.put("/admin-profile/update", data);
      toast.success("Perfil atualizado com sucesso!");
      set({ loading: false });
      return response.data.adminProfile;
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "Erro ao atualizar perfil");
      throw error;
    }
  },

  uploadAdminPersonalPhoto: async (imageFile) => {
    set({ loading: true });
    try {
      const reader = new FileReader();
      reader.readAsDataURL(imageFile);
      
      return new Promise((resolve, reject) => {
        reader.onload = async () => {
          try {
            const response = await axiosBaseURL.post("/admin-profile/upload/personal-photo", {
              image: reader.result,
            });
            
            set({ loading: false });
            toast.success("Foto pessoal enviada com sucesso!");
            resolve(response.data);
          } catch (error) {
            set({ loading: false });
            toast.error(error.response?.data?.message || "Erro ao enviar foto");
            reject(error);
          }
        };
        reader.onerror = () => {
          set({ loading: false });
          toast.error("Erro ao processar imagem");
          reject(new Error("Erro ao processar imagem"));
        };
      });
    } catch (error) {
      set({ loading: false });
      toast.error("Erro ao enviar foto");
    }
  },

  uploadRgFront: async (imageFile) => {
    set({ loading: true });
    try {
      const reader = new FileReader();
      reader.readAsDataURL(imageFile);
      
      return new Promise((resolve, reject) => {
        reader.onload = async () => {
          try {
            const response = await axiosBaseURL.post("/admin-profile/upload/rg-front", {
              image: reader.result,
            });
            
            set({ loading: false });
            toast.success("RG (frente) enviado com sucesso!");
            resolve(response.data);
          } catch (error) {
            set({ loading: false });
            toast.error(error.response?.data?.message || "Erro ao enviar RG");
            reject(error);
          }
        };
      });
    } catch (error) {
      set({ loading: false });
      toast.error("Erro ao enviar RG");
    }
  },

  uploadRgBack: async (imageFile) => {
    set({ loading: true });
    try {
      const reader = new FileReader();
      reader.readAsDataURL(imageFile);
      
      return new Promise((resolve, reject) => {
        reader.onload = async () => {
          try {
            const response = await axiosBaseURL.post("/admin-profile/upload/rg-back", {
              image: reader.result,
            });
            
            set({ loading: false });
            toast.success("RG (verso) enviado com sucesso!");
            resolve(response.data);
          } catch (error) {
            set({ loading: false });
            toast.error(error.response?.data?.message || "Erro ao enviar RG");
            reject(error);
          }
        };
      });
    } catch (error) {
      set({ loading: false });
      toast.error("Erro ao enviar RG");
    }
  },

  submitForReview: async () => {
    set({ loading: true });
    try {
      const response = await axiosBaseURL.post("/admin-profile/submit-review");
      toast.success("Perfil enviado para análise!");
      set({ loading: false });
      return response.data;
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "Erro ao enviar para análise");
      throw error;
    }
  },

  // ============================================
  // FUNÇÕES FINANCEIRAS
  // ============================================

  getFinancialDashboard: async () => {
    set({ loading: true });
    try {
      const response = await axiosBaseURL.get("/financial/dashboard");
      set({ loading: false });
      return response.data;
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "Erro ao buscar dashboard");
      return null;
    }
  },

  getVendorBalance: async () => {
    try {
      const response = await axiosBaseURL.get("/financial/balance");
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Erro ao buscar saldo");
      return null;
    }
  },

  getBalanceHistory: async (page = 1, type = null) => {
    try {
      const params = { page };
      if (type) params.type = type;
      
      const response = await axiosBaseURL.get("/financial/balance/history", { params });
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Erro ao buscar histórico");
      return null;
    }
  },

  getMySales: async (page = 1, filters = {}) => {
    try {
      const response = await axiosBaseURL.get("/financial/sales", { 
        params: { page, ...filters } 
      });
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Erro ao buscar vendas");
      return null;
    }
  },

  getSaleDetails: async (orderId) => {
    try {
      const response = await axiosBaseURL.get(`/financial/sales/${orderId}`);
      return response.data.sale;
    } catch (error) {
      toast.error(error.response?.data?.message || "Erro ao buscar venda");
      return null;
    }
  },

  updateTrackingCode: async (orderId, trackingCode) => {
    set({ loading: true });
    try {
      const response = await axiosBaseURL.put(`/financial/sales/${orderId}/tracking`, {
        trackingCode
      });
      toast.success("Código de rastreio atualizado!");
      set({ loading: false });
      return response.data;
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "Erro ao atualizar rastreio");
      throw error;
    }
  },

  requestWithdrawal: async (amount) => {
    set({ loading: true });
    try {
      const response = await axiosBaseURL.post("/financial/withdrawal/request", {
        amount
      });
      toast.success("Saque solicitado com sucesso!");
      set({ loading: false });
      return response.data;
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "Erro ao solicitar saque");
      throw error;
    }
  },

  getWithdrawalHistory: async (page = 1, status = null) => {
    try {
      const params = { page };
      if (status) params.status = status;
      
      const response = await axiosBaseURL.get("/financial/withdrawal/history", { params });
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Erro ao buscar saques");
      return null;
    }
  },
///SMS VERIFICAÇÃO
  sendPhoneVerification: async () => {
  set({ loading: true });
  try {
    const response = await axiosBaseURL.post("/auth/send-phone-verification");
    set({ loading: false });
    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    set({ loading: false });
    toast.error(error.response?.data?.message || "Erro ao enviar código SMS");
    throw error;
  }
},

verifyPhoneCode: async (code) => {
  set({ loading: true });
  try {
    const response = await axiosBaseURL.post("/auth/verify-phone", { code });
    
    const updatedUser = { ...get().user, phoneVerified: true };
    set({ user: updatedUser, loading: false });
    localStorage.setItem("user", JSON.stringify(updatedUser));
    
    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    set({ loading: false });
    toast.error(error.response?.data?.message || "Erro ao verificar código");
    throw error;
  }
},

resendPhoneVerification: async () => {
  set({ loading: true });
  try {
    const response = await axiosBaseURL.post("/auth/resend-phone-verification");
    set({ loading: false });
    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    set({ loading: false });
    toast.error(error.response?.data?.message || "Erro ao reenviar código");
    throw error;
  }
},
}));

// ============================================
// AXIOS INTERCEPTOR
// ============================================

let refreshingPromise = null;

axiosBaseURL.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        if (refreshingPromise) {
          await refreshingPromise;
          return axiosBaseURL(originalRequest);
        }

        refreshingPromise = useUserStore.getState().refreshToken();
        await refreshingPromise;
        refreshingPromise = null;

        return axiosBaseURL(originalRequest);
      } catch (refreshError) {
        useUserStore.getState().forceLogout();
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);




