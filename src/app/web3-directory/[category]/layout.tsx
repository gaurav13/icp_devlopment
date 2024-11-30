import { Metadata } from 'next';
import { siteConfig } from '@/constant/config';
import { LanguageForSchema } from '@/constant/language';

interface LayoutProps {
  params: { category: string };
  children: React.ReactNode;
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  let categoryData;

  try {
    const response = await fetch(`${siteConfig.aiurl}/categories/${params.category}`);
    
    // Check if the response is JSON
    const contentType = response.headers.get("content-type");
    if (!response.ok || !contentType || !contentType.includes("application/json")) {
      console.error(`Unexpected Response: ${response.status} ${response.statusText}`);
      throw new Error("Invalid JSON response or API error");
    }

    categoryData = await response.json();
  } catch (error) {
    console.error("Error fetching category data:", error);

    // Fallback to dummy data
    categoryData = {
      name: `${params.category.charAt(0).toUpperCase()}${params.category.slice(1)}`,
      description: `Explore top Web3 companies in the ${params.category} category. Learn about their mission, technology, and contributions to the Web3 ecosystem.`,
      logo: `${siteConfig.url}/images/default-logo.png`,
      banner: `${siteConfig.url}/images/default-banner.jpg`,
    };
    if (params.category === "blockchain") {
      categoryData = {
        name: "Blockchain Directory",
        description: "This Blockchain Directory connects you with companies at the forefront of blockchain technology. Access corporate details, meet innovative teams, and find opportunities to build partnerships that shape the future of decentralized solutions.",
        logo: "https://blockza.io/category_banner/crypto_banner.jpg",
        banner: "https://blockza.io/category_banner/crypto_banner.jpg",
      };
    } else if (params.category === "nft") {
      categoryData = {
        name: "NFT Web3 Directory",
        description: "Explore the top NFT platforms and projects revolutionizing the digital art world.",
        logo: "https://blockza.io/category_banner/nft.jpg",
        banner: "https://blockza.io/category_banner/nft.jpg",
      };
    } else if (params.category === "defi") {
      categoryData = {
        name: "DeFi Web3 Directory",
        description: "Find the most innovative DeFi platforms and projects in our comprehensive directory.",
        logo: "https://blockza.io/category_banner/defi.jpg",
        banner: "https://blockza.io/category_banner/defi.jpg",
      };
    } else if (params.category === "dao") {
      categoryData = {
        name: "DAO Web3 Directory",
        description: "Browse the leading decentralized autonomous organizations (DAOs) in the Web3 space.",
        logo: "https://blockza.io/category_banner/dao.jpg",
        banner: "https://blockza.io/category_banner/dao.jpg",
      };
    } else {
      categoryData = {
        name: `${params.category.charAt(0).toUpperCase()}${params.category.slice(1)} Web3 Directory`,
        description: `Discover top Web3 projects and platforms in the ${params.category} category.`,
        logo: "https://blockza.io/category_banner/default.jpg",
        banner: "https://blockza.io/category_banner/default.jpg",
      };
    }
    
  }

  return {
    title: `${categoryData.name} | BlockZa`,
    description: categoryData.description,
    twitter: {
      card: 'summary_large_image',
      title: `${categoryData.name} | BlockZa`,
      description: categoryData.description,
      images: [categoryData.banner],
      creator: siteConfig.twitterCreator,
    },
    openGraph: {
      url: `${siteConfig.url}/web3-directory/${params.category}`,
      title: `${categoryData.name} Companies | BlockZa`,
      description: categoryData.description,
      siteName: 'BlockZa',
      images: [categoryData.banner],
      type: 'website',
      locale: LanguageForSchema,
    },
  };
}


export default async function RootLayout({ children, params }: LayoutProps) {
  let categoryData;

  try {
    const response = await fetch(`${siteConfig.aiurl}/categories/${params.category}`);
    
    // Ensure the response is JSON
    const contentType = response.headers.get('content-type');
    if (!response.ok || !contentType || !contentType.includes('application/json')) {
      console.warn(`Unexpected Response: ${response.status} ${response.statusText}`);
      throw new Error('Invalid JSON response or API error');
    }

    categoryData = await response.json();
  } catch (error) {
    console.error('Error fetching category data:', error);

    // Use fallback dummy data
    categoryData = {
      name: `${params.category.charAt(0).toUpperCase()}${params.category.slice(1)}`,
      description: `Explore top Web3 companies in the ${params.category} category. Learn about their mission, technology, and contributions to the Web3 ecosystem.`,
      logo: `${siteConfig.url}/images/default-logo.png`,
      banner: `${siteConfig.url}/images/default-banner.jpg`,
    };
    
  }

  return (
    <>
      <meta name="description" content={categoryData.description} />
      <script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: `${categoryData.name} | BlockZa`,
      description: categoryData.description,
      url: `${siteConfig.url}/web3-directory/${params.category}/`,
      publisher: {
        "@type": "Organization",
        name: "Blockza",
        url: `${siteConfig.url}`,
        logo: {
          "@type": "ImageObject",
          url: `${siteConfig.url}/_next/static/media/headerlogo.9306cb65.png`,
        },
      },
    }),
  }}
/>

<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": `${siteConfig.url}`
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Web3 Directory",
          "item": `${siteConfig.url}/web3-directory/`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": `${params.category}`,
          "item": `${siteConfig.url}/web3-directory/${params.category}/`
        }
      ]
    })
  }}
/>



      {children}
    </>
  );
}