import React, { useEffect } from 'react';
import { useCMS } from '../store/CMSContext';
import { useCart } from '../hooks/useCart';
import { Header, Footer } from '../components/Layout';
import { HeroSection } from '../components/sections/HeroSection';
import { ProductsSection } from '../components/sections/ProductsSection';
import { AboutSection } from '../components/sections/AboutSection';
import { ContactSection } from '../components/sections/ContactSection';
import { CartSidebar } from '../components/sections/CartSidebar';
import { Assistant } from '../components/Assistant';

export function PublicSite() {
  const { activeProducts, siteConfig } = useCMS();
  const {
    cart, isCartOpen, setIsCartOpen, toast,
    cartCount, cartTotal,
    addToCart, removeFromCart, updateCartQuantity, handleCheckout,
  } = useCart(siteConfig.whatsapp);

  useEffect(() => {
    document.title = 'Ótica Roland | Vila Mariana, SP';
  }, []);

  const handleConsult = (product: { name: string }) => {
    const msg = encodeURIComponent(`Olá senhor Walter, gostaria de consultar sobre: ${product.name}`);
    window.open(`https://wa.me/${siteConfig.whatsapp}?text=${msg}`, '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        cartCount={cartCount}
        onCartClick={() => setIsCartOpen(true)}
      />

      <main className="flex-grow pt-[72px]">
        <HeroSection siteConfig={siteConfig} />
        <ProductsSection
          products={activeProducts}
          onAddToCart={addToCart}
          onConsult={handleConsult}
          whatsapp={siteConfig.whatsapp}
        />
        <AboutSection />
        <ContactSection
          whatsapp={siteConfig.whatsapp}
          address={siteConfig.address}
          workingHours={siteConfig.workingHours}
        />
      </main>

      <Footer siteConfig={siteConfig} />
      <Assistant />

      <CartSidebar
        cart={cart}
        cartTotal={cartTotal}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onRemove={removeFromCart}
        onUpdateQty={updateCartQuantity}
        onCheckout={handleCheckout}
      />

      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-navy text-white px-12 py-4 rounded-2xl text-sm font-bold shadow-2xl z-[200] animate-in whitespace-nowrap">
          {toast}
        </div>
      )}
    </div>
  );
}
