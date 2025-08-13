import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import importantLinks from '../../../src/assets/link/importantLinks.json';

const ImportentLink = () => {
  return (
    <div className="border border-gray-300">
      {/* Header */}
      <div className="bg-green-800 text-white text-center py-2 font-semibold text-lg">
        গুরুত্বপূর্ণ লিঙ্ক সমূহ
      </div>

      {/* List */}
      <ul className="divide-y divide-gray-300">
        {importantLinks.map((link) => (
          <li key={link.id}>
            <a
              href={link.url}
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 transition-colors"
            >
              <FaCheckCircle className="text-green-600 flex-shrink-0" />
              <span className="text-gray-800">{link.title}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ImportentLink;
