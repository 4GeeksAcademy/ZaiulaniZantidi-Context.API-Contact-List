import { Routes, Route } from 'react-router-dom';
import ContactList from './ContactList';
import AddEditContactForm from './AddEditContactForm';



const App = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8 flex justify-center items-start font-inter">
      <Routes>
        <Route path="/" element={<ContactList />} />
        <Route path="/add" element={<AddEditContactForm />} />
        <Route path="/edit/:id" element={<AddEditContactForm />} />
      </Routes>
    </div>
  );
};

export default App;
