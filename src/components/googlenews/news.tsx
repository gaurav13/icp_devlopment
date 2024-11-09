"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { usePathname } from 'next/navigation';

type Article = {
  title: string;
  url: string;
  urlToImage: string;
  source: { name: string };
  publishedAt: string;
};

const NewsComponent = () => {
  const [isDataAvailable, setIsDataAvailable] = useState<boolean>(true);
  const [directoryId, setDirectoryId] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState<string>(''); // No default value
  const [articles, setArticles] = useState<Article[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [url, setUrl] = useState<string>(''); // New state for debugging URL
  const pathname = usePathname();

  useEffect(() => {
    console.log("Initial pathname:", pathname);

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const id = params.get('directoryId');
      console.log("Extracted directoryId from URL:", id);
      
      if (id) {
        setDirectoryId(id);  // Set directoryId
        
        // Fetch data immediately after setting directoryId
        const fetchData = async () => {
          try {
            console.log("Fetching data for directoryId:", id);
            const response = await axios.get(`https://blockza.io/chart/company.php?id=${id}`);
            console.log("Response from fetchData:", response.data);

            if (response.data && response.data) {
              setCompanyName(response.data);
              console.log("Setting companyName to:", response.data);
              setIsDataAvailable(true);
            } else {
              console.log("No company name found in fetchData response.");
              setIsDataAvailable(false);
            }
          } catch (error) {
            console.error("Error fetching chart data:", error);
            setIsDataAvailable(false);
          }
        };

        fetchData();
      }
    }
  }, [pathname]);

  useEffect(() => {
    const fetchNews = async () => {
      if (!companyName) {
        console.log("companyName is empty, so fetchNews will not run.");
        return;
      }

      const apiKey = '7fac4aacb67c48ed8450d18d726b6e20';
      const generatedUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
        companyName
      )}&sortBy=publishedAt&apiKey=${apiKey}`;
      
      setUrl(generatedUrl); // Set the URL for debugging
      console.log("Fetching news with URL:", generatedUrl);

      try {
        const response = await fetch(generatedUrl, {
          headers: {
            'User-Agent': 'MyNewsApp/1.0',
            Accept: 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch news articles');
        }

        const data = await response.json();
        if (data.status === 'ok' && data.articles.length > 0) {
          setArticles(data.articles);
        } else {
          setError('No news articles found for ' + companyName);
        }
      } catch (error: any) {
        setError(error.message || 'Failed to retrieve news articles.');
      }
    };

    console.log("companyName before calling fetchNews:", companyName);
    fetchNews();
  }, [companyName]);
  { /*if (!companyName || articles.length === 0 || error) return null;*/}
  return (
    <div style={{ width: 'auto' }}>
      <div className="news-header">
        <span>Latest {companyName} News </span>
        <a href="#" target="_blank" rel="noopener noreferrer">
          View All
        </a>
      </div>

      {/* Display the URL in a div for debugging */}
      <div className="url-debug" style={{ margin: '10px 0', color: 'red' }}>
        <strong>Debug URL:</strong> {url || "URL not generated yet"}
      </div>

      <div className="news-container">
        {error ? (
          <p className="text-center text-danger">{error}</p>
        ) : articles.length > 0 ? (
          articles.map((article, index) => (
            <div key={index} className="news-item">
              <img
                src={article.urlToImage || 'placeholder.jpg'}
                className="news-image"
                alt="News"
              />
              <div className="news-content">
                <p className="news-title">
                  <a href={article.url} target="_blank" rel="noopener noreferrer">
                    {article.title}
                  </a>
                </p>
                <p className="news-source">{article.source.name}</p>
                <p className="news-time text-right">
                  {new Date(article.publishedAt).toLocaleString('en-US', {
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true,
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-muted">Loading...</p>
        )}
      </div>

      <style jsx>{`
        .news-container {
          max-height: 400px;
          overflow-y: scroll;
          padding: 10px;
          background-color: #f9f9f9;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        .news-header {
          font-size: 1.5rem;
          font-weight: bold;
          margin-bottom: 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .news-header a {
          font-size: 0.9rem;
          color: #007bff;
        }
        .news-item {
          display: flex;
          align-items: center;
          padding: 10px 0;
          border-bottom: 1px solid #ddd;
        }
        .news-item:last-child {
          border-bottom: none;
        }
        .news-title {
          font-size: 0.9rem;
          font-weight: 500;
          margin: 0;
        }
        .news-source {
          font-size: 0.8rem;
          color: #888;
        }
        .news-image {
          width: 60px;
          height: 60px;
          margin-right: 10px;
          border-radius: 5px;
          object-fit: cover;
        }
        .news-content {
          flex: 1;
        }
        .news-time {
          font-size: 0.8rem;
          color: #999;
        }
        .url-debug {
          font-size: 0.9rem;
          color: red;
        }
      `}</style>
    </div>
  );
};

export default NewsComponent;
