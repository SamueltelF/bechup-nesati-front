import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* SOBRE */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">SOBRE</h3>
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-gray-900 font-bold text-3xl">N</span>
              </div>
              <p className="text-sm leading-relaxed">
               Lorem ipsum, dolor sit amet consectetur adipisicing elit. Accusamus saepe nobis numquam vitae, et aliquam sequi dolorem ea soluta, vero voluptate debitis placeat facilis consectetur. Beatae ab eaque ut facilis?
              </p>
            </div>
          </div>

          {/* ACESSO RÁPIDO */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">ACESSO RÁPIDO</h3>
            <ul className="space-y-3">
              <li>
                <a href="/anunciar" className="text-sm hover:text-white transition-colors">
                  Anunciar
                </a>
              </li>
              <li>
                <a href="/perguntas-frequentes" className="text-sm hover:text-white transition-colors">
                  Perguntas frequentes
                </a>
              </li>
              <li>
                <a href="/ajuda" className="text-sm hover:text-white transition-colors">
                  Central de Ajuda
                </a>
              </li>
            </ul>
          </div>

          {/* COMO FUNCIONA */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">COMO FUNCIONA</h3>
            <ul className="space-y-3">
              <li>
                <a href="/como-funciona" className="text-sm hover:text-white transition-colors">
                  Como funciona
                </a>
              </li>
              <li>
                <a href="/vantagens" className="text-sm hover:text-white transition-colors">
                  Vantagens
                </a>
              </li>
              <li>
                <a href="/tarifas" className="text-sm hover:text-white transition-colors">
                  Tarifas e prazos
                </a>
              </li>
            </ul>
          </div>

          {/* INSTITUCIONAL */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">INSTITUCIONAL</h3>
            <ul className="space-y-3">
              <li>
                <a href="/termos" className="text-sm hover:text-white transition-colors">
                  Termos de uso
                </a>
              </li>
              <li>
                <a href="/privacidade" className="text-sm hover:text-white transition-colors">
                  Política de privacidade
                </a>
              </li>
              <li>
                <a href="/reembolso" className="text-sm hover:text-white transition-colors">
                  Política de reembolso
                </a>
              </li>
              <li>
                <a href="/trabalhe-conosco" className="text-sm hover:text-white transition-colors">
                  Trabalhe conosco
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;