import React, { useState, useRef, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const ActionContextMenu = ({ 
  actions = [],
  trigger = null,
  position = 'bottom-right',
  className = '',
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) &&
          triggerRef.current && !triggerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleActionClick = (action) => {
    if (action.disabled) return;
    
    setIsOpen(false);
    action.onClick?.();
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'bottom-left':
        return 'top-full left-0 mt-2';
      case 'bottom-right':
        return 'top-full right-0 mt-2';
      case 'top-left':
        return 'bottom-full left-0 mb-2';
      case 'top-right':
        return 'bottom-full right-0 mb-2';
      default:
        return 'top-full right-0 mt-2';
    }
  };

  const defaultTrigger = (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setIsOpen(!isOpen)}
      disabled={disabled}
      className="text-text-secondary hover:text-text-primary"
    >
      <Icon name="MoreVertical" size={16} />
    </Button>
  );

  const renderAction = (action, index) => {
    if (action.type === 'separator') {
      return <div key={index} className="border-t border-border my-1" />;
    }

    const isDestructive = action.variant === 'destructive' || action.variant === 'danger';
    const isDisabled = action.disabled;

    return (
      <button
        key={index}
        onClick={() => handleActionClick(action)}
        disabled={isDisabled}
        className={`
          w-full flex items-center px-3 py-2 text-sm text-left
          transition-colors duration-200 rounded-md
          ${isDisabled 
            ? 'text-text-secondary/50 cursor-not-allowed' 
            : isDestructive
            ? 'text-error hover:bg-error/10 hover:text-error' :'text-text-secondary hover:text-text-primary hover:bg-muted'
          }
        `}
      >
        {action.icon && (
          <Icon 
            name={action.icon} 
            size={16} 
            className="mr-3 flex-shrink-0" 
          />
        )}
        <span className="flex-1">{action.label}</span>
        {action.shortcut && (
          <span className="text-xs text-text-secondary/70 ml-2 font-mono">
            {action.shortcut}
          </span>
        )}
        {action.badge && (
          <span className={`
            ml-2 px-1.5 py-0.5 text-xs rounded-full
            ${action.badge.variant === 'success' ? 'bg-success/20 text-success' :
              action.badge.variant === 'warning' ? 'bg-warning/20 text-warning' :
              action.badge.variant === 'error'? 'bg-error/20 text-error' : 'bg-muted text-text-secondary'
            }
          `}>
            {action.badge.text}
          </span>
        )}
      </button>
    );
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <div ref={triggerRef}>
        {trigger ? (
          React.cloneElement(trigger, {
            onClick: () => setIsOpen(!isOpen),
            disabled: disabled
          })
        ) : (
          defaultTrigger
        )}
      </div>

      {isOpen && (
        <div 
          ref={menuRef}
          className={`
            absolute z-50 min-w-48 bg-popover border border-border rounded-lg 
            shadow-elevated py-1 ${getPositionClasses()}
          `}
        >
          {actions.map((action, index) => renderAction(action, index))}
        </div>
      )}
    </div>
  );
};

export default ActionContextMenu;