import React from 'react';
import Navbar from './Navbar';

// Layout wraps every page with Navbar and Footer
const Layout = ({ children }) => (
  <>
    <Navbar />
    <main>{children}</main>
    <footer className="footer">
      <p>© 2025 <span>FoodHub</span> — Made with ❤️ using MERN Stack</p>
    </footer>
  </>
);

export default Layout;
