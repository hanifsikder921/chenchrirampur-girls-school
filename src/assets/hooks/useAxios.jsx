import axios from 'axios';

const axiosInstance = axios.create({
//   baseURL: `https://food-cycle-server-blond.vercel.app`,
  baseURL: `http://localhost:5000`
});

const useAxios = () => {
  return axiosInstance;
};

export default useAxios;
