import axios from 'axios';
import { createContext, useEffect, useState } from 'react';

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const url = 'https://web-2-backend-wbs4.onrender.com';

  // Инициализируем token значением из localStorage
  const savedToken = localStorage.getItem('token');
  const [token, setToken] = useState(savedToken || '');

  const [food_list, setFoodList] = useState([]);

  const addToCart = async (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
    if (token) {
      await axios.post(url + '/api/cart/add', { itemId }, { headers: { token } });
    }
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => {
      const newCount = (prev[itemId] || 0) - 1;
      if (newCount <= 0) {
        const { [itemId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [itemId]: newCount };
    });
    if (token) {
      await axios.post(url + '/api/cart/remove', { itemId }, { headers: { token } });
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        const itemInfo = food_list.find((product) => product._id === item);
        if (itemInfo) {
          totalAmount += itemInfo.price * cartItems[item];
        }
      }
    }
    return totalAmount;
  };

  const fetchFoodList = async () => {
    try {
      const response = await axios.get(url + '/api/food/active-list');
      setFoodList(response.data.data);
    } catch (error) {
      console.error('Error fetching food list:', error);
    }
  };

  const loadCartData = async (token) => {
    try {
      const response = await axios.post(url + '/api/cart/get', {}, { headers: { token } });
      setCartItems(response.data.cartData);
    } catch (error) {
      console.error('Error loading cart data:', error);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchFoodList();
      if (token) {
        await loadCartData(token);
      }
    })();
  }, [token]); // Добавляем token в зависимости

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
  };

  return <StoreContext.Provider value={contextValue}>{props.children}</StoreContext.Provider>;
};

export default StoreContextProvider;
