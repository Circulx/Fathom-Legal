import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

const Breadcrumb = ({ items, className = "" }) => {
  return (
    <nav className={`flex items-center space-x-2 text-sm ${className}`}>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <ChevronRight className="w-4 h-4 text-white/80" />
          )}
          {item.href ? (
            <Link
              href={item.href}
              className="text-white/90 hover:text-white transition-colors duration-200"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-white font-medium">
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;
