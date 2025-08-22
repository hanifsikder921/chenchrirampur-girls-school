import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

import { RouterProvider } from 'react-router';
import router from './routes/router.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AuthProvider from './assets/context/AuthProvider';
import { SchoolInfoProvider } from './assets/context/SchoolInfoProvider.jsx';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SchoolInfoProvider>
          <RouterProvider router={router}></RouterProvider>
        </SchoolInfoProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
