"use client";

import { Modal, atomOpenModals } from "@/frontend/stores/modals";
import { useAtomValue } from "jotai";
import GlobalModals from "./GlobalModals";
import ModalOnboarding from "./ModalOnboarding";

export default () => {
  const openModals = useAtomValue(atomOpenModals);

  const renderMain = () => {
    return (
      <>
        <GlobalModals />

        {openModals.includes(Modal.Onboarding) && <ModalOnboarding />}
      </>
    );
  };

  const render = () => {
    return renderMain();
  };

  return render();
};
