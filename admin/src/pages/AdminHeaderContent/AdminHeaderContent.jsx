import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import './AdminHeaderContent.css';

const AdminHeaderContent = ({ url }) => {
  const [headerContent, setHeaderContent] = useState({
    new: { en: '', ru: '', pl: '' },
    description: { en: '', ru: '', pl: '' },
    button: { en: '', ru: '', pl: '' },
    backgroundUrl: '', // URL фона
  });
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetch(`${url}/api/header`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.data) {
          setHeaderContent(data.data); // Убедитесь, что data.data существует
        }
      })
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

  const handleBackgroundChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleImageUpload = async () => {
    if (!imageFile) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result.split(',')[1];

      try {
        const response = await fetch(`${url}/api/header/upload-image`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64: base64String }),
        });

        if (!response.ok) throw new Error('Failed to upload image');

        const data = await response.json();
        setHeaderContent((prevContent) => ({
          ...prevContent,
          backgroundUrl: data.imageUrl,
        }));

        toast.success('Image uploaded successfully');
      } catch (error) {
        toast.error(error.message);
      }
    };
    reader.readAsDataURL(imageFile);
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

  // Проверки, чтобы данные существовали перед их использованием
  const getLanguageContent = (field) =>
    headerContent[field] && headerContent[field][selectedLanguage]
      ? headerContent[field][selectedLanguage]
      : '';

  return (
    <div className="admin-header-content">
      <h2>Edit Header Content</h2>

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

      <div className="field-group">
        <label>Header Title</label>
        <input
          type="text"
          value={getLanguageContent('new')}
          onChange={(e) => handleInputChange(e, 'new')}
          placeholder="Enter Header Title"
        />
      </div>

      <div className="field-group">
        <label>Description</label>
        <input
          type="text"
          value={getLanguageContent('description')}
          onChange={(e) => handleInputChange(e, 'description')}
          placeholder="Enter Description"
        />
      </div>

      <div className="field-group">
        <label>Button Text</label>
        <input
          type="text"
          value={getLanguageContent('button')}
          onChange={(e) => handleInputChange(e, 'button')}
          placeholder="Enter Button Text"
        />
      </div>

      <div className="field-group">
        <label>Background Image</label>
        <input type="file" accept="image/*" onChange={handleBackgroundChange} />
        <button onClick={handleImageUpload}>Upload Image</button>
        {headerContent.backgroundUrl && (
          <img
            src={headerContent.backgroundUrl}
            alt="Background preview"
            style={{ width: '100px', marginTop: '10px' }}
          />
        )}
      </div>

      <button className="save-button" onClick={handleSave}>
        Save
      </button>
    </div>
  );
};

export default AdminHeaderContent;
