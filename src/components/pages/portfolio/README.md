/**
 * Portfolio View Page - Integration Example
 * 
 * This file shows how to integrate PortfolioViewPage into your React Router setup
 */

import React from 'react';
import PortfolioViewPage from '@/components/pages/portfolio/PortfolioViewPage';

/**
 * Usage in React Router (in your App.tsx or routing configuration):
 * 
 * import { BrowserRouter, Routes, Route } from 'react-router-dom';
 * 
 * <Routes>
 *   <Route path="/portfolio/:id" element={<PortfolioViewPage />} />
 * </Routes>
 * 
 * Then navigate to: /portfolio/1
 */

// Export as default for direct import
export default PortfolioViewPage;

/**
 * Alternative: If using a data loader pattern (React Router v6.4+)
 * 
 * import { portfolioService, mockPortfolio } from '@/services/portfolio.api';
 * 
 * export const portfolioLoader = async ({ params }) => {
 *   const { id } = params;
 *   try {
 *     const portfolio = await portfolioService.getPortfolio(parseInt(id, 10));
 *     return portfolio;
 *   } catch (error) {
 *     throw new Error(`Portfolio ${id} not found`);
 *   }
 * };
 * 
 * // In route config:
 * {
 *   path: '/portfolio/:id',
 *   element: <PortfolioViewPage />,
 *   loader: portfolioLoader
 * }
 */
