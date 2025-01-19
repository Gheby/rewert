import prismadb from "@/lib/prismadb";
import { CategoryForm } from "./components/category-form";

interface BillboardPageProps {
  params: { storeId: string; categoryId: string };
}
//5:30 ceva nu e la fel, am chestii extra

const CategoryPage = async ({ params }: BillboardPageProps) => {
  const parameters = await params;

  const category = await prismadb.category.findUnique({
    where: {
      id: parameters.categoryId,
    },
  });

  const billboards = await prismadb.billboard.findMany({
    where:{
      storeId: parameters.storeId
    }
  })

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryForm billboards={billboards} initialData={category} />
      </div>
    </div>
  );
};

export default CategoryPage;
