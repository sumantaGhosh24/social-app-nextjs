import CreateCategoryForm from "../_components/create-category-form";

export const metadata = {
  title: "Create Category",
};

export default function CreateCategoryPage() {
  return (
    <div className="flex h-[80vh] container mx-auto w-full items-center justify-center">
      <div className="min-w-[80%] space-y-4 rounded-md p-5 shadow-md dark:shadow-gray-400">
        <CreateCategoryForm />
      </div>
    </div>
  );
}
