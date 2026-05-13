import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import { Minus, Plus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";


const ProductDetail = () => {
  const { slug } = useParams();
  const { apiUrl, token } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const { items, addToCart, updateQuantity } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    if (!slug) return;

    const fetchProduct = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(`${apiUrl}/api/products/${slug}`);
        if (!response.ok) {
          throw new Error("Product not found");
        }
        const data = await response.json();
        setProduct({ ...data, id: data.id || data._id });
      } catch (err) {
        setError(err.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [apiUrl, slug]);

  const cartItem = product
    ? items.find((item) => item.product.id === product.id)
    : null;
  const inCartQuantity = cartItem?.quantity || 0;

  const handleAddToCart = () => {
    if (!product || product.status === "soldout") {
      return;
    }

    addToCart(product, 1);
    toast({ title: `${product.name} added to cart` });
  };

  const handlePayWithPaypal = async () => {
    // This button does NOT implement PayPal.
    // It uses the existing checkout/session flow (Stripe under the hood),
    // mirroring the /cart "Check out" behavior.
    if (!product || product.status === "soldout") return;

    if (!token) {
      toast({
        title: "Sign in required",
        description: "Please sign in to complete checkout.",
        variant: "destructive",
      });
      return;
    }

    const currentCartItems = items?.length
      ? items
      : inCartQuantity > 0
        ? [{ product, quantity: inCartQuantity }]
        : [{ product, quantity: 1 }];

    const response = await fetch(`${apiUrl}/api/checkout/session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        items: (currentCartItems || []).map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        toast({
          title: "Sign in required",
          description: "Please sign in to complete checkout.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Checkout failed",
        description: "Please try again.",
        variant: "destructive",
      });
      return;
    }

    const data = await response.json();
    if (data.url) {
      window.location.href = data.url;
      return;
    }

    toast({
      title: "Checkout failed",
      description: "Missing checkout URL.",
      variant: "destructive",
    });
  };

  const handleDecrease = () => {
    if (!product || inCartQuantity <= 0) {
      return;
    }
    updateQuantity(product.id, inCartQuantity - 1);
  };

  const handleIncrease = () => {
    if (!product || inCartQuantity <= 0) {
      return;
    }
    updateQuantity(product.id, inCartQuantity + 1);
  };

  if (loading) {
    return (
      <Layout>
        <div className="px-6 lg:px-12 py-12 text-center">
          <p className="text-sm text-muted-foreground">Loading product...</p>
        </div>
      </Layout>
    );
  }

  if (error || !product) {
    return (
      <Layout>
        <div className="px-6 lg:px-12 py-12 text-center">
          <h1 className="text-2xl">{error || "Product not found"}</h1>
        </div>
      </Layout>
    );
  }

  const images = product.images || [product.image];

  const formatPrice = (price) => {
    return `$${price.toFixed(2)} USD`;
  };

  return (
    <Layout>
      <div className="px-6 lg:px-12 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Product Images */}
            <div>
              <div className="aspect-square overflow-hidden bg-card mb-4 rounded-3xl">
                <img
                  src={images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square overflow-hidden bg-card border-2 rounded-2xl ${
                        selectedImage === index
                          ? "border-primary"
                          : "border-transparent"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <span className="text-sm tracking-widest text-muted-foreground mb-2 block">
                SUMMER5
              </span>

              <h1 className="text-3xl md:text-4xl font-serif mb-6">
                {product.name}
              </h1>

              {/* Price */}
              <div className="flex items-center gap-3 mb-4">
                {product.originalPrice && (
                  <span className="text-lg text-muted-foreground line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
                <span className="text-lg">{formatPrice(product.price)}</span>

                {product.status === "sale" && (
                  <span className="bg-sale text-sale-foreground px-3 py-1 text-xs">
                    Sale
                  </span>
                )}
              </div>

              <p className="text-sm text-muted-foreground mb-6">
                <span className="underline">Shipping</span> calculated at
                checkout.
              </p>

              {/* Color */}
              {product.color && (
                <div className="mb-6">
                  <span className="text-sm block mb-2">Color</span>
                  <div className="flex gap-2">
                    {product.colors?.map((color) => (
                      <Button
                        key={color}
                        variant={color === product.color ? "default" : "outline"}
                        className="px-6"
                      >
                        {color}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Add to Cart */}
              <div className="space-y-3 mb-8">
                {inCartQuantity > 0 ? (
                  <div className="flex items-center justify-between border border-border">
                    <button
                      onClick={handleDecrease}
                      className="p-4 hover:bg-muted transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-6 py-3 min-w-[80px] text-center">
                      {inCartQuantity}
                    </span>
                    <button
                      onClick={handleIncrease}
                      className="p-4 hover:bg-muted transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full py-6 text-base"
                    disabled={product.status === "soldout"}
                    onClick={handleAddToCart}
                  >
                    {product.status === "soldout" ? "Sold out" : "Add to cart"}
                  </Button>
                )}

                <Button
                  className="w-full py-6 text-base bg-[#ffc439] hover:bg-[#f0b72f] text-black"
                  onClick={handlePayWithPaypal}
                >
                  Buy Now
                </Button>
              </div>

              {/* Description */}
              {product.description && (
                <div className="border-t border-border pt-8">
                  <h2 className="text-2xl font-serif mb-4">
                    Tired of messy sinks and inefficient kitchen setups?
                  </h2>

                  <p className="text-muted-foreground">
                    {product.description}
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;