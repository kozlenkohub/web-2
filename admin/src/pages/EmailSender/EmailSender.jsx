import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const EmailSender = ({ url }) => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState(''); // Поле для пользовательского текста
  const [isSending, setIsSending] = useState(false);

  // Функция для форматирования текста: обработка пробелов и переводов строк
  const formatText = (text) => {
    let formattedText = text.replace(/ {2,}/g, (match) =>
      ' '.repeat(match.length).replace(/ /g, '&nbsp;'),
    );

    formattedText = formattedText.replace(/\n{2,}/g, '<br><br>').replace(/\n/g, '<br>');

    // Markdown синтаксис:
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

  // Функция для оборачивания текста в HTML-шаблон
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
    // Проверка с подтверждением перед отправкой
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

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      <h2>Email Sender</h2>
      <input
        type="text"
        placeholder="Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
      />
      <textarea
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{ width: '100%', padding: '10px', height: '200px', marginBottom: '10px' }}
      />
      <button
        onClick={handleSendBulkEmail}
        disabled={isSending}
        style={{ marginRight: '10px', padding: '10px 20px' }}>
        {isSending ? 'Sending...' : 'Рассылка всем'}
      </button>
      <button onClick={handleSendTestEmail} disabled={isSending} style={{ padding: '10px 20px' }}>
        {isSending ? 'Sending...' : 'Тестовое письмо'}
      </button>
    </div>
  );
};

export default EmailSender;
