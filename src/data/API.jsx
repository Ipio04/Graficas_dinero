import axios from 'axios';

const API_KEY = '23W7J18P7W5XNC87';
const BASE_URL = 'https://www.alphavantage.co/query';

export const fetchExchangeRateData = async () => {
  const url = `${BASE_URL}?function=FX_DAILY&from_symbol=USD&to_symbol=MXN&apikey=${API_KEY}`;

  try {
    const response = await axios.get(url);
    const data = response.data['Time Series FX (Daily)'];
    return data;
  } catch (error) {
    console.error('Error fetching the exchange rate data', error);
    throw error;
  }
};