export type CartItem = {
  id: number;
  name: string;
  slug: string;
  price: number;
  quantity: number;
};

const CART_KEY = "hkv-cart";

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];

  try {
    const cart = localStorage.getItem(CART_KEY);

    return cart ? JSON.parse(cart) : [];
  } catch {
    return [];
  }
}

export function saveCart(cart: CartItem[]) {
  if (typeof window === "undefined") return;

  localStorage.setItem(CART_KEY, JSON.stringify(cart));

  window.dispatchEvent(new Event("hkv-cart-updated"));
}

export function addToCart(item: Omit<CartItem, "quantity">) {
  const cart = getCart();

  const existing = cart.find(
    (cartItem) => cartItem.id === item.id
  );

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      ...item,
      quantity: 1,
    });
  }

  saveCart(cart);
}

export function removeFromCart(id: number) {
  const cart = getCart().filter(
    (item) => item.id !== id
  );

  saveCart(cart);
}

export function updateCartQuantity(
  id: number,
  quantity: number
) {
  if (quantity <= 0) {
    removeFromCart(id);
    return;
  }

  const cart = getCart().map((item) =>
    item.id === id
      ? {
          ...item,
          quantity,
        }
      : item
  );

  saveCart(cart);
}

export function clearCart() {
  saveCart([]);
}