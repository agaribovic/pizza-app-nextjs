type OverlayProps = {
  children: React.ReactNode;
};

export const Overlay = ({ children }: OverlayProps) => (
  <div className="fixed inset-0 flex justify-center items-center bg-gray-100 bg-opacity-50 z-50">
    {children}
  </div>
);
