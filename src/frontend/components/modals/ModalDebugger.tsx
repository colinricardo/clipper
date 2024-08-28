import { atomActiveRef } from "@/frontend/stores/focus";
import {
  atomModalFocusStack,
  atomOpenModals,
  Modal,
} from "@/frontend/stores/modals";
import { useAtom, useAtomValue } from "jotai";
import { X } from "lucide-react";

export default () => {
  const [activeModals, setActiveModals] = useAtom(atomOpenModals);
  const focusStack = useAtomValue(atomModalFocusStack);
  const activeRef = useAtomValue(atomActiveRef);

  const renderActives = () => {
    return (
      <>
        <div></div>
      </>
    );
  };

  const renderModals = () => {
    return <div>Modals: {JSON.stringify(activeModals)}</div>;
  };

  const renderFocus = () => {
    return (
      <div>
        Focus stack:{" "}
        {focusStack.map((el) => (el.id ? el.id : "no-id")).join(", ")}
      </div>
    );
  };

  const renderActiveRef = () => {
    return (
      <div>
        Active ref:{" "}
        {activeRef ? (activeRef.id ? activeRef.id : "no-id") : "no-ref"}
      </div>
    );
  };

  const closeModal = () => {
    setActiveModals(activeModals.filter((modal) => modal !== Modal.Debugger));
  };

  const renderMain = () => {
    return (
      <div
        className="absolute bottom-0 left-0 flex items-center w-screen h-[30vh] text-center text-white bg-yellow-500 z-[999] flex-col space-y-2 p-2
       overflow-scroll py-8 "
      >
        <button
          onClick={closeModal}
          className="absolute top-2 right-2 text-white hover:text-gray-200"
          aria-label="Close debugger"
        >
          <X className="h-6 w-6" />
        </button>
        {renderModals()}
        {renderFocus()}
        {renderActiveRef()}
        {renderActives()}
      </div>
    );
  };

  const render = () => {
    return renderMain();
  };

  return render();
};
