import Navbar from './Navbar';

function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="bg-gray-800 text-white text-center p-4">
        <p>&copy; 2024 Data Analyzer. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Layout;