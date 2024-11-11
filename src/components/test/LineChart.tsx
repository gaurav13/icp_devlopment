"use client";

import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartOptions, Chart } from 'chart.js';
import axios from 'axios';
import { usePathname } from 'next/navigation';

ChartJS.register(ArcElement, Tooltip, Legend);




const MarketSentimentChart = () => {
  const [chartData, setChartData] = useState<number[]>([]);
  const [isDataAvailable, setIsDataAvailable] = useState<boolean>(false);
  const [directoryId, setDirectoryId] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const id = params.get('directoryId');
      setDirectoryId(id);
    }

    const fetchData = async () => {
      if (directoryId) {
        try {
          const response = await axios.get(`https://blockza.io/chart/graph.php?id=${directoryId}`);
          console.log("Fetched data:", response.data);

          if (response.data && Array.isArray(response.data) && response.data.length > 0) {
            setChartData(response.data);
            setIsDataAvailable(true);
          } else {
            setIsDataAvailable(false);
          }
        } catch (error) {
          console.error("Error fetching chart data:", error);
          setIsDataAvailable(false);
        }
      }
    };

    if (directoryId) fetchData();
  }, [pathname, directoryId]);

  if (!isDataAvailable) return null;

  const data = {
    labels: ['Organic', 'Sponsored', 'Press Release'],
    datasets: [
      {
        data: chartData,
        backgroundColor: ['#1a6eed', '#eaca08', '#d92424'],
        borderColor: ['#1a6eed', '#eaca08', '#d92424'],
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (tooltipItem) => {
            return `${tooltipItem.label}: ${tooltipItem.raw}%`;
          },
        },
      },
    },
  };

  return (
    <div>
      <div style={{ textAlign: 'center' }}>
        <h2 className="mb-4">Market Sentiment</h2>
        <h3>Media Coverage: 68 Platforms</h3>
      </div>

      {/* Custom Legend */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: '20px', height: '20px', backgroundColor: '#1a6eed', marginRight: '8px' }}></div>
          <span>Organic</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: '20px', height: '20px', backgroundColor: '#eaca08', marginRight: '8px' }}></div>
          <span>Sponsored</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: '20px', height: '20px', backgroundColor: '#d92424', marginRight: '8px' }}></div>
          <span>Press Release</span>
        </div>
      </div>

      <div className="row align-items-center justify-content-center">
        <div className="col-md-12" style={{ maxWidth: '300px' }}>
          <div style={{ position: 'relative', height: '300px' }}>
            <Pie data={data} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketSentimentChart;
