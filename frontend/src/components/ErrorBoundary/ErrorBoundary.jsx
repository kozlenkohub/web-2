import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Обновление состояния так, чтобы следующий рендер показал запасной интерфейс.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Логирование ошибки в сервис
    console.error('Uncaught error:', error, errorInfo);
    // Очистка локального хранилища и состояния контекста
    localStorage.clear();
    window.location.reload(); // Перезагрузка страницы для сброса состояния
  }

  render() {
    if (this.state.hasError) {
      // Вы можете рендерить любой запасной интерфейс
      return <h1>Что-то пошло не так. Мы очищаем данные и перезагружаем страницу.</h1>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
