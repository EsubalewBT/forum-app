import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Api from '../Utils/Api';

const AskQuestion = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Auto-hide success message after 5 seconds
  useEffect(() => {
    if (!successMessage) return;
    const timer = setTimeout(() => setSuccessMessage(''), 5000);
    return () => clearTimeout(timer);
  }, [successMessage]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Api.post('/questions', formData);
      

      
      setSuccessMessage(response.data?.message || 'Question created');
      setErrorMessage('');

     
      setFormData({ title: '', description: '' });

    
      
    } catch (err) {
      console.error('Error submitting question:', err);
      setErrorMessage(
        err?.response?.data?.message || 'Failed to submit question. Please try again.'
      );
      setSuccessMessage('');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-gray-50 py-10">
        <div className="max-w-3xl mx-auto px-6">
          {/* Instructions */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Steps to write a good question
            </h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Summarize your problem in a one-line title.</li>
              <li>Describe your problem in more detail.</li>
              <li>Explain what you tried and what you expected.</li>
              <li>Review your question and post it.</li>
            </ul>
          </div>

          {/* Ask Question Form */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Ask a public question
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />

              {/* Description */}
              <textarea
                name="description"
                rows="6"
                placeholder="Question Description..."
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
              {successMessage && (
                <p className="text-green-600 font-medium">{successMessage}</p>
              )}
              {errorMessage && (
                <p className="text-red-600 font-medium">{errorMessage}</p>
              )}
              {/* Submit Button */}
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
              >
                Post Your Question
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AskQuestion;
