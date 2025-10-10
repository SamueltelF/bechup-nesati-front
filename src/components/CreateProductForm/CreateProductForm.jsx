import { useState } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Upload, Loader } from "lucide-react";
import { useProductStore } from "../../stores/useProductStore";

const categories = [
  "assinaturas",
  "jogos",
  "cursos",
  "redes",
  "socias",
  "digitais",
  "edicao",
  "programação",
  "sodtware"

  
];

const CreateProductForm = () => {
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    produtoV: "",
    image: "",
  });

  const { createProduct, loading } = useProductStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProduct(newProduct);
      setNewProduct({
        name: "",
        description: "",
        price: "",
        category: "",
        produtoV: "",
        image: "",
      });
    } catch {
      console.log("erro ao criar um produto");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setNewProduct({ ...newProduct, image: reader.result });
      };

      // here readasDataURL is used to convert the image to base64 which is a string representation of the image
      reader.readAsDataURL(file); // base64
    }
  };

  return (
    <motion.div
      className="bg-gray-800 shadow-lg rounded-lg p-4 md:p-8 mb-8 max-w-xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h2 className="text-2xl font-semibold mb-6 text-[#FF1493]">
        Criar produto novo
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-300"
          >
            Nome do produto
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2
						 px-3 text-white focus:outline-none focus:ring-2
						focus:ring-[#FF1493] focus:border-[#FF1493]"
            obrigatório
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-300"
          >
            Descrição
          </label>
          <textarea
            id="description"
            name="description"
            value={newProduct.description}
            onChange={(e) =>
              setNewProduct({ ...newProduct, description: e.target.value })
            }
            rows="3"
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm
						 py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[#FF1493] 
						 focus:border-[#FF1493]"
            obrigatório
          />
        </div>

        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-300"
          >
            Preço
          </label>
          <input
            type="number"
            id="price"
            name="price"
            min={0}
            value={newProduct.price}
            onChange={(e) =>
              setNewProduct({ ...newProduct, price: e.target.value })
            }
            step="0.01"
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm 
						py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[#FF1493]
						 focus:border-[#FF1493]"
            obrigatório
          />
        </div>

        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-300"
          >
            Categoria
          </label>
          <select
            id="category"
            name="category"
            value={newProduct.category}
            onChange={(e) =>
              setNewProduct({ ...newProduct, category: e.target.value })
            }
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md
						 shadow-sm py-2 px-3 text-white focus:outline-none 
						 focus:ring-2 focus:ring-[#FF1493] focus:border-[#FF1493]"
            obrigatório
          >
            <option value="">Selecione uma categoria</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label
            htmlFor="produtoV"
            className="block text-sm font-medium text-gray-300"
          >
            Link Pdf
          </label>
          <textarea
            id="description"
            name="description"
            value={newProduct.produtoV}
            onChange={(e) =>
              setNewProduct({ ...newProduct, produtoV: e.target.value })
            }
            rows="3"
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm
						 py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[#FF1493] 
						 focus:border-[#FF1493]"
            obrigatório
          />
        </div>

        <div className="mt-1 flex items-center">
          <input
            type="file"
            id="image"
            className="sr-only"
            accept="image/*,image/webp"
            onChange={handleImageChange}
          />
          <label
            htmlFor="image"
            className="cursor-pointer bg-gray-700 py-2 px-3 border border-gray-600 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF1493]"
          >
            <Upload className="h-5 w-5 inline-block mr-2" />
            Carregar imagem
          </label>
          {newProduct.image ? (
            <span className="ml-3 text-sm text-green-400">Image uploaded </span>
          ) : (
            <span className="ml-3 text-sm text-gray-400">
              Por favor carregue uma imagem
            </span>
          )}
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md 
					shadow-sm text-sm font-medium text-white bg-[#FF1493] hover:bg-[#FF1493] 
					focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF1493] disabled:opacity-50"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader
                className="mr-2 h-5 w-5 animate-spin"
                aria-hidden="true"
              />
              Carregando...
            </>
          ) : (
            <>
              <PlusCircle className="mr-2 h-5 w-5" />
              Criar produto
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
};
export default CreateProductForm;
