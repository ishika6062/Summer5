import { Link } from "react-router-dom";
import { Instagram, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="bg-footer text-footer-foreground">
      {/* Main Footer */}
      <div className="px-6 lg:px-12 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Brand */}
            <div className="space-y-4">
              <h3 className="font-serif text-2xl tracking-[0.2em]">SUMMER5</h3>
              <p className="text-sm text-footer-foreground/70">
                Curated home essentials designed for calm, clean living. Small
                batches, quality materials, and everyday comfort.
              </p>
              <div className="text-sm text-footer-foreground/70">
                <p>Support: hello@summer5.com</p>
                <p>Mon - Fri, 9am - 6pm</p>
              </div>
            </div>

            {/* Shop Links */}
            <div>
              <h3 className="font-serif text-xl mb-6">Shop</h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/shop" className="hover:underline text-sm">
                    Shop all
                  </Link>
                </li>
                <li>
                  <Link to="/category/kitchen" className="hover:underline text-sm">
                    Kitchen
                  </Link>
                </li>
                <li>
                  <Link to="/category/bathroom" className="hover:underline text-sm">
                    Bathroom
                  </Link>
                </li>
                <li>
                  <Link to="/category/living-room" className="hover:underline text-sm">
                    Living room
                  </Link>
                </li>
                <li>
                  <Link to="/category/outdoor" className="hover:underline text-sm">
                    Outdoor
                  </Link>
                </li>
              </ul>
            </div>

            {/* Help Links */}
            <div>
              <h3 className="font-serif text-xl mb-6">Help</h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/contact" className="hover:underline text-sm">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link to="/account" className="hover:underline text-sm">
                    My account
                  </Link>
                </li>
                <li>
                  <Link to="/cart" className="hover:underline text-sm">
                    Cart
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="hover:underline text-sm">
                    Sign in
                  </Link>
                </li>
                <li>
                  <Link to="/signup" className="hover:underline text-sm">
                    Create account
                  </Link>
                </li>
              </ul>
            </div>

            {/* Subscribe Section */}
            <div>
              <h3 className="font-serif text-xl mb-6">Subscribe</h3>
              <p className="text-sm text-footer-foreground/70 mb-4">
                Get product drops, restocks, and early access.
              </p>
              <div className="flex mb-6">
                <Input
                  type="email"
                  placeholder="Email"
                  className="bg-transparent border-footer-foreground/30 text-footer-foreground placeholder:text-footer-foreground/50 rounded-none focus-visible:ring-0 focus-visible:border-footer-foreground"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="border border-l-0 border-footer-foreground/30 rounded-none hover:bg-footer-foreground/10"
                >
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href="https://instagram.com/ishika_6062"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-70 transition-opacity"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <span className="text-sm text-footer-foreground/70">
                  Follow us
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-footer-foreground/20 px-6 lg:px-12 py-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-center items-center gap-4">
          <span className="text-xs text-footer-foreground/70">
            © 2026 SUMMER5. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
