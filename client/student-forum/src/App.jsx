import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login.jsx';
import SignUp from './pages/SignUp.jsx';
import Home from './pages/Home.jsx';
import AskQuestion from './pages/AskQuestion.jsx';
import QuestionDetail from './pages/QuestionDetail.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import HowItWorks from './pages/How.jsx';
function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/how" element={<HowItWorks />} />
        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path='/home' element={<Home />} />
          <Route path='/questions' element={<AskQuestion />} />
          <Route path='/questions/:id' element={<QuestionDetail />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;