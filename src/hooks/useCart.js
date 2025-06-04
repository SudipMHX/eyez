import { useEffect, useState } from "react";

const STORAGE_KEY = "cart_items";

export function useCart() {
  const [cartItems, setCartItems] = useState(() => {
    if (typeof window === "undefined") {
      return [];
    }
    try {
      const stored = localStorage.getItem(STORAGE_KEY);

      if (stored && stored !== "undefined" && stored !== "null") {
        const parsedItems = JSON.parse(stored);
        if (Array.isArray(parsedItems)) {
          return parsedItems;
        } else {
          localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
          return [];
        }
      } else {
        return [];
      }
    } catch (err) {
      return [];
    }
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        if (Array.isArray(cartItems)) {
          console.log(cartItems);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
          console.log(cartItems);
        } else {
          localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
        }
      } catch (err) {
        // error
      }
    }
  }, [cartItems]);



  const addToCart = (product) => {
    return new Promise((resolve) => {
      setCartItems((prevCartItems) => {
        const currentCart = Array.isArray(prevCartItems) ? prevCartItems : [];
        const existing = currentCart.find(
          (item) =>
            item.productId === product.productId &&
            JSON.stringify(item.variant) === JSON.stringify(product.variant)
        );

        let updatedCart;
        if (existing) {
          updatedCart = currentCart.map((item) =>
            item.productId === product.productId &&
            JSON.stringify(item.variant) === JSON.stringify(product.variant)
              ? {
                  ...item,
                  quantity: item.quantity + 1,
                  totalPrice: (item.quantity + 1) * item.unitPrice,
                }
              : item
          );
        } else {
          updatedCart = [
            ...currentCart,
            { ...product, quantity: 1, totalPrice: product.unitPrice },
          ];
        }
        return updatedCart;
      });
      resolve();
    });
  };

  const removeFromCart = (productId, variant) => {
    setCartItems((prevCartItems) => {
      const currentCart = Array.isArray(prevCartItems) ? prevCartItems : [];
      const updatedCart = currentCart.filter(
        (item) =>
          item.productId !== productId ||
          JSON.stringify(item.variant) !== JSON.stringify(variant)
      );
      return updatedCart;
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const updateQuantity = (productId, variant, quantity) => {
    setCartItems((prevCartItems) => {
      const currentCart = Array.isArray(prevCartItems) ? prevCartItems : [];
      const updatedCart = currentCart.map((item) =>
        item.productId === productId &&
        JSON.stringify(item.variant) === JSON.stringify(variant)
          ? {
              ...item,
              quantity: Math.max(1, quantity),
              totalPrice: item.unitPrice * Math.max(1, quantity),
            }
          : item
      );
      return updatedCart;
    });
  };

  const getTotalAmount = () => {
    const currentCart = Array.isArray(cartItems) ? cartItems : [];
    return currentCart.reduce((total, item) => total + item.totalPrice, 0);
  };

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalAmount,
  };
}
