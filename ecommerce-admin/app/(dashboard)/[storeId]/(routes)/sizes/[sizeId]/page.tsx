import prismadb from "@/lib/prismadb";
import { SizeForm } from "./components/size-form";

interface SizePageProps {
  params: { storeId: string; sizeId: string };
}

const SizePage = async ({ params }: SizePageProps) => {
  const parameters = await params;
  const size = await prismadb.size.findUnique({
    where: {
      id: parameters.sizeId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeForm initialData={size} />
      </div>
    </div>
  );
};

export default SizePage;
