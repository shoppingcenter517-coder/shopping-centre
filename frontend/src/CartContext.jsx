import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext(null);
const KEY = 'sc_cart';

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(KEY)) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(items));
  }, [items]);

  // product: { _id, name, price, image, stock }
  const addItem = (product) => {
    setItems((prev) => {
      const found = prev.find((i) => i._id === product._id);
      if (found) {
        return prev.map((i) =>
          i._id === product._id
            ? { ...i, stock: product.stock, qty: Math.min(i.qty + 1, product.stock) }
            : i
        );
      }
      return [
        ...prev,
        {
          _id: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          stock: product.stock,
          qty: 1,
        },
      ];
    });
  };

  const setQty = (id, qty) =>
    setItems((prev) =>
      prev.map((i) => (i._id === id ? { ...i, qty: Math.max(1, Math.min(qty, i.stock)) } : i))
    );

  const removeItem = (id) => setItems((prev) => prev.filter((i) => i._id !== id));
  const clear = () => setItems([]);

  const count = items.reduce((s, i) => s + i.qty, 0);
  const total = items.reduce((s, i) => s + i.qty * i.price, 0);

  return (
    <CartContext.Provider value={{ items, addItem, setQty, removeItem, clear, count, total }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
