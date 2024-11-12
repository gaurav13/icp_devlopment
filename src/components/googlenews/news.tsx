"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';

type Article = {
  title: string;
  link: string;
  snippet: string | null;
  published: string;
  image: string | null;
  companynames: string;
};

const NewsComponent = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [directoryId, setDirectoryId] = useState<string | null>(null);

  // Extract directoryId from the URL
  useEffect(() => {
    if (typeof window !== "undefined") {
      const pathname = window.location.pathname;
      console.log("Initial pathname:", pathname);

      const pathSegments = pathname.split('/').filter(segment => segment);
      const id = pathSegments[pathSegments.length - 1] || null;

      console.log("Extracted directoryId from URL:", id);
      setDirectoryId(id);
    }
  }, []);

  // Fetch news data when directoryId is set
  useEffect(() => {
    const fetchNews = async () => {
      if (directoryId) {
        try {
          const response = await axios.get(`https://blockza.io/chart/newss.php?id=${directoryId}`);
          console.log("url:", response);
          console.log("News data:", response.data);

          if (response.data && response.data.news_results && response.data.news_results.length > 0) {
            setArticles(response.data.news_results);
          } else {
         //   setError("No news articles found.");
            setArticles([]); // Clear articles if no results
          }
        } catch (error: any) {
          setError("Failed to fetch news data.");
          setArticles([]); // Clear articles if there was an error
        }
      }
    };

    fetchNews();
  }, [directoryId]); // Trigger only when directoryId changes

  // Helper function to format the published date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Function to truncate titles
  const truncateTitle = (title: string, length: number = 100) => {
    const trimmedTitle = title.trim();
    return trimmedTitle.length > length ? trimmedTitle.slice(0, length) + "..." : trimmedTitle;
  };

  // Don't render anything if there are no articles and no error
  if (!articles.length && !error) {
    return null;
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Latest Newsss</h2>
      <div className="row">
        {error ? (
          <p className="text-center text-danger">{error}</p>
        ) : (
          articles.map((article, index) => (
            <div key={index} className="col-md-12 mb-4">
              <div className="news-item border rounded p-3 d-flex align-items-start">
                <img
                  className='img-fluid rounded mr-3'
                  src={article.image || 'https://via.placeholder.com/150'}
                  alt="News Image"
                  style={{ width: '60px', height: '60px', borderRadius: '5px', objectFit: 'cover' }}
                />
                <div className="d-flex flex-column ml-5">
                  <strong className="small mb-2">
                    <a href={article.link} target="_blank" rel="noopener noreferrer" className="text-dark">
                      {truncateTitle(article.title, 75)}
                    </a>
                  </strong>
                  <div className="text-muted small">
                    {formatDate(article.published)}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NewsComponent;
