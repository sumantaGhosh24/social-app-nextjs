import {ReactNode} from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {ScrollArea} from "./ui/scroll-area";

interface DialogProviderProps {
  trigger: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
}

const DialogProvider = ({
  trigger,
  title,
  description,
  children,
}: DialogProviderProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">{children}</ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default DialogProvider;
