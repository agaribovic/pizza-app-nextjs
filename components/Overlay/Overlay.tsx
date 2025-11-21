import { FC, ReactNode } from "react";

type OverlayProps = {
  children: ReactNode;
};

export const Overlay: FC<OverlayProps> = ({ children }) => {
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 flex justify-center items-center bg-gray-100 bg-opacity-50 z-50"
    >
      {children}
    </div>
  );
};
