import React, { useState, useEffect } from "react";
import { User, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import Api from "../Utils/Api.js"; 

const Home = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState('');

  useEffect(() => {
     const user = JSON.parse(localStorage.getItem('user')); // parse the stored user object
  if (user && user.username) {
    setUserName(user.username);
  }
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const response = await Api.get("/questions");
        const data = response.data;
        const items = Array.isArray(data)
          ? data
          : Array.isArray(data?.items)
          ? data.items
          : data?.item
          ? [data.item]
          : [];
        setQuestions(items);
      } catch (err) {
        console.error("Error fetching questions:", err);
        setError(
          err.response?.data?.message ||
            "Failed to load questions. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header isLoggedIn={true} />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Top bar */}
          <div className="flex justify-between items-center mb-8">
            <Link to="/questions" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              Ask Question
            </Link>
            <div className="text-gray-700 text-lg">
              Welcome: <span className="font-semibold">{userName || "Guest"}</span>
            </div>
          </div>

          {/* Questions List */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Questions</h2>
            </div>

            {loading ? (
              <div className="px-6 py-12 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading questions...</p>
              </div>
            ) : error ? (
              <div className="px-6 py-12 text-center">
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Retry
                </button>
              </div>
            ) : questions.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <p className="text-gray-600">
                  No questions found. Be the first to ask a question!
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {questions.map((item) => (
                  <Link
                    key={item.id}
                    to={`/questions/${item.id}`}
                    className="block px-6 py-4 hover:bg-gray-50 transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-gray-600" />
                          </div>
                        </div>
                        <div>
                          <p className="text-gray-900 font-medium mb-1">
                            {item.question || item.title}
                          </p>
                          <p className="text-gray-600 text-sm">
                            {item.username || item.author}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
