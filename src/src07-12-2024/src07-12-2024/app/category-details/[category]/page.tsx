export default function CategoryPage({ params }: { params: { category: string } }) {
    const { category } = params;
  
    // Mock database
    const mockDatabase = {
      blockchain: "1732000863567522348",
      web3: "1732780473544877639",
      metaverse: "1732000863567522350",
    };
  
    // Simple data fetching logic
    const categoryId = mockDatabase[category];
  
    if (!categoryId) {
      throw new Error(`Category not found: ${category}`);
    }
  
    return (
      <div>
        <h1>Category: {category}</h1>
        <p>Category ID: {categoryId}</p>
      </div>
    );
  }
  
  export async function generateStaticParams() {
  console.log("Generating static params...");

  const mockDatabase = {
    blockchain: "1732000863567522348",
    web3: "1732780473544877639",
    metaverse: "1732000863567522350",
  };

  const staticParams = Object.keys(mockDatabase).map((category) => ({
    category,
  }));

  console.log("Static Params Generated:", staticParams);
  return staticParams;
}
