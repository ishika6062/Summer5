import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ProductCard from "@/components/ProductCard";
import { ChevronDown, Search } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ShopAll = () => {
  const { apiUrl } = useAuth();
  const [sortBy, setSortBy] = useState("alphabetically-asc");
  const [availability, setAvailability] = useState("all");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const query = (searchParams.get("q") || "").trim();
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError("");

      try {
        const url = new URL(`${apiUrl}/api/products`);
        if (query) {
          url.searchParams.set("q", query);
        }
        const response = await fetch(url);
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
  }, [apiUrl, query]);

  const availabilityFiltered = products.filter((product) => {
    const status = (product.status || "").toLowerCase();
    if (availability === "all") {
      return true;
    }
    if (availability === "in-stock") {
      return status !== "soldout";
    }
    if (availability === "sold-out") {
      return status === "soldout";
    }
    return true;
  });

  const sortedProducts = [...availabilityFiltered].sort((a, b) => {
    switch (sortBy) {
      case "alphabetically-asc":
        return a.name.localeCompare(b.name);
      case "alphabetically-desc":
        return b.name.localeCompare(a.name);
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      default:
        return 0;
    }
  });

  const productCount = useMemo(
    () => sortedProducts.length,
    [sortedProducts]
  );
  const totalCount = products.length;

  const syncSearchParams = (nextValue) => {
    const nextQuery = nextValue.trim();
    const nextParams = new URLSearchParams(searchParams);
    if (nextQuery) {
      nextParams.set("q", nextQuery);
    } else {
      nextParams.delete("q");
    }
    setSearchParams(nextParams);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    syncSearchParams(searchInput);
  };

  return (
    <Layout>
      <div className="px-6 lg:px-12 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Page Title */}
          <h1 className="text-4xl md:text-5xl font-serif mb-12">Products</h1>

          {/* Filters and Sort */}
          <div className="flex flex-col gap-4 mb-8 lg:flex-row lg:items-center lg:justify-between">
            {/* Filters */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:flex-wrap">
              <span className="text-sm">Filter:</span>
              <Select value={availability} onValueChange={setAvailability}>
                <SelectTrigger className="w-full sm:w-[160px] border-0 focus:ring-0">
                  <SelectValue placeholder="Availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="in-stock">In stock</SelectItem>
                  <SelectItem value="sold-out">Sold out</SelectItem>
                </SelectContent>
              </Select>
              <form
                className="flex w-full items-center gap-2 sm:w-auto"
                onSubmit={handleSearchSubmit}
              >
                <label className="sr-only" htmlFor="shop-search">
                  Search products
                </label>
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="shop-search"
                    value={searchInput}
                    onChange={(event) => {
                      const nextValue = event.target.value;
                      setSearchInput(nextValue);
                      syncSearchParams(nextValue);
                    }}
                    placeholder="Search products..."
                    className="w-full rounded-md border pl-9 pr-3 py-2 text-sm sm:w-56"
                  />
                </div>
              </form>
            </div>

            {/* Sort */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:flex-wrap">
              <span className="text-sm">Sort by:</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-[180px] border-0 focus:ring-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="alphabetically-asc">Sort A - Z</SelectItem>
                    <SelectItem value="alphabetically-desc">Sort Z - A</SelectItem>
                    <SelectItem value="price-asc">Price ↑</SelectItem>
                    <SelectItem value="price-desc">Price ↓</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-muted-foreground">
                {productCount} of {totalCount} products
              </span>
            </div>
          </div>

          {/* Product Grid */}
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading products...</p>
          ) : error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : sortedProducts.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {query ? `No products found for "${query}".` : "No products found."}
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ShopAll;