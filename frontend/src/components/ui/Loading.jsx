import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

const Loading = ({ 
  size = 'default', 
  className = '', 
  text = 'Loading...',
  centered = true 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    default: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  const containerClasses = cn(
    'flex items-center gap-2',
    centered && 'justify-center',
    className
  );

  return (
    <div className={containerClasses}>
      <Loader2 className={cn(sizeClasses[size], 'animate-spin')} />
      {text && (
        <span className="text-sm text-gray-600">{text}</span>
      )}
    </div>
  );
};

export default Loading; 