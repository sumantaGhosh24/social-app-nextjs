import {getCategories} from "@/actions/categoryActions";

import CreateProductForm from "../_components/create-product-form";

export const metadata = {
  title: "Create Product",
};

const CreateProduct = async () => {
  const categories = await getCategories();

  return (
    <div className="my-20 flex min-h-screen w-full items-center justify-center">
      <div className="w-[90%] space-y-4 rounded-lg p-5 shadow-lg shadow-black dark:shadow-white">
        <CreateProductForm categories={categories} />
      </div>
    </div>
  );
};

export default CreateProduct;
