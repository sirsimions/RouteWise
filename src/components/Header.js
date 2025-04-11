const Header = () => {
    return (
      <header className="fixed top-0 left-0 w-full z-50 bg-white shadow px-6 py-4 flex justify-between items-center">
        
        {/* Logo on the left with reduced font size */}
        <h1 className="text-xl md:text-2xl font-bold text-blue-800 tracking-wide">
          SirSimions <span className="text-orange-500">RouteWise</span>
        </h1>
  
        {/* Navigation links aligned to the right */}
        <nav className="space-x-6 text-sm font-medium text-gray-700">
          <a href="/" className="hover:text-blue-600"></a>
          <a href="/routes" className="hover:text-blue-600"></a>
          <a href="/about" className="hover:text-blue-600"></a>
          <a href="/contact" className="hover:text-blue-600"></a>
        </nav>
      </header>
    );
  };
  
  export default Header;
  