import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import './AdminContact.css';

const AdminContact = ({ url }) => {
  const [contact, setContact] = useState({
    contactUs: { en: '', ru: '', pl: '' },
    phone: '',
    email: '',
    address: '',
    mapUrl: '',
  });
  const [selectedLanguage, setSelectedLanguage] = useState('pl');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetch(`${url}/api/contact`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.data) {
          setContact({
            contactUs: {
              en: data.data.contactUs?.en || '',
              ru: data.data.contactUs?.ru || '',
              pl: data.data.contactUs?.pl || '',
            },
            phone: data.data.phone || '',
            email: data.data.email || '',
            address: data.data.address || '',
            mapUrl: data.data.mapUrl || '',
          });
        }
      })
      .catch((error) => toast.error(error.message));
  }, [url]);

  const handleTitleChange = (e) => {
    const value = e.target.value;
    setContact((prev) => ({
      ...prev,
      contactUs: { ...prev.contactUs, [selectedLanguage]: value },
    }));
  };

  const handleFieldChange = (e, field) => {
    const value = e.target.value;
    setContact((prev) => ({ ...prev, [field]: value }));
  };

  // Итоговая ссылка на карту: либо своя, либо автоматически из адреса
  const resolvedMapUrl = contact.mapUrl
    ? contact.mapUrl
    : `https://maps.google.com/?q=${encodeURIComponent(contact.address)}`;

  const handleSave = async () => {
    if (contact.email && !/^\S+@\S+\.\S+$/.test(contact.email)) {
      toast.error('Некорректный email');
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch(`${url}/api/contact/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contact),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Ошибка при обновлении контактов');
      }

      toast.success('Контакты обновлены');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="admin-contact">
      <h2>Контактные данные</h2>

      <div className="field-group">
        <label>Заголовок блока (для каждого языка)</label>
        <div className="language-switcher">
          {['pl', 'en', 'ru'].map((lang) => (
            <button
              key={lang}
              type="button"
              className={`language-button ${selectedLanguage === lang ? 'active' : ''}`}
              onClick={() => setSelectedLanguage(lang)}>
              {lang.toUpperCase()}
            </button>
          ))}
        </div>
        <input
          type="text"
          value={contact.contactUs[selectedLanguage]}
          onChange={handleTitleChange}
          placeholder="SKONTAKTUJ SIĘ Z NAMI"
        />
      </div>

      <div className="field-group">
        <label>Телефон</label>
        <input
          type="tel"
          value={contact.phone}
          onChange={(e) => handleFieldChange(e, 'phone')}
          placeholder="+48-511-781-179"
        />
        <span className="field-hint">На сайте станет кликабельной ссылкой для звонка</span>
      </div>

      <div className="field-group">
        <label>Email</label>
        <input
          type="email"
          value={contact.email}
          onChange={(e) => handleFieldChange(e, 'email')}
          placeholder="gastrofaza2024@gmail.com"
        />
        <span className="field-hint">На сайте откроет почтовый клиент</span>
      </div>

      <div className="field-group">
        <label>Адрес (улица и город)</label>
        <input
          type="text"
          value={contact.address}
          onChange={(e) => handleFieldChange(e, 'address')}
          placeholder="Maślicka 160, 54-104 Wrocław"
        />
        <span className="field-hint">На сайте адрес кликабельный и открывает карту</span>
      </div>

      <div className="field-group">
        <label>Ссылка на карту (необязательно)</label>
        <input
          type="url"
          value={contact.mapUrl}
          onChange={(e) => handleFieldChange(e, 'mapUrl')}
          placeholder="Оставьте пустым — ссылка создастся автоматически из адреса"
        />
        <span className="field-hint">
          Текущая ссылка:{' '}
          <a href={resolvedMapUrl} target="_blank" rel="noreferrer">
            {resolvedMapUrl}
          </a>
        </span>
      </div>

      <div className="contact-preview">
        <h3>Предпросмотр</h3>
        <h4>{contact.contactUs[selectedLanguage] || '—'}</h4>
        <ul>
          <li>
            <a href={`tel:${contact.phone}`}>{contact.phone || '—'}</a>
          </li>
          <li>
            <a href={`mailto:${contact.email}`}>{contact.email || '—'}</a>
          </li>
          <li>
            <a href={resolvedMapUrl} target="_blank" rel="noreferrer">
              {contact.address || '—'}
            </a>
          </li>
        </ul>
      </div>

      <button className="save-button" onClick={handleSave} disabled={isSaving}>
        {isSaving ? 'Сохранение...' : 'Сохранить'}
      </button>
    </div>
  );
};

export default AdminContact;
