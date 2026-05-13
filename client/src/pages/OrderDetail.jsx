import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const OrderDetail = () => {
  const { id } = useParams();
  const { apiUrl, token } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id || !token) return;

      setLoading(true);
      setError("");

      try {
        const response = await fetch(`${apiUrl}/api/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to load order");
        }

        const data = await response.json();
        setOrder(data.order || null);
      } catch (err) {
        setError(err.message || "Failed to load order");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [apiUrl, id, token]);

  const formatPrice = (price) => `$${price.toFixed(2)} USD`;

  return (
    <Layout>
      <div className="px-6 lg:px-12 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
                Order details
              </p>
              <h1 className="text-3xl md:text-4xl font-serif mt-3">
                Order {id?.slice(-6)}
              </h1>
            </div>
            <Button asChild variant="outline" className="px-6 py-5">
              <Link to="/account">Back to account</Link>
            </Button>
          </div>

          {!token ? (
            <div className="border border-border rounded-2xl p-8">
              <p className="text-muted-foreground">
                Please sign in to view this order.
              </p>
              <div className="mt-4 flex gap-3">
                <Button asChild className="px-6 py-5">
                  <Link to="/login">Sign in</Link>
                </Button>
              </div>
            </div>
          ) : loading ? (
            <p className="text-sm text-muted-foreground">Loading order...</p>
          ) : error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : !order ? (
            <p className="text-sm text-muted-foreground">Order not found.</p>
          ) : (
            <div className="space-y-8">
              <div className="border border-border rounded-2xl p-6 flex flex-wrap gap-6 justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                    Date
                  </p>
                  <p className="text-sm mt-2">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                    Status
                  </p>
                  <p className="text-sm mt-2 capitalize">{order.status}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                    Total
                  </p>
                  <p className="text-sm mt-2 font-medium">
                    {formatPrice(order.totalAmount)}
                  </p>
                </div>
              </div>

              <div className="border border-border rounded-2xl p-6">
                <h2 className="text-2xl font-serif mb-6">Items</h2>
                <div className="space-y-5">
                  {order.items.map((item, index) => (
                    <div
                      key={`${item.product}-${index}`}
                      className="flex flex-wrap gap-4 items-center justify-between border-b border-border pb-5"
                    >
                      <div className="flex gap-4 items-center">
                        <Link
                          to={`/product/${item.slug}`}
                          className="h-20 w-20 bg-card"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        </Link>
                        <div>
                          <Link
                            to={`/product/${item.slug}`}
                            className="text-sm hover:underline"
                          >
                            {item.name}
                          </Link>
                          <p className="text-xs text-muted-foreground mt-2">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <div className="text-sm font-medium">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default OrderDetail;