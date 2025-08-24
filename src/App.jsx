import { useEffect, useState } from "react";
import { ShoppingCart, Star, Heart, Search, Filter, Menu, User, MapPin } from "lucide-react";
import "./App.css";
function App() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 1000]);

  // Fetch products from fakestore API
  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setFilteredProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setLoading(false);
      });
  }, []);

  // Filter products based on search, category, and price
  useEffect(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      return matchesSearch && matchesCategory && matchesPrice;
    });
    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, priceRange]);

  const categories = [...new Set(products.map(p => p.category))];

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const toggleWishlist = (product) => {
    setWishlist(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        return prev.filter(item => item.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const isInWishlist = (productId) => wishlist.some(item => item.id === productId);

  const getCartQuantity = () => cart.reduce((sum, item) => sum + item.quantity, 0);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading amazing products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-container">
          <div className="header-left">
            <Menu className="menu-icon" />
            <div className="logo">
              <ShoppingCart className="logo-icon" />
              <span>EliteStore</span>
            </div>
          </div>
          
          <div className="search-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search for products, brands and more..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="header-right">
            <div className="location">
              <MapPin size={16} />
              <span>Deliver to 560001</span>
            </div>
            <div className="user-account">
              <User size={20} />
              <span>Account</span>
            </div>
            <div className="cart-icon-container">
              <ShoppingCart size={20} />
              <span>Cart</span>
              {getCartQuantity() > 0 && (
                <span className="cart-badge">{getCartQuantity()}</span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Discover Amazing Products</h1>
          <p>Shop from millions of products at the best prices</p>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">10M+</span>
              <span className="stat-label">Products</span>
            </div>
            <div className="stat">
              <span className="stat-number">1M+</span>
              <span className="stat-label">Customers</span>
            </div>
            <div className="stat">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Support</span>
            </div>
          </div>
        </div>
        <div className="hero-gradient"></div>
      </section>

      {/* Filters */}
      <div className="filters-container">
        <div className="filters">
          <div className="filter-group">
            <Filter size={20} />
            <span>Filters</span>
          </div>
          
          <div className="category-filters">
            <button
              className={`category-btn ${selectedCategory === "all" ? "active" : ""}`}
              onClick={() => setSelectedCategory("all")}
            >
              All Products
            </button>
            {categories.map(category => (
              <button
                key={category}
                className={`category-btn ${selectedCategory === category ? "active" : ""}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>

          <div className="price-filter">
            <span>Price: ${priceRange[0]} - ${priceRange[1]}</span>
            <input
              type="range"
              min="0"
              max="1000"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
              className="price-range"
            />
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <main className="main-content">
        <div className="products-header">
          <h2>Featured Products ({filteredProducts.length})</h2>
          <div className="sort-options">
            <select className="sort-select">
              <option>Sort by: Popularity</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Customer Rating</option>
            </select>
          </div>
        </div>

        <div className="products-grid">
          {filteredProducts.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image-container">
                <img
                  src={product.image}
                  alt={product.title}
                  className="product-image"
                />
                <button
                  className={`wishlist-btn ${isInWishlist(product.id) ? "active" : ""}`}
                  onClick={() => toggleWishlist(product)}
                >
                  <Heart size={18} />
                </button>
                <div className="product-overlay">
                  <button className="quick-view-btn">Quick View</button>
                </div>
              </div>
              
              <div className="product-info">
                <div className="product-category">{product.category}</div>
                <h3 className="product-title">{product.title}</h3>
                
                <div className="product-rating">
                  <div className="stars">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={`star ${i < Math.floor(product.rating?.rate || 4) ? "filled" : ""}`}
                      />
                    ))}
                  </div>
                  <span className="rating-text">({product.rating?.count || 127})</span>
                </div>
                
                <p className="product-description">{product.description}</p>
                
                <div className="product-price-section">
                  <div className="price-container">
                    <span className="current-price">${product.price}</span>
                    <span className="original-price">${(product.price * 1.3).toFixed(2)}</span>
                    <span className="discount">23% off</span>
                  </div>
                  <div className="delivery-info">Free delivery</div>
                </div>
                
                <button
                  className="add-to-cart-btn"
                  onClick={() => addToCart(product)}
                >
                  <ShoppingCart size={16} />
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>About</h4>
            <ul>
              <li>Contact Us</li>
              <li>About Us</li>
              <li>Careers</li>
              <li>Press</li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Help</h4>
            <ul>
              <li>Payments</li>
              <li>Shipping</li>
              <li>Returns</li>
              <li>FAQ</li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Policy</h4>
            <ul>
              <li>Return Policy</li>
              <li>Terms Of Use</li>
              <li>Security</li>
              <li>Privacy</li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Social</h4>
            <ul>
              <li>Facebook</li>
              <li>Twitter</li>
              <li>YouTube</li>
              <li>Instagram</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 EliteStore. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;