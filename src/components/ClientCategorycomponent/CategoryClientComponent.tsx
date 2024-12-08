'use client';

export default function CategoryClientComponent({
  category,
  categoryId,
}: {
  category: string;
  categoryId: string;
}) {
  if (!category || !categoryId) {
    throw new Error("Invalid category or categoryId provided to the client component.");
  }

  return (
    <div>
      <h2>Client Component</h2>
      <p>Category: {category}</p>
      <p>Category ID: {categoryId}</p>
    </div>
  );
}
