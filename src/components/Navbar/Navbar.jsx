import { useState } from "react";
import { ShoppingCart, ShoppingBag, ChevronDown, User, Package, Heart, LogOut, Search, Lock } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useCartStore } from "../../stores/useCartStore";
import { getUserData } from "../../utils/getUserData";

const Navbar = () => {
  const { user, logout } = getUserData();
  const { cart } = useCartStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();
  const isAdmin = user?.role?.includes("vendor");
  
  // Verifica se está nas páginas de login ou registro
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <header className="fixed top-0 left-0 w-full bg-gradient-to-r from-purple-600 to-purple-700 bg-opacity-95 backdrop-blur-lg shadow-xl z-40 transition-all duration-300 border-b-2 border-purple-400">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center gap-4">
          <Link
            to="/"
            className="text-xl md:text-2xl font-bold text-white items-center space-x-2 flex hover:scale-105 transition-transform duration-300 whitespace-nowrap"
          >
            <ShoppingBag className="text-white" size={28} />
            Nesati.com
          </Link>

          {/* Barra de Pesquisa - Só aparece se NÃO for página de auth */}
          {!isAuthPage && (
            <div className="flex-1 max-w-2xl mx-4 hidden md:block">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar produtos, marcas e muito mais..."
                  className="w-full px-4 py-2.5 pr-12 rounded-xl border-2 border-purple-300 focus:border-white focus:outline-none transition duration-300 text-gray-700 placeholder-gray-400"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white text-purple-600 p-2 rounded-lg hover:bg-purple-50 transition duration-300">
                  <Search size={20} />
                </button>
              </div>
            </div>
          )}

          <nav className="flex items-center gap-4 md:gap-6">
            {user ? (
              <>
                <Link
                  to={"/cart"}
                  className="relative group text-white hover:text-pink-300 transition duration-300 ease-in-out transform hover:scale-105 flex items-center gap-1"
                >
                  <ShoppingCart size={24} />
                  <span className="hidden lg:inline font-medium">Carrinho</span>
                  {cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-gradient-to-r from-pink-400 to-purple-500 text-white rounded-full px-2 py-0.5 text-xs font-bold shadow-lg">
                      {cart.length}
                    </span>
                  )}
                </Link>

                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 text-white hover:text-pink-300 transition duration-300 ease-in-out"
                  >
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white flex items-center justify-center overflow-hidden">
                      {user?.profilePicture ? (
                        <img 
                          src={user.profilePicture} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="text-purple-600" size={20} />
                      )}
                    </div>
                    <span className="hidden lg:inline font-medium">{user?.name || user?.email?.split('@')[0]}</span>
                    <ChevronDown size={18} className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isDropdownOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-30" 
                        onClick={() => setIsDropdownOpen(false)}
                      />
                      <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl z-40 overflow-hidden border-2 border-purple-200">
                        <div className="px-4 py-3 bg-gradient-to-r from-purple-50 to-purple-100 border-b border-purple-200">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-purple-200 flex items-center justify-center overflow-hidden">
                              {user?.profilePicture ? (
                                <img 
                                  src={user.profilePicture} 
                                  alt="Profile" 
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <User className="text-purple-600" size={24} />
                              )}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800">{user?.name || user?.email?.split('@')[0]}</p>
                              <p className="text-sm text-gray-600">{user?.email}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="py-2">
                          {isAdmin && (
                            <Link
                              to="/admin-dashboard"
                              onClick={() => setIsDropdownOpen(false)}
                              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-purple-50 transition duration-200 border-b border-purple-100"
                            >
                              <Lock size={20} className="text-purple-600" />
                              <span className="font-medium">Painel Admin</span>
                            </Link>
                          )}
                          
                          <Link
                            to="/profile"
                            onClick={() => setIsDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-purple-50 transition duration-200"
                          >
                            <User size={20} className="text-purple-600" />
                            <span className="font-medium">Meu perfil</span>
                          </Link>
                          
                          <Link
                            to="/orders"
                            onClick={() => setIsDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-purple-50 transition duration-200"
                          >
                            <Package size={20} className="text-purple-600" />
                            <span className="font-medium">Minhas compras</span>
                          </Link>
                          
                          <Link
                            to="/favorites"
                            onClick={() => setIsDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-purple-50 transition duration-200"
                          >
                            <Heart size={20} className="text-purple-600" />
                            <span className="font-medium">Favoritos</span>
                          </Link>
                          
                          <button
                            onClick={() => {
                              setIsDropdownOpen(false);
                              logout();
                            }}
                            className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition duration-200 w-full border-t border-gray-200 mt-2"
                          >
                            <LogOut size={20} />
                            <span className="font-medium">Sair</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <Link
                to={"/login"}
                className="bg-white text-purple-600 py-2 px-6 rounded-xl flex items-center transition duration-300 ease-in-out transform hover:scale-105 shadow-lg font-semibold hover:bg-purple-50"
              >
                <User className="mr-2" size={18} />
                Entrar
              </Link>
            )}
          </nav>
        </div>

        {/* Barra de Pesquisa Mobile - Só aparece se NÃO for página de auth */}
        {!isAuthPage && (
          <div className="mt-3 md:hidden">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar produtos, marcas e muito mais..."
                className="w-full px-4 py-2.5 pr-12 rounded-xl border-2 border-purple-300 focus:border-white focus:outline-none transition duration-300 text-gray-700 placeholder-gray-400"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white text-purple-600 p-2 rounded-lg hover:bg-purple-50 transition duration-300">
                <Search size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;