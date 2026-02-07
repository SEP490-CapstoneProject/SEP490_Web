import React from 'react';
import { Mail, Phone } from 'lucide-react';

interface IntroTwoProps {
  data: { fullName?: string; title?: string; description?: string; avatar?: string; email?: string; phone?: string };
}

/**
 * IntroTwo - Giới thiệu với thiết kế sidebar
 * Hiển thị thông tin cá nhân với avatar ở sidebar bên trái
 */
const IntroTwo: React.FC<IntroTwoProps> = ({ data }) => {
  const { fullName, title, description, avatar, email, phone } = data;

  return (
    <div className="intro-block flex bg-white border-b border-gray-200 last:border-b-0 mt-10">
      {/* Left Sidebar - Avatar */}
      <div className="ml-8 rounded-md border-gray-300">
        {avatar && (
          <img
            src={avatar}
            alt={fullName}
            className="w-40 h-48 object-cover"
          />
        )}
      </div>

      {/* Right Content */}
      <div className="flex-1 p-8 flex flex-col justify-center">
        {/* Name */}
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{fullName || 'Your Name'}</h1>

        {/* Title */}
        {title && (
          <p className="text-xl text-blue-500 font-semibold mb-4">{title}</p>
        )}

        {/* Description - Multiple lines */}
        {description && (
          <div className="text-gray-700 text-sm mb-6 space-y-1">
            {description.split('\n').map((line, idx) => (
              <p key={idx}>{line}</p>
            ))}
          </div>
        )}

        {/* Contact Info */}
        <div className="flex items-center gap-8 text-sm text-gray-600">
          {email && (
            <a href={`mailto:${email}`} className="flex items-center gap-2 hover:text-blue-500 transition-colors">
              <Mail size={18} />
              <span>{email}</span>
            </a>
          )}
          {phone && (
            <a href={`tel:${phone}`} className="flex items-center gap-2 hover:text-blue-500 transition-colors">
              <Phone size={18} />
              <span>{phone}</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default IntroTwo;
