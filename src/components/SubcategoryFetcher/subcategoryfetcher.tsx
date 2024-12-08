import { makeEntryActor } from "@/dfx/service/actor-locator";

export async function fetchSubcategories(
    parentCategoryId: string
  ): Promise<{ [key: string]: string }> {
    try {
      const defaultEntryActor = makeEntryActor({ agentOptions: {} });
  
      // Fetch all categories
      const resp = await defaultEntryActor.get_list_categories(
        "", // Search query (empty for all categories)
        0,  // Start index
        100, // Length (adjust if needed)
        false // Include all categories, not just parent categories
      );
  
      console.log("Raw categories response:", resp);
  
      const allCategories = resp.entries || [];
      console.log("All Categories:", allCategories);
  
      // Find the parent category
      const parentCategory = allCategories.find(([id, data]: [string, any]) => {
        console.log(`Checking if ${id} === ${parentCategoryId}`);
        return id === parentCategoryId;
      });
  
      if (!parentCategory) {
        console.warn(`Parent category with ID ${parentCategoryId} not found.`);
        return {};
      }
  
      console.log(`Parent category found:`, parentCategory);
  
      const children = parentCategory[1].children || [];
      console.log("Children array for parent category:", children);
  
      // Check if `children` is empty
      if (children.length === 0) {
        console.warn(`No subcategories found for category ID ${parentCategoryId}.`);
        return {};
      }
  
      // Map subcategory IDs to their corresponding data
      const subcategories = children.reduce(
        (acc: { [key: string]: string }, subcategoryId: string) => {
          const subcategory = allCategories.find(([id]) => {
            console.log(`Checking if ${id} matches subcategoryId ${subcategoryId}`);
            return id === subcategoryId;
          });
  
          if (subcategory) {
            acc[subcategory[1].name || "Unnamed Subcategory"] = subcategoryId;
          } else {
            console.error(`Subcategory with ID ${subcategoryId} not found in allCategories.`);
          }
  
          return acc;
        },
        {}
      );
  
      console.log("Formatted Subcategories JSON:", subcategories);
  
      return subcategories;
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      return {}; // Return empty object on error
    }
  }
  