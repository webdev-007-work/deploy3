import React from "react";
import { Link } from "react-router-dom";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import { getCategories } from "@/services/supabaseService";
import { Category } from "@/types/blog";

export function Footer() {
  const { settings } = useSiteSettings();
  const [categories, setCategories] = React.useState<Category[]>([]);

  React.useEffect(() => {
    getCategories().then((cats) => setCategories(cats.slice(0, 6)));
  }, []);

  const brandName = settings?.brand_name || "OnAssist";
  const brandEmail = settings?.brand_email || "support@onassist.com";
  const brandPhone = settings?.brand_phone || "+1 (888) 970-1698";

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">{brandName}</h3>
            <p className="text-gray-400 mb-4 max-w-md">
              Discover amazing content powered by AI. Our platform combines
              human creativity with artificial intelligence to deliver engaging
              and informative articles.
            </p>

            {/* Contact Information */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-gray-400">Email:</span>
                <a
                  href={`mailto:${brandEmail}`}
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  {brandEmail}
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-400">Phone:</span>
                <a
                  href={`tel:${brandPhone}`}
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  {brandPhone}
                </a>
              </div>
            </div>

            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Twitter
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Facebook
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                LinkedIn
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  to="/disclaimer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Disclaimer
                </Link>
              </li>
              <li>
                <Link
                  to="/smart-drivers"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Smart Drivers
                </Link>
              </li>
              <li>
                <Link
                  to="/com-mytv"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Com-MyTV Activation
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Categories</h4>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    to={`/category/${category.slug}`}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>
            &copy; 2025 {brandName}. All rights reserved. Powered by AI
            innovation.
          </p>
        </div>
      </div>
    </footer>
  );
}
