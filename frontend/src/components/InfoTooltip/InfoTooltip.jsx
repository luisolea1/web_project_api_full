
function InfoTooltip({ isOpen, isSuccess, message, onClose }) {
    if (!isOpen) {
    return null;
    }

return (
    <div className="info-tooltip">
        <div className="info-tooltip__container">
        <button
        className="info-tooltip__close"
        type="button"
        aria-label="Cerrar"
        onClick={onClose}
        />

        <div
        className={`info-tooltip__icon ${
            isSuccess
            ? "info-tooltip__icon_type_success"
            : "info-tooltip__icon_type_error"
        }`}
        />

        <h2 className="info-tooltip__title">
        {message}
        </h2>
    </div>
    </div>
);
}

export default InfoTooltip;