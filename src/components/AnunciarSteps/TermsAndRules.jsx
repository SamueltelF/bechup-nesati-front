import React, { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Check, AlertCircle, ChevronLeft } from "lucide-react";

const TermsAndRules = ({ onAccept, onBack }) => {
  const [readTerms, setReadTerms] = useState(false);
  const [readRules, setReadRules] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedRules, setAcceptedRules] = useState(false);

  const canProceed = acceptedTerms && acceptedRules;

  const handleScroll = (e, type) => {
    const element = e.target;
    const isAtBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 10;
    
    if (isAtBottom) {
      if (type === "terms") setReadTerms(true);
      if (type === "rules") setReadRules(true);
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
          <FileText className="h-16 w-16 text-purple-300" />
        </div>

        <h2 className="text-3xl font-bold text-center text-white mb-2">
          Termos e Regras de Vendedor
        </h2>
        <p className="text-center text-purple-200 mb-8">
          Leia atentamente antes de continuar
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Termos de Uso */}
          <div className="bg-white bg-opacity-5 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <FileText className="h-6 w-6 text-blue-400" />
              Termos de Uso
            </h3>
            
            <div
              onScroll={(e) => handleScroll(e, "terms")}
              className="h-64 overflow-y-auto bg-white bg-opacity-10 rounded-lg p-4 mb-4 text-purple-100 text-sm space-y-3 custom-scrollbar"
            >
              <h4 className="font-semibold text-white">1. Aceitação dos Termos</h4>
              <p>Ao utilizar nossa plataforma como vendedor, você concorda em cumprir estes termos e todas as leis aplicáveis.</p>

              <h4 className="font-semibold text-white">2. Produtos Digitais</h4>
              <p>Nossa plataforma é exclusiva para venda de produtos digitais. É proibida a venda de produtos físicos, serviços ilegais ou conteúdo protegido por direitos autorais sem autorização.</p>

              <h4 className="font-semibold text-white">3. Responsabilidades do Vendedor</h4>
              <p>Você é responsável por:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Fornecer informações precisas sobre seus produtos</li>
                <li>Garantir a qualidade do conteúdo vendido</li>
                <li>Responder dúvidas dos compradores</li>
                <li>Cumprir prazos de entrega digital</li>
              </ul>

              <h4 className="font-semibold text-white">4. Taxas e Pagamentos</h4>
              <p>A plataforma cobra uma taxa de X% sobre cada venda. Os pagamentos são processados em até 7 dias após a confirmação da compra.</p>

              <h4 className="font-semibold text-white">5. Propriedade Intelectual</h4>
              <p>Você garante ter todos os direitos necessários sobre o conteúdo que vende e não infringir direitos de terceiros.</p>

              <h4 className="font-semibold text-white">6. Suspensão e Cancelamento</h4>
              <p>Reservamos o direito de suspender ou cancelar sua conta em caso de violação destes termos.</p>

              <h4 className="font-semibold text-white">7. Dados Pessoais</h4>
              <p>Seus dados serão utilizados conforme nossa Política de Privacidade para processar vendas e cumprir obrigações legais.</p>
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                disabled={!readTerms}
                className="mt-1 h-5 w-5 rounded border-purple-400 text-purple-600 focus:ring-purple-500 disabled:opacity-50"
              />
              <span className="text-purple-200 text-sm">
                {readTerms ? (
                  <>Li e aceito os Termos de Uso</>
                ) : (
                  <>Role até o final para aceitar</>
                )}
              </span>
            </label>
          </div>

          {/* Regras de Vendedor */}
          <div className="bg-white bg-opacity-5 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <AlertCircle className="h-6 w-6 text-yellow-400" />
              Regras de Vendedor
            </h3>
            
            <div
              onScroll={(e) => handleScroll(e, "rules")}
              className="h-64 overflow-y-auto bg-white bg-opacity-10 rounded-lg p-4 mb-4 text-purple-100 text-sm space-y-3 custom-scrollbar"
            >
              <h4 className="font-semibold text-white">1. Conteúdo Proibido</h4>
              <p>É estritamente proibido vender:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Conteúdo ilegal ou que incite violência</li>
                <li>Material com direitos autorais sem autorização</li>
                <li>Produtos falsificados ou enganosos</li>
                <li>Conteúdo adulto sem classificação adequada</li>
                <li>Malware, vírus ou software nocivo</li>
              </ul>

              <h4 className="font-semibold text-white">2. Qualidade do Produto</h4>
              <p>Todos os produtos devem:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Ter descrição clara e precisa</li>
                <li>Imagens de qualidade representando o produto</li>
                <li>Funcionar conforme anunciado</li>
                <li>Ser entregues em formato adequado</li>
              </ul>

              <h4 className="font-semibold text-white">3. Atendimento ao Cliente</h4>
              <p>Você deve:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Responder mensagens em até 48 horas</li>
                <li>Resolver problemas de forma profissional</li>
                <li>Aceitar devoluções conforme política da plataforma</li>
              </ul>

              <h4 className="font-semibold text-white">4. Precificação Justa</h4>
              <p>Preços devem ser justos e condizentes com o mercado. Práticas de preço abusivo podem resultar em suspensão.</p>

              <h4 className="font-semibold text-white">5. Verificação de Identidade</h4>
              <p>Você deve fornecer documentos válidos (CPF, RG, foto) para aprovação como vendedor.</p>

              <h4 className="font-semibold text-white">6. Penalidades</h4>
              <p>Violações podem resultar em:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Advertência formal</li>
                <li>Suspensão temporária (7-30 dias)</li>
                <li>Banimento permanente</li>
                <li>Retenção de pagamentos</li>
              </ul>
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={acceptedRules}
                onChange={(e) => setAcceptedRules(e.target.checked)}
                disabled={!readRules}
                className="mt-1 h-5 w-5 rounded border-purple-400 text-purple-600 focus:ring-purple-500 disabled:opacity-50"
              />
              <span className="text-purple-200 text-sm">
                {readRules ? (
                  <>Li e aceito as Regras de Vendedor</>
                ) : (
                  <>Role até o final para aceitar</>
                )}
              </span>
            </label>
          </div>
        </div>

        {/* Ação Final */}
        <div className="flex gap-4">
          <button
            onClick={onBack}
            className="flex-1 py-3 bg-white bg-opacity-10 text-white font-semibold rounded-lg hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <ChevronLeft className="h-5 w-5" />
            Voltar
          </button>

          <button
            onClick={onAccept}
            disabled={!canProceed}
            className="flex-1 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Check className="h-5 w-5" />
            Aceitar e Continuar
          </button>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(168, 85, 247, 0.5);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(168, 85, 247, 0.7);
        }
      `}</style>
    </motion.div>
  );
};

export default TermsAndRules;