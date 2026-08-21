import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
import MobileBottomNav from './MobileBottomNav.jsx';

export default function Layout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
      <MobileBottomNav />
    </>
  );
}
