// Define the mapping for category names to category IDs
export const CATEGORY_MAP: Record<string, string> = {
    blockchain: "1719578778026731208",
    web3: "1732675845005321882",
    metaverse: "1732000863567522350",
    defi: "1732000863567522351",
    nft: "1732000863567522352",
    gaming: "1732000863567522353",
  };
  
  // Optional: Reverse mapping for category IDs to names
  export const CATEGORY_NAME_MAP: Record<string, string> = Object.fromEntries(
    Object.entries(CATEGORY_MAP).map(([key, value]) => [value, key])
  );
  