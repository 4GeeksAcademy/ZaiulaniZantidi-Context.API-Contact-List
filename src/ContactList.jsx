import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ContactContext } from './ContactContext';
import { Plus, Trash2, Pencil, Phone, Mail, MapPin } from 'lucide-react';
import './ContactList.css'; 


const ContactCard = ({ contact, onEdit, onDelete }) => (
  <div className="contact-card">
    <div className="contact-card-image-container">
      <img
        src={contact.image}
        alt={`${contact.firstName} ${contact.lastName}`}
        className="contact-card-image"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "https://placehold.co/96x96/d1d5db/4b5563?text=User";
        }}
      />
    </div>

    <div className="contact-card-details">
      <h3 className="contact-card-name">
        {contact.firstName} {contact.lastName}
      </h3>
      <div className="contact-card-info-group">
        <div className="contact-card-info-item">
          <MapPin className="contact-card-icon" />
          <span>{contact.address.address}, {contact.address.city}</span>
        </div>
        <div className="contact-card-info-item">
          <Phone className="contact-card-icon" />
          <span>{contact.phone}</span>
        </div>
        <div className="contact-card-info-item">
          <Mail className="contact-card-icon" />
          <span>{contact.email}</span>
        </div>
      </div>
    </div>

    <div className="contact-card-actions">
      <button
        onClick={() => onEdit(contact.id)}
        className="contact-card-button edit-button"
        aria-label="Edit Contact"
      >
        <Pencil className="icon" />
      </button>
      <button
        onClick={() => onDelete(contact.id)}
        className="contact-card-button delete-button"
        aria-label="Delete Contact"
      >
        <Trash2 className="icon" />
      </button>
    </div>
  </div>
);

const ContactList = () => {
  const navigate = useNavigate();
  const { contacts, loading, error, deleteContact } = useContext(ContactContext);

  const handleDelete = (contactId) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      deleteContact(contactId);
    }
  };

  const handleEdit = (contactId) => {
    navigate(`/edit/${contactId}`);
  };

  return (
    <div className="contact-list-container">
      <div className="contact-list-header">
        <h2 className="contact-list-title">My Contacts</h2>
        <button
          onClick={() => navigate('/add')}
          className="add-contact-button"
        >
          <Plus className="icon" />
          <span>Add new contact</span>
        </button>
      </div>

      {loading && <div className="contact-list-message">Loading contacts...</div>}
      {error && <div className="contact-list-message error">{error}</div>}
      {!loading && !error && contacts.length === 0 && (
        <div className="contact-list-message">
          No contacts found. Click "Add new contact" to get started!
        </div>
      )}
      {!loading && !error && contacts.length > 0 && (
        <div className="contact-cards-grid">
          {contacts.map(contact => (
            <ContactCard
              key={contact.id}
              contact={contact}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactList;
