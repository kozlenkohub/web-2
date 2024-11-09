import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const AdminHeaderContent = ({ url }) => {
  const [headerContent, setHeaderContent] = useState({ new: '', description: '', button: '' });

  useEffect(() => {
    fetch(`${url}/api/headerContent`)
      .then((res) => {
        if (!res.ok) throw new Error('Error fetching header content');
        return res.json();
      })
      .then((data) => setHeaderContent(data))
      .catch((error) => toast.error(error.message));
  }, [url]);

  const handleUpdate = async () => {
    try {
      const response = await fetch(`${url}/api/headerContent/update`, {
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
    <div>
      <h2>Edit Header Content</h2>
      <input
        type="text"
        value={headerContent.new}
        onChange={(e) => setHeaderContent({ ...headerContent, new: e.target.value })}
        placeholder="Header Title"
      />
      <input
        type="text"
        value={headerContent.description}
        onChange={(e) => setHeaderContent({ ...headerContent, description: e.target.value })}
        placeholder="Description"
      />
      <input
        type="text"
        value={headerContent.button}
        onChange={(e) => setHeaderContent({ ...headerContent, button: e.target.value })}
        placeholder="Button Text"
      />
      <button onClick={handleUpdate}>Save</button>
    </div>
  );
};

export default AdminHeaderContent;
