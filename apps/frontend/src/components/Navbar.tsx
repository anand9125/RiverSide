
import { useState } from "react";
import { Button } from "./Button";
import { Headphones } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <div className="flex items-center">
            <Headphones className="h-8 w-8 text-riverside-600" />
            <span className="ml-2 text-xl font-bold text-riverside-900">Riverside</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-sm font-medium text-gray-700 hover:text-riverside-600 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-sm font-medium text-gray-700 hover:text-riverside-600 transition-colors">
              How It Works
            </a>
            <a href="#testimonials" className="text-sm font-medium text-gray-700 hover:text-riverside-600 transition-colors">
              Testimonials
            </a>
            <a href="#pricing" className="text-sm font-medium text-gray-700 hover:text-riverside-600 transition-colors">
              Pricing
            </a>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Button variant="outline" className="text-riverside-600 border-riverside-600 hover:bg-riverside-50">
              Log in
            </Button>
            <Button className="bg-riverside-600 hover:bg-riverside-700 text-white">
              Start Recording
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-600 focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              )}
            </svg>
          </button>
        </nav>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <a
              href="#features"
              className="block text-sm font-medium text-gray-700 hover:text-riverside-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="block text-sm font-medium text-gray-700 hover:text-riverside-600"
              onClick={() => setIsMenuOpen(false)}
            >
              How It Works
            </a>
            <a
              href="#testimonials"
              className="block text-sm font-medium text-gray-700 hover:text-riverside-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Testimonials
            </a>
            <a
              href="#pricing"
              className="block text-sm font-medium text-gray-700 hover:text-riverside-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </a>
            <div className="pt-4 flex flex-col space-y-2">
              <Button variant="outline" className="text-riverside-600 border-riverside-600">
                Log in
              </Button>
              <Button className="bg-riverside-600 hover:bg-riverside-700 text-white">
                Start Recording
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
