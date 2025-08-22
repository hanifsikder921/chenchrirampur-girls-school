import { createContext, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxios from '../hooks/useAxios';

const SchoolInfoContext = createContext(null);

export const SchoolInfoProvider = ({ children }) => {
  const axios = useAxios();

  const {
    data: info,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['schoolInfo'],
    queryFn: async () => {
      const response = await axios.get('/info');
      return response.data; 
    },
  });

  const schoolInfo = info && info.length > 0 ? info[0] : null;

  return (
    <SchoolInfoContext.Provider value={{ schoolInfo, isLoading, isError }}>
      {children}
    </SchoolInfoContext.Provider>
  );
};

// Custom hook
export const useSchoolInfo = () => useContext(SchoolInfoContext);
