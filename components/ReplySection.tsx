import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';

interface ReplySectionProps {
  onSendReply: (text: string) => void;
}

const ReplySection: React.FC<ReplySectionProps> = ({ onSendReply }) => {
  const [inputValue, setInputValue] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    setIsSending(true);

    try {
      // Send to Formspree
      await fetch('https://formspree.io/f/xeelzdel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputValue,
          timestamp: new Date().toLocaleString()
        })
      });

      // Save to localStorage as backup
      localStorage.setItem('purvaReply', inputValue);
      localStorage.setItem('replyTimestamp', new Date().toISOString());

      // Call callback
      onSendReply(inputValue);

      // Mark as submitted
      setIsSubmitted(true);

      // Close after 1.5 seconds
      setTimeout(() => {
        window.close();
      }, 1500);
    } catch (error) {
      console.error('Error sending reply:', error);
      alert('Failed to send reply. Please try again.');
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20, duration: 0.6 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-pink-200"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 px-6 py-4">
          <h3 className="text-white font-serif text-lg italic">Write Your Reply 💕</h3>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {isSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <p className="text-4xl mb-3">🎉💕✨</p>
              <p className="text-purple-600 font-bold text-2xl">Thank You! 🥰</p>
              <p className="text-gray-600 text-sm mt-3">Your beautiful message has been received! 💌</p>
              <p className="text-gray-500 text-xs mt-3 animate-pulse">Closing in a moment...</p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-700 text-center">Write your reply and click Send</p>
              
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your reply... 💕"
                className="w-full px-4 py-3 border-2 border-pink-300 rounded-lg focus:outline-none focus:border-purple-500 focus:bg-pink-50 transition-colors resize-none h-32"
                autoFocus
              />

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isSending}
                className={`w-full py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                  inputValue.trim() && !isSending
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg hover:shadow-[0_0_20px_rgba(236,72,153,0.5)]'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Send size={18} />
                {isSending ? 'Sending...' : 'Send Reply'}
              </motion.button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ReplySection;
