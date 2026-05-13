import { Link, useSearchParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useEffect, useState } from "react";

const CheckoutSuccess = () => {
  const { apiUrl, token } = useAuth();
  const { clearCart } = useCart();
  const [searchParams] = useSearchParams();
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (!sessionId || !token) return;

    const confirmOrder = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/checkout/confirm`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ sessionId }),
        });

        if (!response.ok) {
          throw new Error("Unable to confirm payment")
        }

        setStatusMessage("Your order has been confirmed.");
        clearCart();
      } catch (error) {
        setStatusMessage("We could not confirm your payment yet.");
      }
    };

    confirmOrder();
  }, [apiUrl, searchParams, token]);

  return (
    <Layout>
      <div className="px-6 lg:px-12 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground mb-4">
            Payment successful
          </p>
          <h1 className="text-4xl md:text-5xl font-serif mb-6">
            Thank you for your order.
          </h1>
          <p className="text-sm text-muted-foreground mb-10">
            We have received your payment and will start processing your order.
          </p>
          {statusMessage ? (
            <p className="text-sm text-muted-foreground mb-8">
              {statusMessage}
            </p>
          ) : null}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button asChild className="px-8 py-5">
              <Link to="/shop">Continue shopping</Link>
            </Button>
            <Button variant="outline" asChild className="px-8 py-5">
              <Link to="/account">View account</Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutSuccess;
