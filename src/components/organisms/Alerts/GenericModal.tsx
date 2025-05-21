import { Button } from "../../atoms/Button/Button";
import { Modal } from "react-bootstrap";

interface GenericModalProps {
    show: boolean;
    onHide: () => void;
    title: React.ReactNode;
    message?: React.ReactNode;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel?: () => string;
    children?: React.ReactNode;
}

const GenericModal: React.FC<GenericModalProps> = ({
    show,
    onHide,
    title,
    message,
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    onConfirm,
    onCancel,
    children,
}) => {
    return (<Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {message && <p>{message}</p>}
        {children} {/* Si necesitas contenido más personalizado */}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel || onHide}>
          {cancelText}
        </Button>
        <Button variant="primary" onClick={onConfirm}>
          {confirmText}
        </Button>
      </Modal.Footer>
    </Modal>
    );
};

export default GenericModal;