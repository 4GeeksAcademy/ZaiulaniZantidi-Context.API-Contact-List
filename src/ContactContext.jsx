import React, { useState, useEffect, createContext } from 'react';

export const ContactContext = createContext();

export const ContactProvider = ({ children }) => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = 'https://dummyjson.com/users';

  const displayMessage = (message, type = 'info') => {
    let messageBox = document.getElementById('messageBox');
    if (!messageBox) {
      messageBox = document.createElement('div');
      messageBox.id = 'messageBox';
      document.body.appendChild(messageBox);
    }
    messageBox.textContent = message;
    messageBox.className = `fixed bottom-4 left-1/2 -translate-x-1/2 p-4 rounded-lg shadow-lg z-50 transition-opacity duration-300 ${
      type === 'success' ? 'bg-emerald-500' : type === 'error' ? 'bg-red-500' : 'bg-gray-700'
    } text-white opacity-100`;
    setTimeout(() => {
      messageBox.style.opacity = '0';
    }, 3000);
  };

  const fetchContacts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}?limit=10`);
      if (!response.ok) {
        throw new Error(`Failed to fetch contacts: ${response.statusText}`);
      }
      const data = await response.json();
      setContacts(data.users);
      displayMessage('Contacts fetched successfully!', 'success');
    } catch (err) {
      console.error("Error fetching contacts:", err);
      setError('Failed to load contacts. Please try again.');
      displayMessage('Failed to load contacts.', 'error');
    } finally {
      setLoading(false);
    }
  };


  const addContact = async (newContact) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newContact),
      });

      if (!response.ok) {
        throw new Error(`Failed to add contact: ${response.statusText}`);
      }
      const createdContact = await response.json();
      setContacts(prevContacts => [createdContact, ...prevContacts]);
      displayMessage('Contact added successfully!', 'success');
      return true;
    } catch (err) {
      console.error("Error adding contact:", err);
      setError('Failed to add new contact. Please try again.');
      displayMessage('Failed to add new contact.', 'error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateContact = async (contactId, updatedFields) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/${contactId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields),
      });

      if (!response.ok) {
        throw new Error(`Failed to update contact: ${response.statusText}`);
      }
      const updatedContact = await response.json();
      setContacts(prevContacts => prevContacts.map(c =>
        c.id === contactId ? { ...c, ...updatedContact } : c
      ));
      displayMessage('Contact updated successfully!', 'success');
      return true;
    } catch (err) {
      console.error("Error updating contact:", err);
      setError('Failed to update contact. Please try again.');
      displayMessage('Failed to update contact.', 'error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteContact = async (contactId) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/${contactId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete contact: ${response.statusText}`);
      }
      setContacts(prevContacts => prevContacts.filter(c => c.id !== contactId));
      displayMessage('Contact deleted successfully!', 'success');
      return true;
    } catch (err) {
      console.error("Error deleting contact:", err);
      setError('Failed to delete contact. Please try again.');
      displayMessage('Failed to delete contact.', 'error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const contextValue = {
    contacts,
    loading,
    error,
    fetchContacts,
    addContact,
    updateContact,
    deleteContact,
  };

  return (
    <ContactContext.Provider value={contextValue}>
      {children}
    </ContactContext.Provider>
  );
};
