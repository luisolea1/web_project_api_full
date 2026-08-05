

export default function Popup (props) {

const { title, children, onClose } = props;

return (
    <div className="popup popup_opened">
    <div
        className={`popup__content ${
        !title ? "popup__content_image" : ""
}`}>
        <button
        aria-label="Close modal"
        className="popup__close"
        type="button"
        onClick={onClose}
        ></button>

        {title && <h3 className="popup__title">{title}</h3>}

        {children}
    </div>
    </div>
);
}

