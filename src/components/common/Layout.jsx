import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

/**
 * Layout principal de la SPA
 * Renderiza el Navbar fijo superior, el contenedor <main> expandible y el Footer al final.
 */
export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-velvet-900 text-slate-100 selection:bg-velvet-gold selection:text-velvet-900">
      <Navbar />
      <main className="flex-grow pt-20">
        {children || <Outlet />}
      </main>
      <Footer />
    </div>
  );
}
