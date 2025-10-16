import React, { useEffect, useState } from "react";
import { User, Phone, FileText, Image as ImageIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useUserStore } from "../../stores/useUserStore";
import AuthVerification from "../../components/AnunciarSteps/AuthVerification";
import PhoneVerification from "../../components/AnunciarSteps/PhoneVerification";
//import CreateAdForm from "../../components/AnunciarSteps/CreateAdForm";
//import AdImages from "../../components/AnunciarSteps/AdImages";

const steps = [
  { id: "auth", label: "Conta", icon: User },
  { id: "phone", label: "Telefone", icon: Phone },
  { id: "ad", label: "Anúncio", icon: FileText },
  { id: "images", label: "Imagens", icon: ImageIcon },
];

const AnunciarPage = () => {
  const { user } = useUserStore();
  const [activeStep, setActiveStep] = useState("auth");

  useEffect(() => {
    // Verificar qual step mostrar baseado nos dados do usuário
    if (!user) {
      setActiveStep("auth");
      return;
    }

    if (!user.phone) {
      setActiveStep("phone");
      return;
    }

    // Se já tem tudo, pode ir direto pro anúncio
    setActiveStep("ad");
  }, [user]);

  const handleStepComplete = (nextStep) => {
    setActiveStep(nextStep);
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-950 relative overflow-hidden">
      <div className="relative z-10 container mx-auto px-4 py-8">
        <motion.h1
          className="text-4xl font-bold mb-8 text-white text-center"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Criar Anúncio
        </motion.h1>

        {/* Steps Progress */}
        <motion.div
          className="flex justify-center mb-8 flex-wrap gap-2"
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          {steps.map((step, index) => {
            const isActive = activeStep === step.id;
            const isCompleted = steps.findIndex(s => s.id === activeStep) > index;
            const isAccessible = 
              step.id === "auth" || 
              (step.id === "phone" && user) || 
              (step.id === "ad" && user?.phone) ||
              (step.id === "images" && user?.phone);

            return (
              <button
                key={step.id}
                onClick={() => isAccessible && setActiveStep(step.id)}
                disabled={!isAccessible}
                className={`flex items-center px-3 md:px-6 py-2 md:py-3 mx-1 rounded-xl transition-all duration-300 transform ${
                  isActive
                    ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white scale-105 shadow-xl"
                    : isCompleted
                    ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg"
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
          transition={{ duration: 0.5 }}
        >
          {activeStep === "auth" && (
            <AuthVerification onComplete={() => handleStepComplete("phone")} />
          )}
          {activeStep === "phone" && (
            <PhoneVerification onComplete={() => handleStepComplete("ad")} />
          )}
          
        </motion.div>
      </div>
    </section>
  );
};

export default AnunciarPage;