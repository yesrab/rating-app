import React from "react";
import ReactDOM from "react-dom";
function ModelWrapper({ toggleModal, open, children }) {
  if (!open) {
    return null;
  }
  return ReactDOM.createPortal(
    <>
      <div onClick={toggleModal} className='fixed inset-0 bg-gray-800 bg-opacity-55 z-50' />
      <dialog
        className='fixed m-0 top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 z-50 border-none rounded-lg'
        open={open}
      >
        {children}
      </dialog>
    </>,
    document.getElementById("modal"),
  );
}

export default ModelWrapper;
