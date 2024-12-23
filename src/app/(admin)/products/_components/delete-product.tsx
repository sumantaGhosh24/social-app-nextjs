"use client";

import {useState} from "react";
import {Trash} from "lucide-react";

import {deleteProduct} from "@/actions/productActions";
import {useToast} from "@/hooks/use-toast";
import DialogProvider from "@/components/dialog-provider";
import {Button} from "@/components/ui/button";

interface DeleteProductProps {
  id: string;
}

const DeleteProduct = ({id}: DeleteProductProps) => {
  const [loading, setLoading] = useState(false);

  const {toast} = useToast();

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteProduct(id);

      toast({
        title: "Product deleted!",
        description: "Product deleted successful!",
      });
    } catch (error: any) {
      toast({
        title: "Something went wrong!",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DialogProvider
      title="Delete Product"
      description="Are you really want to delete this product?"
      trigger={
        <Button className="bg-rose-700 hover:bg-rose-800">
          <Trash size={24} className="mr-2" /> Delete
        </Button>
      }
    >
      <Button
        onClick={handleDelete}
        className="bg-rose-700 hover:bg-rose-800 disabled:bg-rose-300"
        disabled={loading}
      >
        <Trash size={24} className="mr-2" />
        {loading ? "Deleting..." : "Delete Product"}
      </Button>
    </DialogProvider>
  );
};

export default DeleteProduct;
