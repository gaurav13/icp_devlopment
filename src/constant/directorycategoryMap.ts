import { dao_Category_Link } from "./routes";
import { LANG } from '@/constant/language';
// Define the mapping for category names to category IDs

export const CATEGORY_MAP: Record<string, string> = LANG === 'jp' 
  ? {
      blockchain: "jp1718641457527889243",
      web3: "jp1718641230817970431",
      metaverse: "jp1718641722539268658",
      defi: "jp1719210427243611048",
      nft: "jp1718968029182069160",
      blockchain_games: "jp1719210909413102943",
      dao: "jp1719211072131510431",
      artificial_intelligence: "jp1718645044417924753",
      cryptocurrency: "jp1719210557164450999",
    }
  : {
      blockchain: "1732000863567522348",
      web3: "1718641230817970431",
      metaverse: "1718641722539268658",
      defi: "1719210427243611048",
      nft: "1718968029182069160",
      blockchain_games: "1719210909413102943",
      dao: "1719211072131510431",
      artificial_intelligence: "1718645044417924753",
      cryptocurrency: "1719210557164450999",
    };

  // Optional: Reverse mapping for category IDs to names
  export const CATEGORY_NAME_MAP: Record<string, string> = Object.fromEntries(
    Object.entries(CATEGORY_MAP).map(([key, value]) => [value, key])
  );
  