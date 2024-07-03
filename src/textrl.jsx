import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

Chart.register( Bar );

const BolsaValor2 = () => {
    const [stock, setStock] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            const apiKey = '23W7J18P7W5XNC87'; 
            const symbol = '^GSPC'; 
            const apiUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`;



            try {
                const response = await axios.get(apiUrl);
                const daily = response.data['Time Series (Daily)'];


                const labels = Object.keys(daily).slice(0,10);
                const data = labels.map(date => daily[date]['4. close']);


                setStock({
                    labels: labels.reverse(),
                    datasets: [{
                        label: 'Precio de cierre (USD)',
                        data: data.reverse(),
                        backgroundColor: 'rgba(54, 162, 235, 0.6)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1,
                    },
                        
                    ],
                })
            } catch (error) {
                console.error("Error al atrapar el dato", error)
            }
        }
        fetchData();
    }, [])


    const options = {
         maintainAspectRatio: false,
         scales: {
            x: {
                ticks: { 
                    maxTicksLimit: 10,
                    maxRotation: 45,  
                    minRotation: 45,          

                },
            },
            y: {
                beginAtZero: true
            }
    },
    plugins: {
        legend: {
            labels: {
                font:{
                    size:16
                }
            }
        }
    }


    }        
    return (
        <div className="stock-chart">
          <h2>Gráfico de Precio de Cierre Diario</h2>
          <div className="chart">
            <Bar data={stock}options={options}/>
          </div>
        </div>
      );
}

export default BolsaValor2;





import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';

const BolsaValor3 = () => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [{
            label: 'Precio de cierre (USD)',
            data: [],
            fill: false,
            borderColor: 'rgba(75,192,192,1)',
            tension: 0.1
        }]
    });

    useEffect(() => {
        const fetchStockData = async () => {
            const API_KEY = 'tu_api_key_de_alpha_vantage'; // Reemplazar con tu propia API key
            const symbol = 'AAPL'; // Ejemplo: Apple
            const API_URL = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${API_KEY}`;

            try {
                const response = await fetch(API_URL);
                const data = await response.json();

                // Procesar los datos para el gráfico de Chart.js
                const dates = Object.keys(data['Time Series (Daily)']).reverse().slice(0, 10); // Últimos 10 días
                const prices = dates.map(date => parseFloat(data['Time Series (Daily)'][date]['4. close']));

                // Actualizar el estado con los datos procesados
                setChartData({
                    labels: dates,
                    datasets: [{
                        ...chartData.datasets[0], // Mantener las propiedades actuales del dataset
                        data: prices,
                    }]
                });
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchStockData();
    }, []); // Se ejecuta una vez al montar el componente

    const options = {
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true
            }
        },
        plugins: {
            legend: {
                labels: {
                    fontSize: 26
                }
            }
        }
    };

    return (
        <div>
            <h2>Gráfico de Precio de Cierre</h2>
            <div style={{ height: '400px', width: '600px' }}>
                <Line data={chartData} options={options} />
            </div>
        </div>
    );
};

export default BolsaValor3;











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

const BolsaValorTrue = () => {
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
            const apiKey = 'DX8XTQ9O313ZHX4Z'; 
            const symbols = ['MXX', 'SPX', 'DJI'];

            const requests = symbols.map(symbol =>
                axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`)
              ); 

              try {
                const responses = await Promise.all(requests);
                const data = responses.map(response => response.data['Time Series (Daily)']);

                if (data.some(d => !d)) {
                    throw new Error('No se recibieron datos válidos de la API');
                  }

                  const labels = Object.keys(data[0].slice(0,10).reverse());
                  const prices = data.map(dataset => 
                    labels.map(date => parseFloat(dataset[date]['4. close']))
                  )


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

export default BolsaValorTrue;