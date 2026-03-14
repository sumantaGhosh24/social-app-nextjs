import {redirect} from "next/navigation";

import {getCategory} from "@/actions/categoryActions";

import UpdateCategoryForm from "../../_components/update-category-form";

export const metadata = {
  title: "Update Category",
};

interface UpdateCategoryProps {
  params: {id: string};
}

export default async function UpdateCategoryPage({
  params,
}: UpdateCategoryProps) {
  const {id} = await params;

  const category = await getCategory(id);

  if (!category) redirect("/categories");

  return (
    <div className="my-10 flex h-[80vh] container mx-auto w-full items-center justify-center">
      <div className="min-w-[80%] space-y-4 rounded-md p-5 shadow-md dark:shadow-gray-400">
        <UpdateCategoryForm category={JSON.parse(JSON.stringify(category))} />
      </div>
    </div>
  );
}
