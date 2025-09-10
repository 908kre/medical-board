import React from "react";
import { createContext, useState, useRef } from "react";
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogRoot,
  DialogTrigger,
  DialogHeader,
  DialogFooter,
} from "@md/web/components/ui/dialog";
import { DialogContentProps } from "@chakra-ui/react";

export const Dialog = (props: {
  onClose?: () => void;
  isOpen?: boolean;
  minW?: string;
  trigger?: React.ReactNode;
  footer?: React.ReactNode;
  header?: React.ReactNode;
  body?: React.ReactNode;
  mode?: "loose" | "strict";
}) => {
  const { onClose, mode = "loose" } = props;
  return (
    <DialogRoot open={props.isOpen} closeOnInteractOutside={mode === "loose"}>
      {props.trigger && <DialogTrigger asChild>{props.trigger}</DialogTrigger>}
      <DialogContent>
        {mode === "loose" && <DialogCloseTrigger onClick={onClose} />}
        {props.header && <DialogHeader>{props.header}</DialogHeader>}
        {props.body && <DialogBody> {props.body} </DialogBody>}
        {props.footer && <DialogFooter>{props.footer}</DialogFooter>}
      </DialogContent>
    </DialogRoot>
  );
};
type State = {
  header?: React.ReactNode;
  body?: React.ReactNode;
  footer?: React.ReactNode;
  mode?: "loose" | "strict";
  minW?: DialogContentProps["minW"];
};

export const DialogContext = createContext<{
  open: (args: State) => void;
  close: () => void;
  portalRef?: React.RefObject<HTMLDivElement>;
}>({
  open: () => {},
  close: () => {},
});

export const DialogProvider = ({ children }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [state, setState] = useState<State>({});
  const mode = state.mode || "strict";
  const open = (x: State) => {
    setState(x);
    setIsOpen(true);
  };
  const portalRef = useRef<HTMLDivElement>(null);
  const close = () => setIsOpen(false);
  return (
    <DialogContext.Provider
      value={{
        open,
        close,
        portalRef,
      }}
    >
      <DialogRoot
        lazyMount={true}
        open={isOpen}
        closeOnInteractOutside={mode === "loose"}
        closeOnEscape={mode === "loose"}
        onOpenChange={(e) => setIsOpen(e.open)}
      >
        <DialogContent minW={state.minW ?? "80vw"} ref={portalRef}>
          {mode === "loose" && <DialogCloseTrigger />}
          {state.header && <DialogHeader>{state.header}</DialogHeader>}
          {state.body && <DialogBody p={4}> {state.body} </DialogBody>}
          {state.footer && <DialogFooter>{state.footer}</DialogFooter>}
        </DialogContent>
      </DialogRoot>
      {children}
    </DialogContext.Provider>
  );
};
