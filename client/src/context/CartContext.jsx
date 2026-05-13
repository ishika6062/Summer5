import { createContext, useContext, useEffect, useRef, useState } from "react"
import { useAuth } from "@/context/AuthContext"

const CartContext = createContext(undefined)

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([])
  const { apiUrl, token } = useAuth()
  const [isHydrated, setIsHydrated] = useState(false)
  const saveTimer = useRef(null)

  const addToCart = (product, quantity) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id)

      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }

      return [...prev, { product, quantity }]
    })
  }

  const removeFromCart = (productId) => {
    setItems((prev) =>
      prev.filter((item) => item.product.id !== productId)
    )
  }

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    )
  }

  const clearCart = () => setItems([])

  const totalItems = items.reduce(
    (sum, item) => sum + item.quantity,
    0
  )

  const totalPrice = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )

  useEffect(() => {
    const loadCart = async () => {
      if (!token) {
        setIsHydrated(true)
        return
      }

      try {
        const response = await fetch(`${apiUrl}/api/cart`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!response.ok) {
          throw new Error("Failed to load cart")
        }

        const data = await response.json()
        if (Array.isArray(data.items)) {
          setItems(
            data.items.map((item) => ({
              product: {
                ...item.product,
                id: item.product?.id || item.product?._id,
              },
              quantity: item.quantity,
            }))
          )
        }
      } catch (error) {
        console.error(error)
      } finally {
        setIsHydrated(true)
      }
    }

    loadCart()
  }, [apiUrl, token])

  useEffect(() => {
    if (!token || !isHydrated) return

    if (saveTimer.current) {
      clearTimeout(saveTimer.current)
    }

    saveTimer.current = setTimeout(async () => {
      try {
        await fetch(`${apiUrl}/api/cart`, {
          method: "PUT",
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
      } catch (error) {
        console.error(error)
      }
    }, 300)

    return () => {
      if (saveTimer.current) {
        clearTimeout(saveTimer.current)
      }
    }
  }, [apiUrl, isHydrated, items, token])

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }

  return context
}