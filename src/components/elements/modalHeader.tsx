export const ModalHeader = ({ title }: { title: string }) => {
  return (
    <div className="text-lg-bold text-brand-800 flex items-center justify-center">
      {title} <div className="bg-info-300 ml-2 h-[1px] flex-1" />
    </div>
  );
};
