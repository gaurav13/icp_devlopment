"use client";

import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartOptions, TooltipItem, Chart } from 'chart.js';
import axios from 'axios';
import { usePathname } from 'next/navigation';

ChartJS.register(ArcElement, Tooltip, Legend);

const customLabelPlugin = {
  id: 'customLabelPlugin',
  beforeDraw: (chart: Chart) => {
    const { width, height, ctx } = chart;
    ctx.restore();
    const fontSize = '16px';
    ctx.font = `${fontSize} sans-serif`;
    ctx.textBaseline = "middle";
    ctx.textAlign = 'center';

    const labels = ['Positive', 'Neutral', 'Negative'];
    const chartData = chart.data.datasets[0].data as number[];
    const colors = ['rgba(0, 200, 150, 1)', 'rgba(255, 165, 0, 1)', 'rgba(255, 99, 132, 1)'];

    labels.forEach((label, i) => {
      ctx.fillStyle = colors[i];
      ctx.fillText(
        `${label} ${chartData[i]}%`,
        width / 2,  // Center align horizontally
        height / 2 - 30 + i * 20 // Center align vertically with adjusted spacing
      );
    });
    ctx.save();
  }
};


ChartJS.register(customLabelPlugin);

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

  // Return null if there is no data available to render
  if (!isDataAvailable) return null;

  const data = {
    labels: ['Positive', 'Neutral', 'Negative'],
    datasets: [
      {
        data: chartData,
        backgroundColor: [
          '#1a6eed',
          '#eaca08',
          '#d92424',
        ],
        borderColor: [
          'rgba(0, 200, 150, 1)',
          'rgba(255, 165, 0, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 2,
        cutout: '70%',
      },
    ],
  };

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (tooltipItem: TooltipItem<'doughnut'>) => {
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
      <div className="row align-items-center justify-content-center">
        <div className="col-md-6" style={{ maxWidth: '300px' }}>
          <div style={{ position: 'relative', height: '300px' }}>
            <Doughnut data={data} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketSentimentChart;
