import { useState } from 'react';
import { Product, CartItem } from '../types';

export function useCart(whatsapp: string) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, cartQuantity: item.cartQuantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, cartQuantity: 1 }];
    });
    if (!product.isConsultative) setIsCartOpen(true);
    showToast(`${product.name} adicionado ao carrinho ✓`);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateCartQuantity = (id: string, delta: number) => {
    setCart(prev =>
      prev.map(item => {
        if (item.id === id) {
          const newQty = Math.max(1, item.cartQuantity + delta);
          return { ...item, cartQuantity: newQty };
        }
        return item;
      })
    );
  };

  const handleCheckout = () => {
    const itemsList = cart
      .map(item => `- ${item.name} (${item.cartQuantity}x) - R$ ${item.price.toFixed(2)}`)
      .join('\n');
    const total = cart.reduce((acc, curr) => acc + curr.price * curr.cartQuantity, 0);
    const message = `Olá senhor Walter, vim por meio do seu site. Gostaria de finalizar o pedido:\n\n${itemsList}\n\nTotal: R$ ${total.toFixed(2)}\n\nComo prossigo para pagamento e retirada?`;
    window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const cartCount = cart.reduce((a, b) => a + b.cartQuantity, 0);
  const cartTotal = cart.reduce((acc, curr) => acc + curr.price * curr.cartQuantity, 0);

  return {
    cart,
    isCartOpen,
    setIsCartOpen,
    toast,
    cartCount,
    cartTotal,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    handleCheckout,
  };
}
