import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart } from 'chart.js/auto';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js/auto';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const BolsaMex = () => {
  const [chartData, setChartData] = useState({
    labels: ['Último Precio'],
    datasets: [
      {
        label: 'BMV',
        data: [],
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: false,
      },
      {
        label: 'S&P 500',
        data: [],
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: false,
      }
    ]
  });

  useEffect(() => {
    const fetchData = async () => {
      const apiKey = 'cpmhuepr01quf6213rngcpmhuepr01quf6213ro0'; 
      const symbolBMV = 'MEXBOL';
      const symbolUS = 'SPX'; 

      const apiUrlBMV = `https://finnhub.io/api/v1/quote?symbol=${symbolBMV}&token=${apiKey}`;
      const apiUrlUS = `https://finnhub.io/api/v1/quote?symbol=${symbolUS}&token=${apiKey}`;

      try {
        const [responseBMV, responseUS] = await Promise.all([
          fetch(apiUrlBMV),
          fetch(apiUrlUS)
        ]);

        const dataBMV = await responseBMV.json();
        const dataUS = await responseUS.json();

        if (!dataBMV || !dataUS || dataBMV.error || dataUS.error) {
          throw new Error('No se recibieron datos válidos de la API de Finnhub');
        }

        const pricesBMV = [dataBMV.c];
        const pricesUS = [dataUS.c];

        setChartData({
          labels: ['Último Precio'],
          datasets: [
            {
              label: 'BMV',
              data: pricesBMV,
              borderColor: 'rgba(255, 99, 132, 1)',
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              fill: false,
            },
            {
              label: 'S&P 500',
              data: pricesUS,
              borderColor: 'rgba(54, 162, 235, 1)',
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              fill: false,
            }
          ]
        });
      } catch (error) {
        console.error('Error fetching data from Finnhub:', error);
      }
    };

    fetchData();
  }, []);

  const options = {
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true
      }
    },
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `$${tooltipItem.raw}`;
          }
        }
      }
    }
  };

  return (
    <div>
      <h2>Comparativa de la Bolsa Mexicana de Valores y el S&P 500</h2>
      <div style={{ height: '400px', width: '600px' }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default BolsaMex;