import React, { useEffect, useState } from 'react';
import axios from 'axios';

type Article = {
  title: string;
  link: string;
  snippet: string | null;
  published: string;
  image: string | null;
};

const NewsComponent = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(`https://blockza.io/chart/newss.php?id=1720592377531987357`);
        if (response.data && response.data.news_results) {
          setArticles(response.data.news_results);
        } else {
          setError("No news articles found.");
        }
      } catch (error: any) {
        setError("Failed to fetch news data.");
      }
    };

    fetchNews();
  }, []);

  // Helper function to format the published date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };
  const truncateTitle = (title: string, length: number = 100) => {
    const trimmedTitle = title.trim(); // Remove leading and trailing whitespace
    return trimmedTitle.length > length ? trimmedTitle.slice(0, length) + "..." : trimmedTitle;
  };
  return (
    <div className="container mt-4">
      <h2 className="mb-4">Latest News</h2>
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
                {/*<p className="mt-2">{article.snippet || 'No description available.'}</p>*/}
              </div>
          
          ))
        )}
      </div>
    </div>
  );
};

export default NewsComponent;
