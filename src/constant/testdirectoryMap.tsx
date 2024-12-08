import { makeEntryActor } from "@/dfx/service/actor-locator";

export async function getCategoryMappings(): Promise<{
  CATEGORY_MAP: Record<string, string>;
  CATEGORY_NAME_MAP: Record<string, string>;
}> {
  try {
    console.log("Initializing actor...");
    const defaultEntryActor = makeEntryActor({
      agentOptions: {}, // Customize as needed
    });

    console.log("Fetching categories...");
    const response = await defaultEntryActor.get_list_categories("", 0, 100, false);
    console.log("Response from get_list_categories:", response);

    const categoriesResponse = response.entries || [];

    if (categoriesResponse.length === 0) {
      throw new Error("No categories found.");
    }

    // Transform the response into CATEGORY_MAP format
    const CATEGORY_MAP = categoriesResponse.reduce(
      (acc: { [key: string]: string }, [id, data]: [string, any]) => {
        acc[data.name || "Unnamed Category"] = id;
        return acc;
      },
      {}
    );

    // Generate CATEGORY_NAME_MAP by reversing CATEGORY_MAP
    const CATEGORY_NAME_MAP = Object.fromEntries(
      Object.entries(CATEGORY_MAP).map(([key, value]) => [value, key])
    );

    console.log("Dynamic CATEGORY_MAP:", CATEGORY_MAP);
    console.log("Dynamic CATEGORY_NAME_MAP:", CATEGORY_NAME_MAP);

    return { CATEGORY_MAP, CATEGORY_NAME_MAP };
  } catch (error) {
    console.error("Error fetching category mappings:", error);
    return {
      CATEGORY_MAP: {},
      CATEGORY_NAME_MAP: {},
    };
  }
}
