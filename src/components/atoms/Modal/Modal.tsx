import React from 'react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  centered?: boolean;
  backdrop?: boolean | 'static';
  keyboard?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const Modal: React.FC<ModalProps> & {
  Header: React.FC<ModalHeaderProps>;
  Body: React.FC<ModalBodyProps>;
  Footer: React.FC<ModalFooterProps>;
} = ({
  isOpen,
  onClose,
  title,
  size = 'md',
  centered = false,
  backdrop = true,
  keyboard = true,
  children,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'modal-sm',
    md: '',
    lg: 'modal-lg',
    xl: 'modal-xl'
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && backdrop !== 'static' && backdrop) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && keyboard) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={`modal fade show ${className}`}
      style={{ display: 'block' }}
      tabIndex={-1}
      role="dialog"
      aria-hidden="false"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
    >
      <div className={`modal-dialog ${sizeClasses[size]} ${centered ? 'modal-dialog-centered' : ''}`}>
        <div className="modal-content">
          {title && (
            <Modal.Header onClose={onClose}>
              {title}
            </Modal.Header>
          )}
          {children}
        </div>
      </div>
    </div>
  );
};

export interface ModalHeaderProps {
  children: React.ReactNode;
  onClose?: () => void;
  closeButton?: boolean;
  className?: string;
}

Modal.Header = ({ children, onClose, closeButton = true, className = '' }) => (
  <div className={`modal-header ${className}`}>
    <h5 className="modal-title">{children}</h5>
    {closeButton && onClose && (
      <button
        type="button"
        className="btn-close"
        aria-label="Close"
        onClick={onClose}
      />
    )}
  </div>
);

export interface ModalBodyProps {
  children: React.ReactNode;
  className?: string;
}

Modal.Body = ({ children, className = '' }) => (
  <div className={`modal-body ${className}`}>
    {children}
  </div>
);

export interface ModalFooterProps {
  children: React.ReactNode;
  className?: string;
}

Modal.Footer = ({ children, className = '' }) => (
  <div className={`modal-footer ${className}`}>
    {children}
  </div>
);
