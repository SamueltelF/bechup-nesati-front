import { create } from "zustand";
import axiosBaseURL from "../lib/axios";
import { toast } from "react-hot-toast";

export const useUserStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem("user")) || null,
  loading: false,
  checkingAuth: false,

  // Signup sem username
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
      if (error?.response && error?.response?.status === 429) {
        toast.error(
          error?.response?.data?.message ||
            "Muitas tentativas. Por favor, tente novamente mais tarde."
        );
      } else {
        toast.error(
          error.response?.data?.message || "Erro ao criar conta"
        );
      }
    }
  },

  // Login agora aceita apenas email
  login: async (email, password) => {
    set({ loading: true });
    try {
      const response = await axiosBaseURL.post("/auth/login", {
        identifier: email, // O backend espera 'identifier'
        password,
      });

      set({ user: response?.data?.user, loading: false });
      localStorage.setItem("user", JSON.stringify(response?.data?.user));
      toast.success("Login realizado com sucesso!");
    } catch (error) {
      set({ loading: false });
      if (error.response && error.response.status === 429) {
        toast.error(
          error?.response?.data?.message ||
            "Muitas tentativas. Por favor, tente novamente mais tarde."
        );
      } else {
        toast.error(
          error.response?.data?.message || "Credenciais inválidas"
        );
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

      console.log("error :", error.message);
      toast.error("Ocorreu um erro na função checkAuth no armazenamento do usuário");
    }
  },

  logout: async () => {
    set({ loading: true });
    try {
      await axiosBaseURL.post("/auth/logout"); // Mudado para POST
      set({ user: null, loading: false });
      localStorage.removeItem("user");
      toast.success("Logout realizado com sucesso!");
    } catch (error) {
      set({ loading: false });
      toast.error(
        error.response?.data.message ||
          "Ocorreu um erro na função de logout na loja do usuário"
      );
    }
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
      toast.error(
        error.response?.data.message ||
          "Ocorreu um erro na função refreshToken no armazenamento do usuário"
      );
      throw error;
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
        newName,
      });

      const updatedUser = { ...get().user, name: newName };
      set({ user: updatedUser, loading: false });
      localStorage.setItem("user", JSON.stringify(updatedUser));

      toast.success("Nome atualizado com sucesso");
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "Erro ao atualizar nome");
    }
  },

  updateEmail: async (newEmail, password) => {
    set({ loading: true });
    try {
      const response = await axiosBaseURL.put("/auth/profile/email", {
        newEmail,
        password,
      });

      const updatedUser = { 
        ...get().user, 
        email: newEmail, 
        emailVerified: false
      };
      set({ user: updatedUser, loading: false });
      localStorage.setItem("user", JSON.stringify(updatedUser));

      toast.success("Email atualizado com sucesso");
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "Erro ao atualizar email");
    }
  },

  updatePhone: async (newPhone) => {
    set({ loading: true });
    try {
      const response = await axiosBaseURL.put("/auth/profile/phone", {
        newPhone,
      });

      const updatedUser = { 
        ...get().user, 
        phone: newPhone || null, 
        phoneVerified: false 
      };
      set({ user: updatedUser, loading: false });
      localStorage.setItem("user", JSON.stringify(updatedUser));

      toast.success("Número atualizado com sucesso");
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "Erro ao atualizar número");
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
    }
  },

  // Funções adicionais para os novos campos do schema
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
}));

// Axios interceptor para renovação automática de token
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
        useUserStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);