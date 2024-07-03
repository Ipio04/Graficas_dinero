import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart } from 'chart.js/auto';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js/auto';
import axios from 'axios';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

const BolsaValor = () => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [ {
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
          },
          {
            label: 'Dow Jones',
            data: [],
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: false,
          }]
    });

    useEffect(() => {
        const fetchData = async () => {
            const apiKey = 'cpmhuepr01quf6213rngcpmhuepr01quf6213ro0'; 
            const symbols = ['MXX', 'SPX', 'DJI'];

            const requests = symbols.map(symbol =>
                axios.get(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`)
              ); 

              try {
                const responses = await Promise.all(requests);
                const data = responses.map(response => response.data);

                if (data.some(d => !d)) {
                    throw new Error('No se recibieron datos válidos de la API');
                  }

                  const labels = symbols;
                  const prices = data.map(item => item.c);
                  


                  setChartData({
                    labels: labels,
                    datasets: [
                        {
                            label: 'BMV',
                            data: prices[0],
                            borderColor: 'rgba(255, 99, 132, 1)',
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            fill: false,
                          },
                          {
                            label: 'S&P 500',
                            data: prices[1],
                            borderColor: 'rgba(54, 162, 235, 1)',
                            backgroundColor: 'rgba(54, 162, 235, 0.2)',
                            fill: false,
                          },
                          {
                            label: 'Dow Jones',
                            data: prices[2],
                            borderColor: 'rgba(75, 192, 192, 1)',
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            fill: false,
                          }
                    ]
                  })

              } catch(error) {
                console.error('Error atrapado: ', error)
              }
            
            } 
            fetchData();
        },[])

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
        }

        return (
            <div>
                <h2> Indicadores mas importantes de la bolsa de valores</h2>
                <div style={{height: '400px', width: '600px'}}>
                    <Line data={chartData} options={options} />
                </div>
            </div>
        )


};

export default BolsaValor;