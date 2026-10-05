import { useEffect } from "react";
import { useLocale } from "../context/LocaleContext";
import "./ConfirmModal.css";

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
  type = "danger", // "danger" | "warning" | "info"
  icon = "⚠️",
}) {
  const { t } = useLocale();

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="nova-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="nova-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className={`nova-modal-icon-badge ${type}`}>
          <span>{icon}</span>
        </div>

        <h3 className="nova-modal-title">{title || t("confirm")}</h3>
        <p className="nova-modal-message">{message || t("confirm_message_default")}</p>

        <div className="nova-modal-actions">
          <button
            type="button"
            className="nova-modal-btn nova-modal-btn-cancel"
            onClick={onClose}
          >
            {cancelText || t("form_cancel")}
          </button>
          <button
            type="button"
            className={`nova-modal-btn nova-modal-btn-confirm ${type}`}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmText || t("confirm")}
          </button>
        </div>
      </div>
    </div>
  );
}
