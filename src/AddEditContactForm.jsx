import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ContactContext } from './ContactContext';
import './AddEditContactForm.css'; 

const AddEditContactForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const { contacts, addContact, updateContact, loading } = useContext(ContactContext);

  const isEditing = !!id;

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    if (isEditing && contacts.length > 0) {
      const contactToEdit = contacts.find(c => c.id === parseInt(id));
      if (contactToEdit) {
        setFormData({
          firstName: contactToEdit.firstName || '',
          lastName: contactToEdit.lastName || '',
          email: contactToEdit.email || '',
          phone: contactToEdit.phone || '',
          address: contactToEdit.address?.address || '',
        });
      }
    }
  }, [isEditing, id, contacts]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let success = false;
    
    const requiredFields = ['firstName', 'lastName', 'email', 'phone'];
    const hasEmptyField = requiredFields.some(field => !formData[field].trim());
    if (hasEmptyField) {
      const messageBox = document.getElementById('messageBox');
      if (messageBox) {
        messageBox.textContent = "All fields are required.";
        messageBox.className = "message-box error visible";
        setTimeout(() => { messageBox.classList.remove('visible'); }, 3000);
      }
      return;
    }

    const contactPayload = {
      ...formData,
      address: { address: formData.address, city: 'Anytown' },
    };

    if (isEditing) {
      success = await updateContact(parseInt(id), contactPayload);
    } else {
      success = await addContact(contactPayload);
    }

    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="form-container">
      <div id="messageBox" className="message-box"></div>
      <h2 className="form-title">
        {isEditing ? 'Edit Contact' : 'Add a New Contact'}
      </h2>
      <form onSubmit={handleSubmit} className="form-fields">
        <div className="form-field-grid">
          <div className="form-field">
            <label htmlFor="firstName" className="form-label">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="form-input"
              placeholder="e.g., Mike"
            />
          </div>
          <div className="form-field">
            <label htmlFor="lastName" className="form-label">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="form-input"
              placeholder="e.g., Anamendolla"
            />
          </div>
        </div>
        <div className="form-field">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-input"
            placeholder="e.g., mike.ana@example.com"
          />
        </div>
        <div className="form-field">
          <label htmlFor="phone" className="form-label">Phone</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="form-input"
            placeholder="e.g., (870) 288-4149"
          />
        </div>
        <div className="form-field">
          <label htmlFor="address" className="form-label">Address</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="form-input"
            placeholder="e.g., 5842 Hillcrest Rd"
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="cancel-button"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="submit-button"
          >
            {loading ? 'Submitting...' : isEditing ? 'Update Contact' : 'Save Contact'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEditContactForm;
