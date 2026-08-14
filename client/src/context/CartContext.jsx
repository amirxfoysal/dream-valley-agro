import { createContext, useContext, useMemo, useState } from 'react';

const CartContext = createContext(null);

export const FREE_SHIPPING_THRESHOLD = 1000;
export const FLAT_SHIPPING = 80;

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('dva-cart') || '[]');
    } catch {
      return [];
    }
  });

  const count = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const shipping = useMemo(
    () => (subtotal === 0 ? 0 : subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING),
    [subtotal]
  );

  const total = useMemo(() => subtotal + shipping, [subtotal, shipping]);

  const persist = (next) => {
    localStorage.setItem('dva-cart', JSON.stringify(next));
    return next;
  };

  const addItem = (product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      const next = existing
        ? prev.map((i) =>
            i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
          )
        : [
            ...prev,
            {
              id: product.id,
              name: product.name,
              nameBn: product.nameBn || '',
              image: product.image || '',
              price: product.price,
              quantity,
            },
          ];
      return persist(next);
    });
  };

  const setQuantity = (id, quantity) => {
    setItems((prev) => {
      const clamped = Math.max(1, Math.round(quantity));
      return persist(prev.map((i) => (i.id === id ? { ...i, quantity: clamped } : i)));
    });
  };

  const removeItem = (id) => {
    setItems((prev) => persist(prev.filter((i) => i.id !== id)));
  };

  const clearCart = () => {
    setItems([]);
    localStorage.setItem('dva-cart', '[]');
  };

  return (
    <CartContext.Provider
      value={{ items, count, subtotal, shipping, total, addItem, setQuantity, removeItem, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}