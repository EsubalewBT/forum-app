import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getAccessToken } from "../Utils/tokenStore";

const HowItWorks = () => {
  const isLoggedIn = Boolean(getAccessToken());

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-6 py-12">
        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          How It Works
        </h1>
        <p className="text-gray-600 text-center mb-12">
          A quick guide to help you use the Student Forum effectively.
        </p>

        {/* Steps */}
        <div className="space-y-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-blue-600 mb-2">
              1. Create an Account
            </h2>
            <p className="text-gray-700">
              Sign up with your email and username to join the community. 
              Once registered, you can log in anytime to participate.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-blue-600 mb-2">
              2. Ask a Question
            </h2>
            <p className="text-gray-700">
              Got a doubt? Post your question with a clear title and description 
              so others can understand and help you quickly.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-blue-600 mb-2">
              3. Browse & Answer
            </h2>
            <p className="text-gray-700">
              Explore questions from other students and share your knowledge 
              by posting answers and solutions.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-blue-600 mb-2">
              4. Learn Together
            </h2>
            <p className="text-gray-700">
              The more you ask and answer, the more you learn. 
              Collaborate with peers and grow your knowledge base.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        {!isLoggedIn && (
          <div className="text-center mt-12">
            <Link to="/signup" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              Get Started
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default HowItWorks;
