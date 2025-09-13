import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Api from '../Utils/Api';
import Header from '../components/Header';
import Footer from '../components/Footer';

const QuestionDetail = () => {
  const { id } = useParams(); // get question id from URL
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [newAnswer, setNewAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Fetch answers for the question using the nested endpoint to avoid 404s
  const fetchAnswers = useCallback(async () => {
    try {
      const res = await Api.get(`/questions/${id}/answers`);
      const aData = res.data;
      const list = Array.isArray(aData)
        ? aData
        : Array.isArray(aData?.items)
        ? aData.items
        : aData?.item
        ? [aData.item]
        : [];
      setAnswers(list);
    } catch (err) {
      const status = err?.response?.status;
      if (status === 401) {
        // Interceptor will try refresh; if still 401 here, redirect to login
        navigate('/login');
        return;
      }
      console.error('Error fetching answers:', err);
      setAnswers([]);
    }
  }, [id, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

    // Fetch question details
        const qRes = await Api.get(`/questions/${id}`);
        setQuestion(qRes.data?.item || qRes.data || null);

    await fetchAnswers();

      } catch (err) {
        console.error('Error fetching question detail:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, fetchAnswers]);

  // Load current user once
  useEffect(() => {
    const raw = localStorage.getItem('user');
    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch {
        console.warn('Failed to parse user from storage');
      }
    }
  }, []);

  const canDeleteQuestion = user && question && (user.id === question.userid || user.id === question.userId || user.id === question.user_id);

  const handleDeleteQuestion = async () => {
    if (!canDeleteQuestion) return;
    if (!window.confirm('Are you sure you want to delete this question? This cannot be undone.')) return;
    try {
      setDeletingId(`q-${id}`);
      await Api.delete(`/questions/${id}`);
      navigate('/home');
    } catch (err) {
      console.error('Failed to delete question:', err);
    } finally {
      setDeletingId(null);
    }
  };

  const canDeleteAnswer = (ans) => {
    if (!user) return false;
    // answers table uses userid for owner
    return user.id === ans.userid || user.id === ans.userId || user.id === ans.user_id;
  };

  const handleDeleteAnswer = async (ans) => {
    if (!canDeleteAnswer(ans)) return;
    if (!window.confirm('Delete this answer?')) return;
    try {
      setDeletingId(ans.id);
      await Api.delete(`/answers/${ans.id}`);
      await fetchAnswers();
    } catch (err) {
      console.error('Failed to delete answer:', err);
    } finally {
      setDeletingId(null);
    }
  };

  // Handle answer submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Post directly to nested endpoint supported by backend
      await Api.post(`/questions/${id}/answers`, {
        answer: newAnswer,
      });
      // After success, refetch to get normalized list
      await fetchAnswers();
      setNewAnswer('');
    } catch (err) {
      console.error('Error posting answer:', err);
    }
  };

  if (loading) {
    return <p className="text-center py-10">Loading...</p>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Question */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">{question?.title}</h1>
            <p className="text-gray-700 mb-2">{question?.description}</p>
          </div>
          {canDeleteQuestion && (
            <button
              onClick={handleDeleteQuestion}
              disabled={deletingId === `q-${id}`}
              className="self-start bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-semibold px-4 py-2 rounded-lg"
            >
              {deletingId === `q-${id}` ? 'Deleting…' : 'Delete Question'}
            </button>
          )}
        </div>

        {/* Answers */}
        <h2 className="text-xl font-semibold mb-4">Answers from the community</h2>
        {answers.length === 0 ? (
          <p className="text-gray-500 mb-6">No answers yet. Be the first to answer!</p>
        ) : (
          <div className="space-y-4 mb-6">
            {answers.map((ans) => (
              <div key={ans.id || `${ans.questionid}-${Math.random()}`} className="flex items-start justify-between gap-4 border-b pb-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">👤</div>
                  <div>
                    <p className="font-medium">{ans.username || 'Anonymous'}</p>
                    <p className="text-gray-700">{ans.answer || ans.content}</p>
                  </div>
                </div>
                {canDeleteAnswer(ans) && ans.id && (
                  <button
                    onClick={() => handleDeleteAnswer(ans)}
                    disabled={deletingId === ans.id}
                    className="self-start bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-semibold px-3 py-2 rounded-lg"
                  >
                    {deletingId === ans.id ? 'Deleting…' : 'Delete'}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Answer Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={newAnswer}
            onChange={(e) => setNewAnswer(e.target.value)}
            placeholder="Your answer..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            rows="4"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg"
          >
            Post Your Answer
          </button>
        </form>
      </main>

      <Footer />
    </div>
  );
};

export default QuestionDetail;
