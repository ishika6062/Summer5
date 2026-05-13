import { useEffect, useMemo, useState } from "react";
import Layout from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";

const emptyForm = {
  name: "",
  slug: "",
  price: "",
  originalPrice: "",
  image: "",
  images: "",
  category: "",
  status: "active",
  color: "",
  colors: "",
  description: "",
};

const AdminProducts = () => {
  const { apiUrl, token, user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [formValues, setFormValues] = useState(emptyForm);
  const [filters, setFilters] = useState({
    q: "",
    category: "",
    status: "",
    sort: "createdAt",
    order: "desc",
  });

  const authHeaders = useMemo(
    () => ({ Authorization: `Bearer ${token}` }),
    [token]
  );

  const fetchProducts = async () => {
    setLoading(true);
    setError("");

    try {
      const url = new URL(`${apiUrl}/api/products`);
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          url.searchParams.set(key, value);
        }
      });

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to load products");
      }

      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user?.isAdmin) return;
    fetchProducts();
  }, [apiUrl, user?.isAdmin, filters]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetForm = () => {
    setFormValues(emptyForm);
    setEditingId(null);
  };

  const buildPayload = () => {
    const payload = {
      name: formValues.name.trim(),
      slug: formValues.slug.trim(),
      category: formValues.category.trim(),
      status: formValues.status,
      image: formValues.image.trim(),
      description: formValues.description.trim(),
    };

    const price = Number(formValues.price);
    if (!Number.isNaN(price)) {
      payload.price = price;
    }

    const originalPrice = Number(formValues.originalPrice);
    if (!Number.isNaN(originalPrice) && formValues.originalPrice !== "") {
      payload.originalPrice = originalPrice;
    }

    if (formValues.color.trim()) {
      payload.color = formValues.color.trim();
    }

    if (formValues.images.trim()) {
      payload.images = formValues.images
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean);
    }

    if (formValues.colors.trim()) {
      payload.colors = formValues.colors
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean);
    }

    return payload;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const payload = buildPayload();
      const endpoint = editingId
        ? `${apiUrl}/api/products/${editingId}`
        : `${apiUrl}/api/products`;
      const method = editingId ? "PATCH" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...authHeaders,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "Failed to save product");
      }

      resetForm();
      fetchProducts();
    } catch (err) {
      setError(err.message || "Failed to save product");
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setFormValues({
      name: product.name || "",
      slug: product.slug || "",
      price: product.price ?? "",
      originalPrice: product.originalPrice ?? "",
      image: product.image || "",
      images: (product.images || []).join(", "),
      category: product.category || "",
      status: product.status || "active",
      color: product.color || "",
      colors: (product.colors || []).join(", "),
      description: product.description || "",
    });
  };

  const handleDelete = async (product) => {
    const confirmed = window.confirm(
      `Delete ${product.name}? This cannot be undone.`
    );
    if (!confirmed) return;

    try {
      const response = await fetch(
        `${apiUrl}/api/products/${product._id}`,
        {
          method: "DELETE",
          headers: authHeaders,
        }
      );

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "Failed to delete product");
      }

      fetchProducts();
    } catch (err) {
      setError(err.message || "Failed to delete product");
    }
  };

  if (!user) {
    return (
      <Layout>
        <div className="px-6 lg:px-12 py-12">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-serif mb-6">Admin</h1>
            <p className="text-muted-foreground mb-4">
              Please sign in to access the admin dashboard.
            </p>
            <Button asChild>
              <Link to="/login">Sign in</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  if (!user.isAdmin) {
    return (
      <Layout>
        <div className="px-6 lg:px-12 py-12">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-serif mb-6">Admin</h1>
            <p className="text-muted-foreground">
              You do not have permission to view this page.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-6 lg:px-12 py-12">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="grid md:grid-cols-[1.1fr_1fr] gap-8 items-start">
            <div className="bg-secondary/60 p-8 md:p-10">
              <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
                Admin studio
              </p>
              <h1 className="text-4xl md:text-5xl font-serif mt-4">Admin products</h1>
              <p className="text-sm text-muted-foreground mt-4">
                Create, update, and manage product listings with full catalog control.
              </p>
              <div className="mt-8 space-y-3 text-sm text-muted-foreground">
                <p>- Keep your catalog tidy and on brand</p>
                <p>- Update pricing and inventory status</p>
                <p>- Curate the latest collection drops</p>
              </div>
            </div>
            <div className="border border-border bg-card p-8 md:p-10 rounded-2xl">
              <h2 className="text-2xl font-serif">Product form</h2>
              <p className="text-sm text-muted-foreground mt-2">
                {editingId ? "Update product details below." : "Add a new product to the catalog."}
              </p>
              <form onSubmit={handleSubmit} className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    name="name"
                    placeholder="Product name"
                    value={formValues.name}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    name="slug"
                    placeholder="Slug (unique)"
                    value={formValues.slug}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    name="price"
                    type="number"
                    step="0.01"
                    placeholder="Price"
                    value={formValues.price}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    name="originalPrice"
                    type="number"
                    step="0.01"
                    placeholder="Original price (optional)"
                    value={formValues.originalPrice}
                    onChange={handleChange}
                  />
                  <Input
                    name="image"
                    placeholder="Main image URL"
                    value={formValues.image}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    name="images"
                    placeholder="Additional image URLs (comma separated)"
                    value={formValues.images}
                    onChange={handleChange}
                  />
                  <Input
                    name="category"
                    placeholder="Category"
                    value={formValues.category}
                    onChange={handleChange}
                    required
                  />
                  <Select
                    value={formValues.status}
                    onValueChange={(value) =>
                      setFormValues((prev) => ({ ...prev, status: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="sale">Sale</SelectItem>
                      <SelectItem value="soldout">Sold out</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    name="color"
                    placeholder="Primary color (optional)"
                    value={formValues.color}
                    onChange={handleChange}
                  />
                  <Input
                    name="colors"
                    placeholder="Color options (comma separated)"
                    value={formValues.colors}
                    onChange={handleChange}
                  />
                </div>

                <Textarea
                  name="description"
                  placeholder="Description"
                  value={formValues.description}
                  onChange={handleChange}
                  rows={4}
                />

                <div className="flex flex-wrap gap-3">
                  <Button type="submit">
                    {editingId ? "Update product" : "Create product"}
                  </Button>
                  {editingId && (
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel edit
                    </Button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="border border-border bg-card rounded-2xl p-6 md:p-8 space-y-6">
            <div>
              <h2 className="text-2xl font-serif">Catalog filters</h2>
              <p className="text-sm text-muted-foreground mt-2">
                Refine the catalog list by category, status, or sorting rules.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input
                placeholder="Search by name or slug"
                value={filters.q}
                onChange={(event) =>
                  handleFilterChange("q", event.target.value)
                }
              />
              <Input
                placeholder="Filter by category"
                value={filters.category}
                onChange={(event) =>
                  handleFilterChange("category", event.target.value)
                }
              />
              <Select
                value={filters.status || "all"}
                onValueChange={(value) =>
                  handleFilterChange("status", value === "all" ? "" : value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="sale">Sale</SelectItem>
                  <SelectItem value="soldout">Sold out</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={`${filters.sort}:${filters.order}`}
                onValueChange={(value) => {
                  const [sort, order] = value.split(":");
                  handleFilterChange("sort", sort);
                  handleFilterChange("order", order);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt:desc">Newest</SelectItem>
                  <SelectItem value="createdAt:asc">Oldest</SelectItem>
                  <SelectItem value="name:asc">Name A-Z</SelectItem>
                  <SelectItem value="name:desc">Name Z-A</SelectItem>
                  <SelectItem value="price:asc">Price low-high</SelectItem>
                  <SelectItem value="price:desc">Price high-low</SelectItem>
                  <SelectItem value="status:asc">Status A-Z</SelectItem>
                  <SelectItem value="status:desc">Status Z-A</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {loading ? (
              <p className="text-sm text-muted-foreground">
                Loading products...
              </p>
            ) : products.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No products found.
              </p>
            ) : (
              <div className="space-y-4">
                {products.map((product) => (
                  <div
                    key={product._id}
                    className="flex flex-col gap-4 border border-border rounded-xl p-4 md:flex-row md:items-center md:justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-16 w-16 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {product.category} • {product.status} • ${product.price}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        onClick={() => handleEdit(product)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleDelete(product)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminProducts;
