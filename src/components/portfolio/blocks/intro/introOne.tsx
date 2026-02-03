import React from 'react';
import { Mail, Phone } from 'lucide-react';

interface IntroOneProps {
  data: { fullName?: string; title?: string; description?: string; avatar?: string; email?: string; phone?: string };
}

const IntroOne: React.FC<IntroOneProps> = ({ data }) => {
  const { fullName, title, description, avatar, email, phone } = data;

  return (
    <div className="intro-block bg-white border border-gray-200 rounded-lg p-8 shadow-sm text-center">
      {/* Avatar */}
      {avatar && (
        <div className="mb-6">
          <img
            src={avatar}
            alt={fullName}
            className="w-28 h-28 rounded-full object-cover mx-auto border-4 border-gray-100 shadow-md"
          />
        </div>
      )}

      {/* Name */}
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{fullName || 'Your Name'}</h1>

      {/* Title */}
      {title && <p className="text-lg text-blue-600 font-semibold mb-4">{title}</p>}

      {/* Description */}
      {description && (
        <p className="text-gray-700 text-sm leading-relaxed mb-6 max-w-2xl mx-auto">
          {description}
        </p>
      )}

      {/* Contact Info */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-gray-600">
        {email && (
          <a href={`mailto:${email}`} className="flex items-center gap-2 hover:text-blue-600 transition-colors">
            <Mail size={16} />
            {email}
          </a>
        )}
        {phone && (
          <a href={`tel:${phone}`} className="flex items-center gap-2 hover:text-blue-600 transition-colors">
            <Phone size={16} />
            {phone}
          </a>
        )}
      </div>
    </div>
  );
};

export default IntroOne;
