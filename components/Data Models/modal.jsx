import clsx from "clsx";

const { default: useModalStore } = require("@/store/modalStore");
const { X } = require("lucide-react");


const Modal = () =>{
  const { isOpen, modalContent, closeModal } = useModalStore();

  if(!isOpen) return null;

  return(
    <div className="z-50 absolute top-0 left-0 bg-slate-950 w-screen h-screen flex justify-center items-center bg-opacity-60 overflow-auto">
      <div className="modal-container w-[80vw] bg-white flex flex-col gap-8 p-8 md:p-16 lg:p-12 relative border-t-4 border-t-blue-400 h-fit max-h-[90vh] overflow-auto">
        <X onClick={closeModal} className="absolute top-4 right-4" />
        {modalContent}
      </div>
    </div>

  )
}

export default Modal;

