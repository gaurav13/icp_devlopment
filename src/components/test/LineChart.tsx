"use client";

import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartOptions } from 'chart.js';
import axios from 'axios';
import { usePathname } from 'next/navigation';

ChartJS.register(ArcElement, Tooltip, Legend);

const MarketSentimentChart = () => {
  const [chartData, setChartData] = useState<number[]>([]);
  const [mediaCoverage, setMediaCoverage] = useState<string | null>(null);
  const [isDataAvailable, setIsDataAvailable] = useState<boolean>(false);
  const [directoryId, setDirectoryId] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const pathname = window.location.pathname;
       console.log("Initial pathname:", pathname);
     
       const pathSegments = pathname.split('/').filter(segment => segment);
       const id = pathSegments[pathSegments.length - 1] || null;
     
       console.log("Extracted directoryId from URL:", id);
       setDirectoryId(id); 
      { /*const params = new URLSearchParams(window.location.search);
       const id = params.get('directoryId');
       setDirectoryId(id);*/}
     }

    const fetchData = async () => {
      if (directoryId) {
        try {
          const response = await axios.get(`https://blockza.io/chart/graph.php?id=${directoryId}`);
          console.log("Fetched data:", response.data);

          if (response.data && response.data.directory_graph_data && response.data.media_coverage) {
            // Update chart data and media coverage
           // Assuming `value` should be a number
          setChartData(response.data.directory_graph_data.map((value: number) => Number(value)));
          // Convert to numbers
            setMediaCoverage(response.data.media_coverage);

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
  if (!isDataAvailable || chartData.length === 0) {
    return ;
  }
  return (
    <div className='shadow-txt-pnl'>
      <div style={{ textAlign: 'center' }}>
        <h2 className="mb-1">Media Exposure Summary</h2>
        <p style={{ marginBottom: '0px' }}>Media Coverage: {mediaCoverage} Platforms</p>
      </div>

      {/* Custom Legend */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', fontSize: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ 
            width: '20px', 
            height: '20px', 
            backgroundColor: '#1a6eed', 
            marginRight: '8px', 
            borderRadius: '50%',
            border: '1px solid black'
          }}></div>
          <strong>Organic</strong>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ 
            width: '20px', 
            height: '20px', 
            backgroundColor: '#eaca08', 
            marginRight: '8px', 
            borderRadius: '50%',
            border: '1px solid black'
          }}></div>
          <strong>Sponsored</strong>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ 
            width: '20px', 
            height: '20px', 
            backgroundColor: '#d92424', 
            marginRight: '8px', 
            borderRadius: '50%',
            border: '1px solid black'
          }}></div>
          <strong>Press Release</strong>
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
