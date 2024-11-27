import React from "react";
import { CATEGORY_MAP } from "@/constant/directorycategoryMap";
import ClientCategoryPage from "@/components/DirectoryCategory/ClientCategoryPage";

export async function generateStaticParams() {
  return Object.keys(CATEGORY_MAP).map((category) => ({
    category,
  }));
}

export default function DynamicCategoryPage({ params }: { params: { category: string } }) {
  const categoryId = CATEGORY_MAP[params.category];

  if (!categoryId) {
    return <div>Invalid category</div>;
  }

  // Pass the categoryId to the client component
  return <ClientCategoryPage categoryId={categoryId} category={params.category} />;
}
