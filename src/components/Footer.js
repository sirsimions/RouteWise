const Footer = () => {
    return (
      <footer className="fixed bottom-0 left-0 w-full bg-white text-gray-500 border-t py-3 px-6 text-sm z-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
          <p>&copy; {new Date().getFullYear()} All rights reserved.</p>
          <div className="space-x-4">
            <a href="/privacy" className="hover:underline">Privacy</a>
            <a href="/terms" className="hover:underline">Terms</a>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  