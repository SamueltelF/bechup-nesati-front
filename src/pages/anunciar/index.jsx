import React, { useEffect, useState } from "react";
import { User, Phone, FileText, CreditCard, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { useUserStore } from "../../stores/useUserStore";
import AuthVerification from "../../components/AnunciarSteps/AuthVerification.jsx";
import PhoneVerification from "../../components/AnunciarSteps/PhoneVerification.jsx";
import TermsAndRules from "../../components/AnunciarSteps/TermsAndRules.jsx";
import PersonalDataForm from "../../components/AnunciarSteps/PersonalDataForm.jsx";

const steps = [
  { id: "auth", label: "Conta", icon: User },
  { id: "phone", label: "Telefone", icon: Phone },
  { id: "terms", label: "Termos", icon: FileText },
  { id: "personal", label: "Dados Pessoais", icon: CreditCard },
];

const AnunciarPage = () => {
  const { user, getVendorApplicationStatus } = useUserStore();
  const [activeStep, setActiveStep] = useState("auth");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState(null);
  
  // ⚠️ MODO DE DESENVOLVIMENTO - Permite navegar livremente
  const [devMode, setDevMode] = useState(false);

  // ✅ VERIFICAR STATUS DA APLICAÇÃO AO CARREGAR
  useEffect(() => {
    const checkApplicationStatus = async () => {
      if (user) {
        const status = await getVendorApplicationStatus();
        setApplicationStatus(status);
        
        // Se tem submissão pendente, mostrar aviso
        if (status?.hasSubmission) {
          const { submission } = status;
          
          if (submission.status === "pending") {
            toast.info("Você já tem uma solicitação em análise! Aguarde a resposta da equipe.", {
              duration: 5000,
            });
          } else if (submission.status === "under_review") {
            toast.info("Sua solicitação está sendo analisada pela equipe!", {
              duration: 5000,
            });
          } else if (submission.status === "approved") {
            toast.success("Sua solicitação foi aprovada! Você já é um vendedor.", {
              duration: 5000,
            });
            // Redirecionar para dashboard de vendedor
            setTimeout(() => {
              window.location.href = "/vendor/dashboard";
            }, 2000);
          } else if (submission.status === "rejected") {
            toast.error(`Sua solicitação foi rejeitada. Motivo: ${submission.decision?.reason || "Não especificado"}`, {
              duration: 8000,
            });
          }
        }
      }
    };
    
    checkApplicationStatus();
  }, [user]);

  // ✅ CONTROLAR NAVEGAÇÃO ENTRE STEPS
  useEffect(() => {
    // No modo dev, permite navegar livremente
    if (devMode) return;

    // Verificar qual step mostrar baseado nos dados do usuário
    if (!user) {
      setActiveStep("auth");
      return;
    }

    if (!user.phone || !user.phoneVerified) {
      setActiveStep("phone");
      return;
    }

    // Se já tem tudo mas não aceitou termos, mostrar termos
    if (!termsAccepted) {
      setActiveStep("terms");
      return;
    }

    // Se chegou aqui, pode preencher dados pessoais
    setActiveStep("personal");
  }, [user, termsAccepted, devMode]);

  const handleStepComplete = (nextStep) => {
    setActiveStep(nextStep);
  };

  const isStepAccessible = (stepId) => {
    // No modo dev, todos os steps são acessíveis
    if (devMode) return true;

    if (stepId === "auth") return true;
    if (stepId === "phone") return !!user;
    if (stepId === "terms") return user?.phone && user?.phoneVerified;
    if (stepId === "personal") return user?.phone && user?.phoneVerified && termsAccepted;
    return false; 
  };

  return (
    <section className="min-h-screen bg-gradient-to-br mt-20 from-purple-900 via-purple-800 to-purple-950 relative overflow-hidden">
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Toggle Modo Dev */}
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setDevMode(!devMode)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              devMode
                ? "bg-yellow-500 text-black"
                : "bg-white bg-opacity-10 text-white hover:bg-opacity-20"
            }`}
          >
            {devMode ? "🔓 Modo Dev ON" : "🔒 Modo Dev OFF"}
          </button>
        </div>

        {/* ✅ BANNER DE STATUS (se tiver aplicação pendente/rejeitada) */}
        {applicationStatus?.hasSubmission && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            {applicationStatus.submission.status === "pending" && (
              <div className="bg-blue-900 bg-opacity-50 border border-blue-400 rounded-lg p-4 flex gap-3">
                <AlertCircle className="h-6 w-6 text-blue-400 flex-shrink-0" />
                <div className="text-sm text-blue-100">
                  <p className="font-semibold mb-1">Solicitação em Análise</p>
                  <p>Sua solicitação está sendo analisada pela equipe. Você receberá um email com o resultado em até 72h úteis.</p>
                  <p className="text-xs mt-2 text-blue-300">
                    Enviado em: {new Date(applicationStatus.submission.submittedAt).toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>
            )}

            {applicationStatus.submission.status === "rejected" && (
              <div className="bg-red-900 bg-opacity-50 border border-red-400 rounded-lg p-4 flex gap-3">
                <AlertCircle className="h-6 w-6 text-red-400 flex-shrink-0" />
                <div className="text-sm text-red-100">
                  <p className="font-semibold mb-1">Solicitação Rejeitada</p>
                  <p className="mb-2">Motivo: {applicationStatus.submission.decision?.reason || "Não especificado"}</p>
                  <p className="text-xs">Você pode enviar uma nova solicitação com os dados corrigidos.</p>
                </div>
              </div>
            )}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            Torne-se um Vendedor
          </h1>
          <p className="text-purple-200">
            Complete os passos abaixo para começar a vender
          </p>
          {devMode && (
            <p className="text-yellow-400 text-sm mt-2 font-semibold">
              ⚠️ Modo Desenvolvimento: Navegação livre ativada
            </p>
          )}
        </motion.div>

        {/* Steps Progress */}
        <motion.div
          className="flex justify-center mb-8 flex-wrap gap-2"
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          {steps.map((step, index) => {
            const isActive = activeStep === step.id;
            const currentIndex = steps.findIndex(s => s.id === activeStep);
            const isCompleted = currentIndex > index;
            const isAccessible = isStepAccessible(step.id);

            return (
              <button
                key={step.id}
                onClick={() => isAccessible && setActiveStep(step.id)}
                disabled={!isAccessible}
                className={`flex items-center px-3 md:px-6 py-2 md:py-3 mx-1 rounded-xl transition-all duration-300 transform ${
                  isActive
                    ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white scale-105 shadow-xl"
                    : isCompleted
                    ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg hover:scale-105"
                    : isAccessible
                    ? "bg-white bg-opacity-10 text-purple-200 hover:bg-opacity-20 shadow-md"
                    : "bg-gray-700 text-gray-500 cursor-not-allowed opacity-50"
                }`}
              >
                <step.icon className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                <span className="text-xs md:text-sm lg:text-base font-semibold whitespace-nowrap">
                  {step.label}
                </span>
              </button>
            );
          })}
        </motion.div>

        {/* Step Content */}
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          {activeStep === "auth" && (
            <AuthVerification onComplete={() => handleStepComplete("phone")} />
          )}
          
          {activeStep === "phone" && (
            <PhoneVerification onComplete={() => handleStepComplete("terms")} />
          )}
          
          {activeStep === "terms" && (
            <TermsAndRules 
              onAccept={() => {
                setTermsAccepted(true);
                handleStepComplete("personal");
              }}
              onBack={() => handleStepComplete("phone")}
            />
          )}
          
          {activeStep === "personal" && (
            <PersonalDataForm 
              onComplete={() => {
                // ✅ Redirecionar para página de aguardando aprovação
                toast.success("Solicitação enviada! Redirecionando...", {
                  duration: 2000,
                });
                setTimeout(() => {
                  window.location.href = "/";
                }, 2000);
              }}
              onBack={() => handleStepComplete("terms")}
            />
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default AnunciarPage;