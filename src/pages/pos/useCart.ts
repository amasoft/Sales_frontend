import { useCallback, useMemo, useState } from "react";
import type { CartLine, Product } from "@/types";

export function useCart() {
  const [lines, setLines] = useState<CartLine[]>([]);

  const addProduct = useCallback((product: Product) => {
    setLines((prev) => {
      const existing = prev.find((line) => line.productId === product.id);
      if (existing) {
        if (existing.quantity >= product.quantity) return prev;
        return prev.map((line) =>
          line.productId === product.id ? { ...line, quantity: line.quantity + 1 } : line
        );
      }
      if (product.quantity <= 0) return prev;
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          sellingPrice: product.sellingPrice,
          quantity: 1,
          availableQuantity: product.quantity,
        },
      ];
    });
  }, []);

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    setLines((prev) =>
      prev.map((line) =>
        line.productId === productId
          ? { ...line, quantity: Math.max(1, Math.min(quantity, line.availableQuantity)) }
          : line
      )
    );
  }, []);

  const updateSellingPrice = useCallback((productId: number, sellingPrice: number) => {
    setLines((prev) =>
      prev.map((line) => (line.productId === productId ? { ...line, sellingPrice: Math.max(0, sellingPrice) } : line))
    );
  }, []);

  const removeProduct = useCallback((productId: number) => {
    setLines((prev) => prev.filter((line) => line.productId !== productId));
  }, []);

  const clear = useCallback(() => setLines([]), []);
  const replace = useCallback((next: CartLine[]) => setLines(next), []);

  const subtotal = useMemo(() => lines.reduce((sum, l) => sum + l.sellingPrice * l.quantity, 0), [lines]);
  const totalItems = useMemo(() => lines.reduce((sum, l) => sum + l.quantity, 0), [lines]);

  return {
    lines,
    addProduct,
    updateQuantity,
    updateSellingPrice,
    removeProduct,
    clear,
    replace,
    subtotal,
    totalItems,
  };
}

export type UseCartReturn = ReturnType<typeof useCart>;
