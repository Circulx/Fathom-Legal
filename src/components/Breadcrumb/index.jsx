import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

const Breadcrumb = ({ items, className = "" }) => {
  return (
    <nav className={`flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm ${className}`}>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-white/80 flex-shrink-0" />
          )}
          {item.href ? (
            <Link
              href={item.href}
              className="text-white/90 hover:text-white transition-colors duration-200 truncate max-w-[120px] sm:max-w-none"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-white font-medium truncate max-w-[120px] sm:max-w-none">
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;
