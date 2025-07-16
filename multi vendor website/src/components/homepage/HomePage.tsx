import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, TrendingUp, Users, Store, ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import ProductCard from '../product/ProductCard';
import { mockProducts, categories } from '../../data/mockProducts';
import { useAuth } from '../../contexts/AuthContext';

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const featuredProducts = mockProducts.slice(0, 4);
  const filteredProducts = selectedCategory
    ? mockProducts.filter(product => product.category === selectedCategory)
    : mockProducts;

  const stats = [
    { label: 'Active Merchants', value: '500+', icon: Store },
    { label: 'Happy Customers', value: '10K+', icon: Users },
    { label: 'Products Listed', value: '50K+', icon: TrendingUp },
    { label: 'Average Rating', value: '4.8', icon: Star },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-primary-glow/5 to-background py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-30"></div>
        
        <div className="container mx-auto max-w-6xl relative">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Welcome to{' '}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                VendorVerse
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              The ultimate multi-merchant marketplace where vendors thrive and customers discover amazing products from trusted sellers worldwide.
            </p>
            
            {!user ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-gradient-primary hover:opacity-90" asChild>
                  <Link to="/register">
                    Start Selling Today
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/login">Sign In</Link>
                </Button>
              </div>
            ) : (
              <div className="flex justify-center">
                {user.role === 'merchant' && (
                  <Button size="lg" className="bg-gradient-merchant hover:opacity-90" asChild>
                    <Link to="/merchant">
                      Go to Dashboard
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                )}
                {user.role === 'admin' && (
                  <Button size="lg" className="bg-gradient-admin hover:opacity-90" asChild>
                    <Link to="/admin">
                      Admin Dashboard
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                )}
                {user.role === 'customer' && (
                  <Button size="lg" className="bg-gradient-primary hover:opacity-90" asChild>
                    <Link to="#products">
                      Start Shopping
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="bg-background/80 backdrop-blur-sm border-primary/20">
                <CardContent className="p-6 text-center">
                  <stat.icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4" id="categories">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Shop by Category</h2>
            <p className="text-muted-foreground">Discover products across various categories</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Card
                key={category.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-card hover:-translate-y-1 ${
                  selectedCategory === category.name ? 'ring-2 ring-primary bg-primary/5' : ''
                }`}
                onClick={() => setSelectedCategory(selectedCategory === category.name ? null : category.name)}
              >
                <CardContent className="p-6 text-center">
                  <div className="text-3xl mb-3">{category.icon}</div>
                  <h3 className="font-semibold text-sm">{category.name}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4 bg-muted/30" id="products">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-4">
                {selectedCategory ? `${selectedCategory} Products` : 'Featured Products'}
              </h2>
              <p className="text-muted-foreground">
                {selectedCategory 
                  ? `Explore our collection of ${selectedCategory.toLowerCase()} products`
                  : 'Discover the best products from our trusted merchants'
                }
              </p>
            </div>
            {selectedCategory && (
              <Button
                variant="outline"
                onClick={() => setSelectedCategory(null)}
              >
                View All
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(selectedCategory ? filteredProducts : featuredProducts).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {!selectedCategory && (
            <div className="text-center mt-12">
              <Button size="lg" variant="outline" asChild>
                <Link to="/products">
                  View All Products
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* For Merchants Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Selling?</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of successful merchants on VendorVerse. Set up your store, 
              list your products, and reach customers worldwide.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Store className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Create Your Store</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Set up your personalized store with custom branding and product listings.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Grow Your Business</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Access powerful analytics and tools to optimize your sales and reach.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Connect with Customers</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Build relationships with customers through reviews, ratings, and direct communication.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Button size="lg" className="bg-gradient-merchant hover:opacity-90" asChild>
              <Link to="/register">
                Become a Merchant
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;