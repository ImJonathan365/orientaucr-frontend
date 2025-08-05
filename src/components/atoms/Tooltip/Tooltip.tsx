import React from 'react';

export interface TooltipProps {
  text: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  trigger?: 'hover' | 'click' | 'focus';
  children: React.ReactElement;
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  text,
  placement = 'top',
  trigger = 'hover',
  children,
  className = ''
}) => {
  const [isVisible, setIsVisible] = React.useState(false);

  const showTooltip = () => setIsVisible(true);
  const hideTooltip = () => setIsVisible(false);

  const getEventHandlers = () => {
    switch (trigger) {
      case 'hover':
        return {
          onMouseEnter: showTooltip,
          onMouseLeave: hideTooltip
        };
      case 'click':
        return {
          onClick: () => setIsVisible(!isVisible)
        };
      case 'focus':
        return {
          onFocus: showTooltip,
          onBlur: hideTooltip
        };
      default:
        return {};
    }
  };

  const getTooltipClasses = () => {
    const baseClasses = 'tooltip fade';
    const visibilityClass = isVisible ? 'show' : '';
    const placementClass = `bs-tooltip-${placement}`;
    
    return `${baseClasses} ${placementClass} ${visibilityClass} ${className}`;
  };

  const getArrowClasses = () => {
    return `tooltip-arrow`;
  };

  return (
    <div className="position-relative d-inline-block">
      {React.cloneElement(children, {
        ...getEventHandlers()
      })}
      {isVisible && (
        <div
          className={getTooltipClasses()}
          role="tooltip"
          id="tooltip"
          style={{
            position: 'absolute',
            zIndex: 1070,
            ...getTooltipPosition(placement)
          }}
        >
          <div className={getArrowClasses()}></div>
          <div className="tooltip-inner">
            {text}
          </div>
        </div>
      )}
    </div>
  );
};

const getTooltipPosition = (placement: 'top' | 'bottom' | 'left' | 'right') => {
  switch (placement) {
    case 'top':
      return {
        bottom: '100%',
        left: '50%',
        transform: 'translateX(-50%)',
        marginBottom: '5px'
      };
    case 'bottom':
      return {
        top: '100%',
        left: '50%',
        transform: 'translateX(-50%)',
        marginTop: '5px'
      };
    case 'left':
      return {
        right: '100%',
        top: '50%',
        transform: 'translateY(-50%)',
        marginRight: '5px'
      };
    case 'right':
      return {
        left: '100%',
        top: '50%',
        transform: 'translateY(-50%)',
        marginLeft: '5px'
      };
    default:
      return {};
  }
};
