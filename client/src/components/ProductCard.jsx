import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const ProductCard = ({ product, showMeta = true }) => {
  const formatPrice = (price) => {
    return `$${price.toFixed(2)} USD`;
  };

  return (
    <Link to={`/product/${product.slug}`} className="group block">
      {showMeta ? (
        <>
          <div className="relative aspect-square overflow-hidden bg-card mb-4 duration-300 rounded-3xl">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />

            {/* Status Badge */}
            {product.status === "sale" && (
              <span className="absolute bottom-4 left-4 bg-sale text-sale-foreground px-3 py-1 text-xs">
                Sale
              </span>
            )}
            {product.status === "soldout" && (
              <span className="absolute bottom-4 left-4 bg-soldout text-soldout-foreground px-3 py-1 text-xs">
                Sold out
              </span>
            )}
          </div>

          <h3 className="text-sm mb-2 line-clamp-2">{product.name}</h3>
        </>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-background">
          <div className="aspect-square">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div className="px-4 py-3 h-[56px] flex items-center">
            <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground line-clamp-2">
              {product.name}
            </p>
          </div>
        </div>
      )}

      {showMeta && (
        <div className="flex items-center gap-2">
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
          <span
            className={cn(
              "text-sm",
              product.originalPrice && "text-foreground",
            )}
          >
            {formatPrice(product.price)}
          </span>
        </div>
      )}
    </Link>
  );
};

export default ProductCard;
