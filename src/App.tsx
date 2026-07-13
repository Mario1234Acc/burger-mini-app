import { useState, useEffect, useMemo } from 'react';
import './App.css';

const WebApp = (window as any).Telegram.WebApp;

// --- Types ---
interface Burger {
  id: number;
  name: string;
  price: number;
}

interface CartItem {
  id: number;
  qty: number;
}

// --- Mock Data ---
const BURGERS: Burger[] = [
  { id: 1, name: 'Classic Cheeseburger', price: 5 },
  { id: 2, name: 'Double Bacon Smash', price: 8 },
  { id: 3, name: 'Spicy Chicken Burger', price: 6 },
];

function App() {
  const [cart, setCart] = useState<CartItem[]>([]);

  // --- Derived State ---
  const totalPrice = useMemo(() => {
    return cart.reduce((total, item) => {
      const burger = BURGERS.find((b) => b.id === item.id);
      return total + (burger ? burger.price * item.qty : 0);
    }, 0);
  }, [cart]);

  // --- Telegram Initialization ---
  useEffect(() => {
    WebApp.ready();
    WebApp.expand(); 
  }, []);

  // --- Telegram MainButton UI (For inside Telegram) ---
  useEffect(() => {
    if (totalPrice > 0) {
      WebApp.MainButton.show();
      WebApp.MainButton.setParams({
        text: `CHECKOUT • $${totalPrice.toFixed(2)}`,
        color: '#f97316',
      });
    } else {
      WebApp.MainButton.hide();
    }
  }, [totalPrice]);

  // --- Demo Checkout Flow ---
  const processDemoCheckout = () => {
    if (cart.length === 0) return;
    
    // 1. Show Total Price Confirmation
    const isConfirmed = window.confirm(`Your total is $${totalPrice.toFixed(2)}.\n\nDo you want to proceed with the payment?`);
    
    // 2. Show Success Alert and Clear Cart
    if (isConfirmed) {
      window.alert("✅ Payment successful! Your order is being prepared.");
      setCart([]); // Clear the cart after successful payment
    }
  };

  // Sync Telegram's native MainButton with our demo checkout
  useEffect(() => {
    WebApp.MainButton.onClick(processDemoCheckout);
    return () => {
      WebApp.MainButton.offClick(processDemoCheckout);
    };
  }, [cart, totalPrice]);

  // --- Cart Handlers ---
  const increaseQty = (id: number) => {
    setCart((prev) => {
      const existingItem = prev.find((item) => item.id === id);
      if (existingItem) {
        return prev.map((item) => 
          item.id === id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { id, qty: 1 }];
    });
  };

  const decreaseQty = (id: number) => {
    setCart((prev) => {
      const existingItem = prev.find((item) => item.id === id);
      if (!existingItem) return prev;
      
      // If quantity is 1, remove it from the cart entirely
      if (existingItem.qty === 1) {
        return prev.filter((item) => item.id !== id);
      }
      
      // Otherwise, just decrease the quantity by 1
      return prev.map((item) => 
        item.id === id ? { ...item, qty: item.qty - 1 } : item
      );
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-5 font-sans pb-32">
      {/* Header Section */}
      <header className="mb-8 mt-2 text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          🍔 Burger Store
        </h2>
        <p className="text-gray-500 text-sm mt-1">Tap to add items to your order</p>
      </header>
      
      {/* List Section */}
      <div className="flex flex-col gap-4">
        {BURGERS.map((burger) => {
          const cartItem = cart.find(item => item.id === burger.id);
          const quantity = cartItem ? cartItem.qty : 0;
          
          return (
            <div 
              key={burger.id} 
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center justify-between transition-all"
            >
              <div className="flex flex-col">
                <h3 className="text-lg font-bold text-gray-800 leading-tight">
                  {burger.name}
                </h3>
                <p className="text-orange-500 font-bold mt-1">
                  ${burger.price.toFixed(2)}
                </p>
              </div>
              
              {/* Dynamic Controls: Show Add Button or +/- Controls */}
              {quantity > 0 ? (
                <div className="flex items-center gap-3 bg-gray-50 p-1.5 rounded-xl border border-gray-100">
                  <button 
                    onClick={() => decreaseQty(burger.id)}
                    className="w-8 h-8 flex items-center justify-center bg-white text-gray-800 font-bold rounded-lg shadow-sm active:scale-95 transition-transform"
                  >
                    −
                  </button>
                  <span className="w-4 text-center font-bold text-gray-800">
                    {quantity}
                  </span>
                  <button 
                    onClick={() => increaseQty(burger.id)}
                    className="w-8 h-8 flex items-center justify-center bg-orange-500 text-white font-bold rounded-lg shadow-sm active:scale-95 transition-transform"
                  >
                    +
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => increaseQty(burger.id)}
                  className="ml-4 px-6 py-2.5 rounded-xl font-bold transition-all active:scale-95 bg-orange-50 text-orange-600 hover:bg-orange-100"
                >
                  Add
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Floating Demo Checkout Bar (Visible in browser testing) */}
      {totalPrice > 0 && (
        <div className="fixed bottom-0 left-0 w-full p-4 bg-white border-t border-gray-100 shadow-[0_-4px_15px_rgba(0,0,0,0.05)]">
          <button 
            onClick={processDemoCheckout}
            className="w-full bg-orange-500 text-white font-bold text-lg py-4 rounded-2xl shadow-md shadow-orange-200 active:scale-[0.98] transition-transform flex justify-between items-center px-6"
          >
            <span>Pay Now</span>
            <span>${totalPrice.toFixed(2)}</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default App;