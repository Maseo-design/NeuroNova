import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Heart } from 'lucide-react';
import { Product } from '../../types/product';
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter } from '../ui/card';
import { Badge } from '../ui/badge';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/use-toast';

interface ProductCardProps {
  product: Product;
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, className = '' }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to add items to cart.",
        variant: "destructive",
      });
      return;
    }

    if (user.role === 'admin') {
      toast({
        title: "Access restricted",
        description: "Admins cannot add items to cart.",
        variant: "destructive",
      });
      return;
    }

    addToCart(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <Link to={`/product/${product.id}`}>
      <Card className={`group hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 ${className}`}>
        <CardContent className="p-0">
          <div className="relative overflow-hidden rounded-t-lg">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-2 right-2">
              <Button
                variant="ghost"
                size="sm"
                className="bg-background/80 backdrop-blur-sm hover:bg-background"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // Add to wishlist logic here
                }}
              >
                <Heart className="h-4 w-4" />
              </Button>
            </div>
            {product.stock <= 5 && product.stock > 0 && (
              <Badge variant="destructive" className="absolute top-2 left-2">
                Only {product.stock} left
              </Badge>
            )}
            {product.stock === 0 && (
              <Badge variant="destructive" className="absolute top-2 left-2">
                Out of stock
              </Badge>
            )}
          </div>
          
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Badge variant="outline" className="text-xs">
                {product.category}
              </Badge>
              <div className="flex items-center space-x-1">
                <Star className="h-3 w-3 fill-warning text-warning" />
                <span className="text-xs text-muted-foreground">
                  {product.rating} ({product.reviews})
                </span>
              </div>
            </div>
            
            <h3 className="font-semibold text-lg mb-1 line-clamp-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            
            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
              {product.description}
            </p>
            
            <p className="text-xs text-muted-foreground mb-3">
              by {product.merchantName}
            </p>
            
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xl font-bold text-primary">
                  {formatPrice(product.price)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="pt-0 px-4 pb-4">
          <Button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || !user || user.role === 'admin'}
            className="w-full bg-gradient-primary hover:opacity-90"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ProductCard;