import Header from "./Header";
import Footer from "./Footer";
import { useCart } from "@/context/CartContext";

const Layout = ({ children }) => {
  const { totalItems } = useCart();
  return (
    <div className="min-h-screen flex flex-col">
      <Header cartCount={totalItems} />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
