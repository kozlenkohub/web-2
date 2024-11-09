import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import './AdminHeaderContent.css';

const AdminHeaderContent = ({ url }) => {
  const [headerContent, setHeaderContent] = useState({
    new: { en: '', ru: '', pl: '' },
    description: { en: '', ru: '', pl: '' },
    button: { en: '', ru: '', pl: '' },
  });
  const [selectedLanguage, setSelectedLanguage] = useState('en'); // По умолчанию английский язык

  useEffect(() => {
    fetch(`${url}/api/header`)
      .then((res) => res.json())
      .then((data) => setHeaderContent(data))
      .catch((error) => toast.error(error.message));
  }, [url]);

  const handleInputChange = (e, field) => {
    const value = e.target.value;
    setHeaderContent((prevContent) => ({
      ...prevContent,
      [field]: {
        ...prevContent[field],
        [selectedLanguage]: value,
      },
    }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`${url}/api/header/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(headerContent),
      });

      if (!response.ok) throw new Error('Error updating header content');

      toast.success('Header content updated successfully');
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="admin-header-content">
      <h2>Edit Header Content</h2>

      {/* Переключатель языка */}
      <div className="language-switcher">
        {['en', 'ru', 'pl'].map((lang) => (
          <button
            key={lang}
            className={`language-button ${selectedLanguage === lang ? 'active' : ''}`}
            onClick={() => setSelectedLanguage(lang)}>
            {lang.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Поля ввода для редактирования только выбранного языка */}
      <div className="field-group">
        <label>Header Title</label>
        <input
          type="text"
          value={headerContent.new[selectedLanguage]}
          onChange={(e) => handleInputChange(e, 'new')}
          placeholder="Enter Header Title"
        />
      </div>
      <div className="field-group">
        <label>Description</label>
        <input
          type="text"
          value={headerContent.description[selectedLanguage]}
          onChange={(e) => handleInputChange(e, 'description')}
          placeholder="Enter Description"
        />
      </div>
      <div className="field-group">
        <label>Button Text</label>
        <input
          type="text"
          value={headerContent.button[selectedLanguage]}
          onChange={(e) => handleInputChange(e, 'button')}
          placeholder="Enter Button Text"
        />
      </div>

      <button className="save-button" onClick={handleSave}>
        Save
      </button>
    </div>
  );
};

export default AdminHeaderContent;
