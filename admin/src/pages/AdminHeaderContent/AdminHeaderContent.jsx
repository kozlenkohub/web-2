import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import './AdminHeaderContent.css';

const AdminHeaderContent = ({ url }) => {
  const [headerContent, setHeaderContent] = useState({
    new: { en: '', ru: '', pl: '' },
    description: { en: '', ru: '', pl: '' },
    button: { en: '', ru: '', pl: '' },
  });

  useEffect(() => {
    fetch(`${url}/api/header`)
      .then((res) => res.json())
      .then((data) => setHeaderContent(data))
      .catch((error) => toast.error(error.message));
  }, [url]);

  const handleInputChange = (e, field, lang) => {
    const value = e.target.value;
    setHeaderContent((prevContent) => ({
      ...prevContent,
      [field]: {
        ...prevContent[field],
        [lang]: value,
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

      {['new', 'description', 'button'].map((field) => (
        <div key={field} className="field-group">
          <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
          {['en', 'ru', 'pl'].map((lang) => (
            <input
              key={lang}
              type="text"
              value={headerContent[field][lang]}
              onChange={(e) => handleInputChange(e, field, lang)}
              placeholder={`${field.charAt(0).toUpperCase() + field.slice(1)} (${lang})`}
            />
          ))}
        </div>
      ))}

      <button className="save-button" onClick={handleSave}>
        Save
      </button>
    </div>
  );
};

export default AdminHeaderContent;
