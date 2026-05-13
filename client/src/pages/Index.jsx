import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import { HeroSection, DiscoverSection, CategorySection } from "@/components/home/HomeSections";
import ProductCard from "@/components/ProductCard";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const { apiUrl } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(`${apiUrl}/api/products`);
        if (!response.ok) {
          throw new Error("Failed to load products");
        }
        const data = await response.json();
        const normalized = data.map((product) => ({
          ...product,
          id: product.id || product._id,
        }));
        setProducts(normalized);
      } catch (err) {
        setError(err.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [apiUrl]);

  return (
    <Layout>
      <HeroSection />
      <DiscoverSection />
      <CategorySection />
      
      {/* Featured Products */}
      <section className="py-16 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between flex-wrap gap-6 mb-10">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
                Featured
              </p>
              <h2 className="text-3xl md:text-4xl font-serif mt-3">
                Featured essentials for right now.
              </h2>
            </div>
          </div>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading products...</p>
          ) : error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : (
            <div className="relative overflow-hidden">
              <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent pointer-events-none" />
              <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent pointer-events-none" />
              <div className="flex marquee-track">
                {[...products, ...products].map((product, index) => (
                  <div key={`${product.id}-${index}`} className="mx-3 w-[240px] shrink-0">
                    <ProductCard product={product} showMeta={false} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Index;