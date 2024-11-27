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
  }

  return {
    title: `${categoryData.name} Companies | BlockZa`,
    description: categoryData.description,
    twitter: {
      card: 'summary_large_image',
      title: `${categoryData.name} Companies | BlockZa`,
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
            name: `${categoryData.name} Companies | BlockZa`,
            description: categoryData.description,
            url: `${siteConfig.url}/web3-directory/${params.category}`,
          }),
        }}
      />
      {children}
    </>
  );
}

