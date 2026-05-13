import { Link } from "react-router-dom"
import Layout from "@/components/layout/Layout"
import { useCart } from "@/context/CartContext"
import { Minus, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"

const Cart = () => {
  const { items, updateQuantity, removeFromCart, totalPrice } = useCart()
  const { apiUrl, token } = useAuth()
  const { toast } = useToast()
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  const formatPrice = (price) => `$${price.toFixed(2)} USD`

  const handleCheckout = async () => {
    if (items.length === 0 || isCheckingOut) return

    if (!token) {
      toast({
        title: "Sign in required",
        description: "Please sign in to complete checkout.",
        variant: "destructive",
      })
      return
    }

    setIsCheckingOut(true)
    try {
      const response = await fetch(`${apiUrl}/api/checkout/session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
          })),
        }),
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Please sign in to continue")
        }
        throw new Error("Failed to start checkout")
      }

      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error("Missing checkout URL")
      }
    } catch (error) {
      toast({
        title: "Checkout failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsCheckingOut(false)
    }
  }

  if (items.length === 0) {
    return (
      <Layout>
        <div className="px-6 lg:px-12 py-12">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-serif mb-8">Your cart</h1>
            <p className="text-muted-foreground mb-8">
              Your cart is currently empty.
            </p>
            <Link
              to="/shop"
              className="underline underline-offset-4 text-sm hover:opacity-70"
            >
              Continue shopping
            </Link>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="px-6 lg:px-12 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif mb-12">
            Your cart
          </h1>

          <div className="space-y-6">
            {items.map((item) => (
              <div
                key={item.product.id}
                className="flex gap-6 border-b border-border pb-6"
              >
                <Link
                  to={`/product/${item.product.slug}`}
                  className="w-24 h-24 bg-card flex-shrink-0"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </Link>

                <div className="flex-1">
                  <Link
                    to={`/product/${item.product.slug}`}
                    className="text-sm hover:underline"
                  >
                    {item.product.name}
                  </Link>

                  <p className="text-sm mt-1">
                    {formatPrice(item.product.price)}
                  </p>

                  <div className="flex items-center mt-3 gap-3">
                    <div className="flex items-center border border-border">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.product.id,
                            item.quantity - 1
                          )
                        }
                        className="p-2 hover:bg-muted"
                        aria-label="Decrease"
                      >
                        <Minus className="w-3 h-3" />
                      </button>

                      <span className="px-3 text-sm">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          updateQuantity(
                            item.product.id,
                            item.quantity + 1
                          )
                        }
                        className="p-2 hover:bg-muted"
                        aria-label="Increase"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() =>
                        removeFromCart(item.product.id)
                      }
                      className="p-2 hover:opacity-70"
                      aria-label="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="text-sm font-medium">
                  {formatPrice(
                    item.product.price * item.quantity
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col items-end gap-4">
            <div className="text-lg">
              Subtotal:{" "}
              <span className="font-medium">
                {formatPrice(totalPrice)}
              </span>
            </div>

            <p className="text-sm text-muted-foreground">
              Shipping calculated at checkout.
            </p>

            <Button
              className="px-12 py-6 text-base"
              onClick={handleCheckout}
              disabled={isCheckingOut}
            >
              {isCheckingOut ? "Redirecting..." : "Check out"}
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Cart