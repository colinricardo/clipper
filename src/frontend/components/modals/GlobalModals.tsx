import Debugger from "@/frontend/components/modals/ModalDebugger";
import { Modal, atomOpenModals } from "@/frontend/stores/modals";
import { useAtomValue } from "jotai";

export default () => {
  const openModals = useAtomValue(atomOpenModals);

  const renderMain = () => {
    return (
      <>
        {openModals.includes(Modal.Debugger) && <Debugger />}
        {/* <GlobalHotkeys /> */}
      </>
    );
  };

  const render = () => {
    return renderMain();
  };

  return render();
};
