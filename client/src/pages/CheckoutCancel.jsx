import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";

const CheckoutCancel = () => {
  return (
    <Layout>
      <div className="px-6 lg:px-12 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground mb-4">
            Payment canceled
          </p>
          <h1 className="text-4xl md:text-5xl font-serif mb-6">
            Checkout was canceled.
          </h1>
          <p className="text-sm text-muted-foreground mb-10">
            Your card was not charged. You can return to your cart anytime.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button asChild className="px-8 py-5">
              <Link to="/cart">Back to cart</Link>
            </Button>
            <Button variant="outline" asChild className="px-8 py-5">
              <Link to="/shop">Browse products</Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutCancel;
