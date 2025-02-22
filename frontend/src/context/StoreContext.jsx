// StoreContext.js
import axios from 'axios';
import { createContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const { i18n } = useTranslation();
  //https://web-2-backend-wbs4.onrender.com

  // URL для запросов к API
  // const url = 'http://localhost:4000';
  const url = 'https://web-2-backend-wbs4.onrender.com';

  // Состояния
  const [cartItems, setCartItems] = useState({});
  const [food_list, setFoodList] = useState([]);
  const [headerContent, setHeaderContent] = useState({
    new: { en: '', ru: '', pl: '' },
    description: { en: '', ru: '', pl: '' },
    button: { en: '', ru: '', pl: '' },
    backgroundUrl: '', // URL фона
  });
  const [isLoading, setIsLoading] = useState(true);

  // Инициализируем token значением из localStorage
  const savedToken = localStorage.getItem('token');
  const [token, setToken] = useState(savedToken || '');

  // Функция для получения данных headerContent с API
  const fetchHeaderContent = async () => {
    setIsLoading(true); // Устанавливаем состояние загрузки
    try {
      const response = await axios.get(`${url}/api/header`);

      setHeaderContent(response.data.data);
    } catch (error) {
      console.error('Error fetching header content:', error);
    } finally {
      setIsLoading(false); // Завершаем загрузку
    }
  };

  // Функция для получения списка продуктов
  const fetchFoodList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/active-list`);
      setFoodList(response.data.data);
    } catch (error) {
      console.error('Error fetching food list:', error);
    }
  };

  // Функция для загрузки данных корзины
  const loadCartData = async (token) => {
    try {
      const response = await axios.post(`${url}/api/cart/get`, {}, { headers: { token } });
      setCartItems(response.data.cartData);
    } catch (error) {
      console.error('Error loading cart data:', error);
    }
  };

  // Добавление товара в корзину
  const addToCart = async (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
    if (token) {
      await axios.post(`${url}/api/cart/add`, { itemId }, { headers: { token } });
    }
  };

  // Удаление товара из корзины
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
      await axios.post(`${url}/api/cart/remove`, { itemId }, { headers: { token } });
    }
  };

  // Получение общей суммы корзины
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

  // Загружаем список продуктов, данные корзины и headerContent при монтировании
  useEffect(() => {
    fetchFoodList();
    fetchHeaderContent(); // Загружаем headerContent

    if (token) {
      loadCartData(token);
    }

    // Обновляем headerContent при изменении языка
    const handleLanguageChange = () => {
      fetchHeaderContent();
    };

    i18n.on('languageChanged', handleLanguageChange);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [token, i18n]);

  // Значения контекста
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
    headerContent,
    isLoading, // Добавляем isLoading в контекст
  };

  return <StoreContext.Provider value={contextValue}>{props.children}</StoreContext.Provider>;
};

export default StoreContextProvider;
