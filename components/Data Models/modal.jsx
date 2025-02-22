import clsx from "clsx";

const { default: useModalStore } = require("@/store/modalStore");
const { X } = require("lucide-react");


const Modal = () =>{
  const { isOpen, modalContent, closeModal } = useModalStore();

  if(!isOpen) return null;

  return(
    <div className='z-50 fixed top-0 left-0 bg-slate-950 w-screen h-screen flex justify-center items-center bg-opacity-60'>
      <div className=" bg-white shadow-md rounded-md relative p-16 w-full md:w-[80vw] lg:w-[70vw]">
        <X onClick={closeModal} className="absolute top-4 right-4"/>
        {modalContent}
      </div>
    </div>
  )
}

export default Modal;