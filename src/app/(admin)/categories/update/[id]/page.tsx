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
    <div className="my-20 flex h-[80vh] w-full items-center justify-center">
      <div className="min-w-[60%] space-y-4 rounded-lg p-5 shadow-lg shadow-black dark:shadow-white">
        <UpdateCategoryForm category={JSON.parse(JSON.stringify(category))} />
      </div>
    </div>
  );
}
