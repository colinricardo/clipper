"use client";

import { Button } from "@/components/ui/button";
import { useOpenModal } from "@/frontend/lib/hooks";
import { Modal } from "@/frontend/stores/modals";

export default () => {
  const openModal = useOpenModal();

  const renderButton = () => (
    <div className="w-full">
      <Button
        variant="secondary"
        className="w-full"
        onClick={() => openModal(Modal.Onboarding)}
      >
        Onboarding
      </Button>
    </div>
  );

  return <div>{renderButton()}</div>;
};
