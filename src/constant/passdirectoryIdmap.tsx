export interface DirectoryMap {
    [key: string]: string;
  }
  
  export interface DirectoryNameMap {
    [key: string]: string;
  }
  
  // Initialize empty mappings
  let CATEGORY_MAP: DirectoryMap = {};
  let CATEGORY_NAME_MAP: DirectoryNameMap = {};
  
  // Function to update the mappings dynamically
  export function updateDirectoryMapping(categoryName: string, categoryId: string) {
    if (categoryName && categoryId) {
      CATEGORY_MAP[categoryName] = categoryId;
      CATEGORY_NAME_MAP[categoryId] = categoryName;
  
      console.log("Updated CATEGORY_MAP:", CATEGORY_MAP);
      console.log("Updated CATEGORY_NAME_MAP:", CATEGORY_NAME_MAP);
    } else {
      console.warn("Invalid categoryName or categoryId provided.");
    }
  }
  
  // Function to fetch the current mappings
  export function getDirectoryMappings() {
    return { CATEGORY_MAP, CATEGORY_NAME_MAP };
  }
  