import { makeEntryActor } from "@/dfx/service/actor-locator";

export async function fetchCategories(): Promise<{ [key: string]: string }> {
  try {
    const defaultEntryActor = makeEntryActor({ agentOptions: {} });
    const resp = await defaultEntryActor.get_list_categories("", 0, 100, false); // Fetch categories

    const categoriesResponse = resp.entries || [];

    if (categoriesResponse.length > 0) {
      // Format categories into { [key: string]: string }
      const categoriesJSON = categoriesResponse.reduce((acc: { [key: string]: string }, [id, data]: [string, any]) => {
        acc[data.name || "Unnamed Category"] = id;
        return acc;
      }, {});

      console.log("Formatted Categories JSON:", categoriesJSON);
      return categoriesJSON;
    } else {
      console.warn("No categories found in fetchCategories.");
      return {};
    }
  } catch (error) {
    console.error("Error fetching categories:", error);
    return {}; // Return empty object on error
  }
}
