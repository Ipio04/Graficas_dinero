import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, LinearScale, LineElement, PointElement, CategoryScale, plugins } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { fetchExchangeRateData } from '../data/API';


ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement);

const Pesodolar = () => {
    const [chartData, setChartData] = useState(null);
    const [loading, setloading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getData = async () => {
            try {
                const data = await fetchExchangeRateData();
                const labels = Object.keys(data).reverse();
                const values = Object.values(data).map(item => item['4. close']).reverse();

                setChartData({
                    labels, 
                    datasets: [
                        {
                            label: 'Paridad peso MXN/ Dolar',
                            data: values,
                            fill: false,
                            backgroundColor: 'rgba(75,192,192,0.6)',
                            borderColor: 'rgba(75,192,192,1)',
                        },
                    ],
                })
                setloading(false);
            } catch (error) {
                setError('No disponible');
                setloading(false);
            }
        };
        getData();
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
                beginAtZero: true,
              },    
        },
        plugins: {
            legend: {
                labels:{
                    fontSize: 16,
                },
            },
        },
    };
    if (loading) {
        return <div className="loading">Loading...</div>;
      }
    
      if (error) {
        return <div className="error">{error}</div>;
      }

      return(
        <div className='chart-container'>
            <h2 className='chart-title'>Paridad peso MXN/ Dolar</h2>
            {chartData ? ( <Line data={chartData} height={400} options={options} />) : (<div>No data available</div>)}
        </div>
      );
};

export default Pesodolar;