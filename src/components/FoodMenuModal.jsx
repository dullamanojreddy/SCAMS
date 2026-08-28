import React, { useEffect, useState } from 'react';
import {
  X,
  UtensilsCrossed,
  Plus,
  Minus,
  Check,
  ShoppingBag,
  Clock,
  Search,
  Store,
  Sparkles,
  ChevronRight,
  Coffee,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { FOOD_ITEMS, CANTEEN_OUTLETS, USER_PROFILE } from '../data/mockData';
import { api } from '../api/client';

export const FoodMenuModal = ({
  isOpen,
  onClose,
  onOrderPlaced,
  currentUser = USER_PROFILE,
}) => {
  const [selectedOutlet, setSelectedOutlet] = useState('canteen-main');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState({});
  const [pickupSlot, setPickupSlot] = useState('Immediate (~12 mins)');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderToken, setOrderToken] = useState(null);
  const [menuItems, setMenuItems] = useState(FOOD_ITEMS);

  useEffect(() => {
    if (!isOpen) return;
    api.get('/api/v1/food/items').then((items) => {
      if (Array.isArray(items) && items.length) {
        setMenuItems(items.map((item) => ({
          ...item,
          canteenId: item.vendorId || 'canteen-main',
          description: item.description || item.category,
          inStock: item.isAvailable ?? item.inStock ?? true,
          isVeg: (item.dietary || '').toUpperCase() !== 'NON-VEG',
          prepTime: `${item.preparationTimeMinutes || item.prepTime || 10} mins`,
          stockCount: item.stockCount ?? (item.isAvailable === false ? 0 : 25),
          image: item.image || item.imageUrl,
        })));
      }
    }).catch(() => {});
  }, [isOpen]);

  if (!isOpen) return null;

  const categories = ['All', 'Breakfast', 'Lunch', 'Snacks', 'Beverages'];
  const pickupSlots = [
    'Immediate (~12 mins)',
    'Short Break (11:15 AM)',
    'Lunch Break Slot 1 (12:45 PM)',
    'Lunch Break Slot 2 (01:15 PM)',
    'Evening Snacks (03:45 PM)',
  ];

  const filteredItems = menuItems.filter((item) => {
    const matchesOutlet = item.canteenId === selectedOutlet || item.vendorId;
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesOutlet && matchesCategory && matchesSearch;
  });

  const getItemCount = (id) => cart[id] || 0;

  const handleUpdateQuantity = (id, delta) => {
    setCart((prev) => {
      const current = prev[id] || 0;
      const next = current + delta;
      if (next <= 0) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: next };
    });
  };

  const totalItemsCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  const subtotal = Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = menuItems.find((f) => f.id === id);
    return sum + (item ? item.price * qty : 0);
  }, 0);

  const handleCheckout = async () => {
    if (totalItemsCount === 0) return;

    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }

    const tokenNumber = Math.floor(100 + Math.random() * 900);
    const orderDetails = {
      orderId: `ORD-${Date.now().toString().slice(-4)}`,
      token: `#${tokenNumber}`,
      outlet: selectedOutlet === 'canteen-main' ? 'Main Campus Canteen' : 'Nescafe Kiosk',
      items: Object.entries(cart).map(([id, qty]) => {
        const it = FOOD_ITEMS.find((f) => f.id === id);
        return { name: it?.name, qty, price: it?.price };
      }),
      total: subtotal,
      pickupSlot,
      status: 'Placed',
      estimatedReadyTime: '12:55 PM',
    };

    try {
      const saved = await api.post('/api/v1/orders', {
        vendorId: Object.keys(cart).map((id) => menuItems.find((item) => item.id === id)?.vendorId).find(Boolean) || selectedOutlet,
        items: Object.entries(cart).map(([foodItemId, quantity]) => ({ foodItemId, quantity })),
        paymentMethod: 'CAMPUS_POINTS',
      });
      if (saved?.orderNumber) orderDetails.token = `#${saved.orderNumber}`;
    } catch (error) {
      console.warn('Orders API unavailable; keeping local order confirmation.', error.message);
    }

    setOrderToken(orderDetails.token);
    setOrderSuccess(true);

    if (onOrderPlaced) {
      onOrderPlaced(orderDetails);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden text-slate-800 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-amber-950 via-slate-900 to-rose-950 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center font-bold">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold font-outfit">Campus Mess & Food Ordering</h3>
                <span className="text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/30">
                  REQ-4.4 MODULE
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Vasavi College Canteen • Live Menu, Advance Slot Pre-Ordering & Queue-Free Pickup
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Screen Modal */}
        {orderSuccess ? (
          <div className="p-8 flex flex-col items-center justify-center text-center space-y-4 my-auto animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-lg">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900 font-outfit">Order Placed Successfully!</h3>
              <p className="text-xs text-slate-500 mt-1">
                Your order is confirmed at <strong>{selectedOutlet === 'canteen-main' ? 'Main Campus Canteen' : 'Nescafe Kiosk'}</strong>
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 max-w-sm w-full space-y-2">
              <div className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                Pickup Token Number
              </div>
              <div className="text-4xl font-black font-mono text-amber-950">{orderToken}</div>
              <div className="text-xs text-amber-700 font-medium">
                Slot: <strong>{pickupSlot}</strong>
              </div>
              <div className="text-[11px] text-amber-600 font-mono">
                Counter: Counter 1 & 2 (Ramanujan Ground Floor)
              </div>
            </div>

            <p className="text-xs text-slate-400 max-w-sm">
              Show your token or Smart QR at the canteen counter when your order status turns "Ready for Pickup".
            </p>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  setOrderSuccess(false);
                  setCart({});
                  onClose();
                }}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs cursor-pointer shadow-md transition"
              >
                Done & Track in Orders
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Outlet Selector & Search */}
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              {/* Outlet Toggle */}
              <div className="flex items-center gap-2 bg-slate-200/70 p-1 rounded-2xl w-full sm:w-auto">
                <button
                  onClick={() => {
                    setSelectedOutlet('canteen-main');
                    setCart({});
                  }}
                  className={`flex-1 sm:flex-none px-4 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 justify-center ${
                    selectedOutlet === 'canteen-main'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Store className="w-3.5 h-3.5 text-amber-600" />
                  <span>Main Canteen</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedOutlet('nescafe');
                    setCart({});
                  }}
                  className={`flex-1 sm:flex-none px-4 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 justify-center ${
                    selectedOutlet === 'nescafe'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Coffee className="w-3.5 h-3.5 text-amber-700" />
                  <span>Nescafe Kiosk</span>
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative flex-1 w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search food, snacks, drinks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-amber-900 text-white'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Menu Items Grid & Side Cart */}
            <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
              {/* Menu List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredItems.map((item) => {
                    const count = getItemCount(item.id);
                    return (
                      <div
                        key={item.id}
                        className={`p-4 rounded-2xl border transition bg-white flex flex-col justify-between ${
                          item.inStock
                            ? 'border-slate-200 hover:border-slate-300 hover:shadow-md'
                            : 'border-slate-100 opacity-60 bg-slate-50'
                        }`}
                      >
                        <div>
                          <div className="flex items-start gap-3">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-20 h-20 rounded-xl object-cover border border-slate-200 shadow-xs shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 mb-1">
                                <span
                                  className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center shrink-0 ${
                                    item.isVeg ? 'border-emerald-600' : 'border-rose-600'
                                  }`}
                                >
                                  <span
                                    className={`w-1.5 h-1.5 rounded-full ${
                                      item.isVeg ? 'bg-emerald-600' : 'bg-rose-600'
                                    }`}
                                  />
                                </span>
                                <span className="text-[10px] font-mono text-slate-400 uppercase">
                                  {item.category}
                                </span>
                              </div>
                              <h4 className="text-sm font-bold text-slate-900 truncate">
                                {item.name}
                              </h4>
                              <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                                {item.description}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-sm font-black font-mono text-slate-900">
                                  ₹{item.price}
                                </span>
                                <span className="text-[11px] text-slate-400 font-mono flex items-center gap-0.5">
                                  <Clock className="w-3 h-3" /> {item.prepTime}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Add to Cart Actions */}
                        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-[10px] font-mono text-slate-400">
                            {item.inStock ? `Available: ${item.stockCount}` : 'Out of Stock'}
                          </span>

                          {item.inStock ? (
                            count === 0 ? (
                              <button
                                onClick={() => handleUpdateQuantity(item.id, 1)}
                                className="px-4 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition shadow-xs cursor-pointer flex items-center gap-1"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Add</span>
                              </button>
                            ) : (
                              <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-2 py-1">
                                <button
                                  onClick={() => handleUpdateQuantity(item.id, -1)}
                                  className="w-6 h-6 rounded-lg bg-white text-amber-900 hover:bg-amber-100 flex items-center justify-center font-bold text-xs cursor-pointer"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="text-xs font-bold font-mono text-amber-950 px-1">
                                  {count}
                                </span>
                                <button
                                  onClick={() => handleUpdateQuantity(item.id, 1)}
                                  className="w-6 h-6 rounded-lg bg-amber-600 text-white hover:bg-amber-700 flex items-center justify-center font-bold text-xs cursor-pointer"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            )
                          ) : (
                            <span className="text-xs text-rose-500 font-bold">Sold Out</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Summary & Pickup Slot Panel */}
              <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-slate-200 bg-slate-50/80 p-5 overflow-y-auto flex flex-col justify-between shrink-0 space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      <ShoppingBag className="w-4 h-4 text-amber-600" />
                      <span>Order Tray ({totalItemsCount})</span>
                    </h4>
                    {totalItemsCount > 0 && (
                      <button
                        onClick={() => setCart({})}
                        className="text-[11px] text-rose-500 hover:underline cursor-pointer font-medium"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  {/* Pickup Time Slot Selector (REQ-4.4.3) */}
                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-2">
                    <label className="block text-xs font-bold text-slate-700">
                      Select Pickup Slot (REQ-4.4.3)
                    </label>
                    <select
                      value={pickupSlot}
                      onChange={(e) => setPickupSlot(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500"
                    >
                      {pickupSlots.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Cart Items List */}
                  {totalItemsCount === 0 ? (
                    <div className="p-8 text-center text-slate-400 text-xs">
                      Your tray is empty. Add items from the menu to pre-order.
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {Object.entries(cart).map(([id, qty]) => {
                        const item = menuItems.find((f) => f.id === id);
                        if (!item) return null;
                        return (
                          <div
                            key={id}
                            className="flex items-center justify-between text-xs p-2 rounded-xl bg-white border border-slate-100"
                          >
                            <div className="truncate flex-1 pr-2">
                              <span className="font-semibold text-slate-800">{item.name}</span>
                              <span className="text-slate-400 font-mono ml-1">x{qty}</span>
                            </div>
                            <span className="font-mono font-bold text-slate-900">
                              ₹{item.price * qty}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Subtotal & Place Order Button */}
                <div className="space-y-3 pt-3 border-t border-slate-200">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Subtotal</span>
                    <span className="font-mono font-bold text-slate-900">₹{subtotal}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>College Student Discount</span>
                    <span className="font-mono font-bold text-emerald-600">FREE Campus Delivery</span>
                  </div>
                  <div className="flex items-center justify-between text-sm font-bold text-slate-900 pt-1 border-t border-slate-200">
                    <span>Total Amount</span>
                    <span className="font-mono text-base font-black text-amber-900">₹{subtotal}</span>
                  </div>

                  <button
                    disabled={totalItemsCount === 0}
                    onClick={handleCheckout}
                    className={`w-full py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-md ${
                      totalItemsCount > 0
                        ? 'bg-amber-600 hover:bg-amber-700 text-white active:scale-98'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <span>Place Pre-Order & Get Token</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
