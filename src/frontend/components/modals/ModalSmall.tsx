import PaddedContainer from "@/frontend/components/layout/PaddedContainer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/frontend/components/ui/dialog-small";
import { MODAL_SIZE_SMALL } from "@/frontend/config";
import { PropsWithChildren } from "react";

interface Props extends PropsWithChildren {
  title: string;
  isOpen: boolean;
  closeThisModal: Function;
}

export default ({ title, isOpen, closeThisModal, children }: Props) => {
  const renderMain = () => {
    return (
      <Dialog modal open={isOpen}>
        <DialogContent
          onEscapeKeyDown={(e) => {
            closeThisModal();
          }}
          className={MODAL_SIZE_SMALL}
          onInteractOutside={() => {
            closeThisModal();
          }}
        >
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <PaddedContainer>{children}</PaddedContainer>
        </DialogContent>
      </Dialog>
    );
  };

  const render = () => {
    return renderMain();
  };

  return render();
};
