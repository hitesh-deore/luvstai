import React from 'react';
import { Message, Companion } from '../types';

interface MessageBubbleProps {
  message: Message;
  companion?: Companion;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, companion }) => {
  return (
    <div className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} mb-6`}>
      <div className="flex items-start gap-3 max-w-2xl">
        {!message.isUser && companion && (
          <div className={`w-8 h-8 bg-gradient-to-br ${companion.avatar} rounded-full flex items-center justify-center flex-shrink-0`}>
            <span className="text-white text-xs font-medium">
              {companion.name.charAt(0)}
            </span>
          </div>
        )}
        
        <div className="flex flex-col">
          {!message.isUser && (
            <div className="text-xs text-slate-400 mb-1 px-1">
              {companion?.name}
            </div>
          )}
          
          <div
            className={`px-4 py-3 rounded-2xl backdrop-blur-xl ${
              message.isUser
                ? 'bg-blue-600/90 text-white rounded-br-md ml-auto'
                : 'bg-slate-800/80 text-slate-100 border border-slate-700/50 rounded-bl-md'
            } shadow-lg max-w-md`}
          >
            <p className="text-sm leading-relaxed">{message.content}</p>
          </div>
          
          <div className={`text-xs mt-1 px-1 ${
            message.isUser ? 'text-slate-400 text-right' : 'text-slate-500'
          }`}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
        
        {message.isUser && (
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-medium">You</span>
          </div>
        )}
      </div>
    </div>
  );
};