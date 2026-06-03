import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter, Route, Routes } from 'react-router';
import Layout from '@/layout';
import BusTiming from '@/busStopTiming';
import Favourites from '@/favourites';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<BusTiming />} />
          <Route path='favourites' element={<Favourites />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
