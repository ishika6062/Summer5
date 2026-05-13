export const products = [
  {
    id: "1",
    name: "No-Assembly 3-Tier Foldable Rolling Storage Rack for Small Spaces",
    slug: "foldable-rolling-storage-rack",
    price: 116.62,
    originalPrice: 157.37,
    image:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=600&fit=crop",
    category: "kitchen",
    status: "sale",
    description: "Perfect for organizing your kitchen essentials.",
  },
  {
    id: "2",
    name: "Solace Lounge",
    slug: "solace-lounge",
    price: 1112.9,
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=600&fit=crop",
    category: "living-room",
    status: "soldout",
    description:
      "A comfortable and stylish lounge for your living room.",
  },
  {
    id: "3",
    name:
      "Stainless Steel Waterfall Kitchen Sink with Pull-Out Faucet",
    slug: "stainless-steel-waterfall-kitchen-sink",
    price: 599.43,
    originalPrice: 840.18,
    image:
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=600&h=600&fit=crop",
    ],
    category: "kitchen",
    status: "sale",
    color: "Black",
    colors: ["Black"],
    description:
      "Tired of messy sinks and inefficient kitchen setups? Upgrade your daily kitchen routine with our premium stainless steel waterfall sink.",
  },
  {
    id: "4",
    name:
      "Garden Furniture",
    slug: "Garden Furniture",
    price: 1015.43,
    // originalPrice: 840.18,
    image:
      "https://images.unsplash.com/photo-1613685302957-3a6fc45346ef?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8b3V0ZG9vciUyMGZ1cm5pdHVyZXxlbnwwfHwwfHx8MA%3D%3Dfit=crop",
    images: [
      "https://images.unsplash.com/photo-1613685302957-3a6fc45346ef?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8b3V0ZG9vciUyMGZ1cm5pdHVyZXxlbnwwfHwwfHx8MA%3D%3Dfit=crop",
      "https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=600&h=600&fit=crop",
    ],
    category: "outdoor",
    color: "Beige",
    colors: ["Beige"],
    description:
      "Tired of messy sinks and inefficient kitchen setups? Upgrade your daily kitchen routine" 
  },
]

export const getProductBySlug = (slug) => {
  return products.find((p) => p.slug === slug)
}

export const getProductsByCategory = (category) => {
  return products.filter((p) => p.category === category)
}