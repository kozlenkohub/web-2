import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './EmailSender.css';

const EmailSender = ({ url }) => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [unsubscribedUsers, setUnsubscribedUsers] = useState([]);
  const [emailToUnsubscribe, setEmailToUnsubscribe] = useState('');
  const [activeTab, setActiveTab] = useState('send'); // Переключатель вкладок

  const formatText = (text) => {
    let formattedText = text.replace(/ {2,}/g, (match) =>
      ' '.repeat(match.length).replace(/ /g, '&nbsp;'),
    );

    formattedText = formattedText.replace(/\n{2,}/g, '<br><br>').replace(/\n/g, '<br>');
    formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    formattedText = formattedText.replace(/\*(.*?)\*/g, '<em>$1</em>');
    formattedText = formattedText.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    formattedText = formattedText.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    formattedText = formattedText.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    formattedText = formattedText.replace(
      /\[(.*?)\]\((.*?)\)/g,
      '<a href="$2" target="_blank">$1</a>',
    );

    formattedText = formattedText.replace(/(<br>\s*){2,}/g, '</p><p>');
    formattedText = `<p>${formattedText}</p>`;

    return formattedText;
  };

  const generateEmailTemplate = (text) => {
    const formattedText = formatText(text);
    return `
      <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
          <div style="background-color: #4CAF50; color: #ffffff; padding: 20px; text-align: center; border-top-left-radius: 8px; border-top-right-radius: 8px;">
            <h1 style="margin: 0; font-size: 24px; font-weight: bold; text-transform: uppercase;">GASTROFAZA NEWS</h1>
          </div>
          <div style="padding: 30px; color: #333333; line-height: 1.6; font-size: 16px;">
            <p style="margin: 0 0 15px 0;">${formattedText}</p>
          </div>
          <div style="background-color: #f1f1f1; color: #777777; padding: 15px; text-align: center; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
            <p style="margin: 0; font-size: 14px;">&copy; ${new Date().getFullYear()} GASTROFAZA</p>
          </div>
        </div>
      </div>
    `;
  };

  const handleSendBulkEmail = async () => {
    const confirmed = window.confirm(
      'Вы уверены, что хотите отправить это письмо всем подписчикам?',
    );
    if (!confirmed) return;

    setIsSending(true);
    try {
      const htmlContent = generateEmailTemplate(message);
      const response = await axios.post(`${url}/api/email/send-bulk-email`, {
        subject,
        htmlContent,
      });
      toast.success(response.data.message || 'Массовая рассылка успешно выполнена');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Ошибка при отправке массовой рассылки');
    } finally {
      setIsSending(false);
    }
  };

  const handleSendTestEmail = async () => {
    setIsSending(true);
    try {
      const htmlContent = generateEmailTemplate(message);
      const response = await axios.post(`${url}/api/email/send-test-email`, {
        subject,
        htmlContent,
      });
      toast.success(response.data.message || 'Тестовая рассылка успешно выполнена');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Ошибка при отправке тестовой рассылки');
    } finally {
      setIsSending(false);
    }
  };

  const fetchUnsubscribedUsers = async () => {
    try {
      const response = await axios.get(`${url}/api/email/unsubscribed-users`);
      setUnsubscribedUsers(response.data.unsubscribedUsers || []);
    } catch (error) {
      toast.error('Ошибка при получении списка пользователей');
    }
  };

  const handleUnsubscribeUser = async () => {
    if (!emailToUnsubscribe) {
      toast.error('Пожалуйста, укажите email пользователя');
      return;
    }

    setIsSending(true);
    try {
      await axios.post(`${url}/api/email/unsubscribe-email`, { email: emailToUnsubscribe });
      toast.success('Пользователь успешно отписан');
      setEmailToUnsubscribe('');
      fetchUnsubscribedUsers(); // Обновляем список пользователей
    } catch (error) {
      toast.error(error.response?.data?.message || 'Ошибка при отписке пользователя');
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    fetchUnsubscribedUsers(); // Загружаем список пользователей при монтировании компонента
  }, []);

  return (
    <div className="email-sender-container">
      <h2>Email Sender</h2>

      {/* Табы */}
      <div className="tabs">
        <div
          className={`tab ${activeTab === 'send' ? 'active' : ''}`}
          onClick={() => setActiveTab('send')}>
          Отправка писем
        </div>
        <div
          className={`tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}>
          Пользователи
        </div>
      </div>

      {activeTab === 'send' && (
        <div className="send-tab">
          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="input-field"
          />
          <textarea
            placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="input-field textarea-field"
          />
          <div className="buttons">
            <button onClick={handleSendBulkEmail} disabled={isSending}>
              {isSending ? 'Sending...' : 'Рассылка всем'}
            </button>
            <button onClick={handleSendTestEmail} disabled={isSending}>
              {isSending ? 'Sending...' : 'Тестовое письмо'}
            </button>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="users-tab">
          <h3>Не подписанные пользователи</h3>
          <ul className="user-list">
            {unsubscribedUsers.map((user) => (
              <li key={user._id}>{user.email}</li>
            ))}
          </ul>

          <h3>Отписка по email</h3>
          <input
            type="email"
            placeholder="Введите email для отписки"
            value={emailToUnsubscribe}
            onChange={(e) => setEmailToUnsubscribe(e.target.value)}
            className="input-field"
          />
          <button onClick={handleUnsubscribeUser} disabled={isSending}>
            {isSending ? 'Отписка...' : 'Отписать пользователя'}
          </button>
        </div>
      )}
    </div>
  );
};

export default EmailSender;
