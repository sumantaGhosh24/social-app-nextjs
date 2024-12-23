import {redirect} from "next/navigation";

import {getProduct} from "@/actions/productActions";
import {getCategories} from "@/actions/categoryActions";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";

import UpdateProductForm from "../../_components/update-product-form";
import AddProductImage from "../../_components/add-product-image";
import RemoveProductImage from "../../_components/remove-product-image";

export const metadata = {
  title: "Update Product",
};

interface UpdateProductProps {
  params: {id: string};
}

const UpdateProduct = async ({params}: UpdateProductProps) => {
  const {id} = await params;

  const product = await getProduct(id);

  if (!product) redirect("/product");

  const categories = await getCategories();

  return (
    <>
      <Tabs defaultValue="update-product" className="w-full">
        <TabsList className="mx-10 mt-10 grid grid-cols-3">
          <TabsTrigger value="update-product">Update Product</TabsTrigger>
          <TabsTrigger value="add-image">Add Product Image</TabsTrigger>
          <TabsTrigger value="remove-image">Remove Product Image</TabsTrigger>
        </TabsList>
        <TabsContent value="update-product">
          <UpdateProductForm
            product={JSON.parse(JSON.stringify(product))}
            categories={JSON.parse(JSON.stringify(categories))}
          />
        </TabsContent>
        <TabsContent value="add-image">
          <AddProductImage product={JSON.parse(JSON.stringify(product))} />
        </TabsContent>
        <TabsContent value="remove-image">
          <RemoveProductImage product={JSON.parse(JSON.stringify(product))} />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default UpdateProduct;
