import React, { useState } from 'react';
import { FaCommentMedical, FaTimes, FaPaperPlane } from 'react-icons/fa';

const HealthChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      text: "Hello! I'm your AI health assistant. Ask me general health questions.",
      sender: 'bot'
    }
  ]);
  const [loading, setLoading] = useState(false);

  // Local cache for common health questions
  const healthResponses = {
    "headache": "Headaches can have many causes including stress, dehydration, or eyestrain. Drink water and rest. If severe or persistent, consult a doctor.",
    "fever": "Fever is often a sign of infection. Rest and stay hydrated. If temperature exceeds 103°F (39.4°C) or lasts more than 3 days, seek medical attention.",
    "cough": "Coughs may be due to colds, allergies, or irritants. If it persists beyond 2 weeks or is accompanied by fever, see a doctor.",
    "pain": "For persistent or severe pain, consult a healthcare professional. Over-the-counter pain relievers may help temporarily but shouldn't replace medical advice.",
    "default": "For accurate health information, please consult a licensed medical professional. I can only provide general wellness suggestions."
  };

  const getAIResponse = async (userInput) => {
    try {
      // First check local cache
      const lowerInput = userInput.toLowerCase();
      for (const [keyword, response] of Object.entries(healthResponses)) {
        if (lowerInput.includes(keyword)) {
          return response;
        }
      }

      // If no cached response, try API
      const response = await fetch("https://api.deepinfra.com/v1/openai/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: `You are a medical assistant. Provide:
              1. General health information only
              2. No diagnoses
              3. Always recommend consulting a doctor
              4. Current date: ${new Date().toLocaleDateString()}
              5. Response must be under 2 sentences`
            },
            { role: "user", content: userInput }
          ],
          max_tokens: 100
        })
      });

      if (!response.ok) throw new Error("API request failed");
      
      const data = await response.json();
      return data.choices[0].message.content || healthResponses.default;

    } catch (error) {
      console.log("Using fallback response due to error:", error);
      return healthResponses.default;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    setMessages(prev => [...prev, { text: input, sender: 'user' }]);
    setInput('');
    setLoading(true);

    const aiResponse = await getAIResponse(input);
    
    setMessages(prev => [
      ...prev,
      { 
        text: aiResponse,
        sender: 'bot',
        disclaimer: "Remember: This is general information only. Consult a healthcare professional for medical advice."
      }
    ]);
    setLoading(false);
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 1000
    }}>
      {/* Floating Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: '#f44336',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <FaCommentMedical size={24} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div style={{
          width: '320px',
          height: '400px',
          background: 'white',
          borderRadius: '10px',
          boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Header */}
          <div style={{
            padding: '15px',
            background: '#4CAF50',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h3 style={{ margin: 0 }}>Health Assistant</h3>
            <button 
              onClick={() => setIsOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              <FaTimes />
            </button>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            padding: '15px',
            overflowY: 'auto',
            background: '#f9f9f9'
          }}>
            {messages.map((msg, i) => (
              <div 
                key={i} 
                style={{
                  marginBottom: '15px',
                  maxWidth: '80%',
                  padding: '10px 15px',
                  borderRadius: '18px',
                  background: msg.sender === 'user' ? '#e3f2fd' : '#f1f1f1',
                  marginLeft: msg.sender === 'user' ? 'auto' : '0',
                  borderBottomRightRadius: msg.sender === 'user' ? '5px' : '18px',
                  borderBottomLeftRadius: msg.sender === 'user' ? '18px' : '5px'
                }}
              >
                <div>{msg.text}</div>
                {msg.disclaimer && (
                  <div style={{
                    fontSize: '12px',
                    color: '#666',
                    marginTop: '5px',
                    fontStyle: 'italic'
                  }}>
                    {msg.disclaimer}
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div style={{
                marginBottom: '15px',
                padding: '10px 15px',
                background: '#f1f1f1',
                borderRadius: '18px',
                width: 'fit-content'
              }}>
                <div style={{ display: 'flex' }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    background: '#999',
                    borderRadius: '50%',
                    margin: '0 2px',
                    animation: 'bounce 1.4s infinite ease-in-out'
                  }}></div>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    background: '#999',
                    borderRadius: '50%',
                    margin: '0 2px',
                    animation: 'bounce 1.4s infinite ease-in-out',
                    animationDelay: '0.2s'
                  }}></div>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    background: '#999',
                    borderRadius: '50%',
                    margin: '0 2px',
                    animation: 'bounce 1.4s infinite ease-in-out',
                    animationDelay: '0.4s'
                  }}></div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form 
            onSubmit={handleSubmit}
            style={{
              padding: '10px',
              borderTop: '1px solid #eee',
              display: 'flex'
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a health question..."
              disabled={loading}
              style={{
                flex: 1,
                padding: '10px 15px',
                border: '1px solid #ddd',
                borderRadius: '20px',
                outline: 'none'
              }}
            />
            <button 
              type="submit" 
              disabled={loading || !input.trim()}
              style={{
                background: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                marginLeft: '10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <FaPaperPlane />
            </button>
          </form>
        </div>
      )}

      {/* Animation */}
      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  );
};

export default HealthChatbot;