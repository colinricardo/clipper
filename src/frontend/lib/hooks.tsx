import { MutableRefObject } from "react";
// import { log } from "@frontend/lib/logger"
// import { errorToast, successToast } from "@frontend/lib/toast"
import {
  Modal,
  atomCloseModal,
  atomLastInFocusStack,
  atomOpenModal,
  atomPopFromFocusStack,
  atomPushToFocusStack,
} from "@/frontend/stores/modals";
import { useAtomValue, useSetAtom } from "jotai";
import { errorToast, successToast } from "./toast";

// NOTE: if the mutation returns a message, we use that. If it returns nothing, we show nothing.
export const hookHandler = <T extends any[], R>(
  hook: (...args: T) => Promise<R>,
  successMessage?: string,
  errorMessage?: string
) => {
  // @ts-ignore
  return async (...args: T): Promise<R> => {
    try {
      const result = await hook(...args);
      if (!result) return result;
      // @ts-ignore
      const message = result["message"];
      const messageToUse = successMessage || message;

      if (messageToUse) {
        successToast(messageToUse);
      }
      return result;
    } catch (err: any) {
      const { meta } = err;
      const { response } = meta;
      const { status } = response;

      if (status === 401) {
        errorToast("Please sign in");
      } else {
        const message = errorMessage || err.message;
        errorToast(message);
        throw err;
      }
    }
  };
};

export const useOpenModal = () => {
  const pushToFocusStack = useSetAtom(atomPushToFocusStack);
  const openModal = useSetAtom(atomOpenModal);

  return (modal: Modal) => {
    // log("Opening modal", { modal });
    pushToFocusStack(document.activeElement as HTMLElement);
    openModal(modal);
  };
};

export const useCloseModal = () => {
  const closeModal = useSetAtom(atomCloseModal);
  const openModal = useOpenModal();
  const popFromFocusStack = useSetAtom(atomPopFromFocusStack);
  const lastInFocusStack = useAtomValue(atomLastInFocusStack);
  // const setCommandValue = useSetAtom(atomCommandValue);

  return (modal: Modal, openModalAfter?: Modal) => {
    // log("Closing modal", { modal });
    closeModal(modal);

    setTimeout(() => {
      lastInFocusStack?.focus();
      popFromFocusStack();

      if (openModalAfter) {
        openModal(openModalAfter);
      }
    }, 0);

    // if (modal === Modal.MainCommand) {
    // setCommandValue("");
    // }
  };
};

export const useGoDown = () => {
  return ({
    containerRef,
    containerIsFocused,
    focusedRowIndex,
    setFocusedRowIndex,
    rowCount,
  }: {
    containerRef: MutableRefObject<HTMLDivElement | null | undefined>;
    containerIsFocused: boolean;
    focusedRowIndex: number;
    setFocusedRowIndex: Function;
    rowCount: number;
  }) => {
    if (containerIsFocused) {
      containerRef.current?.blur();
      setFocusedRowIndex(0);
    } else {
      if (focusedRowIndex + 1 < rowCount) {
        setFocusedRowIndex(focusedRowIndex + 1);
      }
    }
  };
};

export const useGoUp = () => {
  return ({
    containerRef,
    containerIsFocused,
    focusedRowIndex,
    setFocusedRowIndex,
    rowCount,
  }: {
    containerRef: MutableRefObject<HTMLDivElement | null | undefined>;
    containerIsFocused: boolean;
    focusedRowIndex: number;
    setFocusedRowIndex: Function;
    rowCount: number;
  }) => {
    if (focusedRowIndex === 0) {
      setFocusedRowIndex(-1);
      containerRef.current?.focus();
    } else {
      if (focusedRowIndex - 1 >= 0) {
        setFocusedRowIndex(focusedRowIndex - 1);
      }
    }
  };
};
