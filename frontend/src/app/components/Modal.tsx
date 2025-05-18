import React from "react";

interface ModalProps {
  show: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: "error" | "success" | "info";
}

const Modal: React.FC<ModalProps> = ({ show, onClose, title, message, type = "info" }) => {
  if (!show) return null;

  const getColor = () => {
    switch (type) {
      case "error":
        return "bg-red-100 text-red-800";
      case "success":
        return "bg-green-100 text-green-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-opacity-40 z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-96">
        <h2 className={`text-lg font-semibold mb-3 ${getColor()}`}>{title}</h2>
        <p className="text-gray-700">{message}</p>
        <div className="mt-4 text-right">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={onClose}
          >
            Okay
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
