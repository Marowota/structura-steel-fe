import { Modal, ModalHeader, ModalSection } from "@/components/elements";
import { useGetProductDetail } from "../api/getProductsDetail";
import { PRODUCT_TYPE_OPTIONS } from "../api/getProducts";

export const ProductDetailModal = ({
  isOpen,
  onClose,
  id,
}: {
  isOpen: boolean;
  onClose: () => void;
  id?: string;
}) => {
  const { data } = useGetProductDetail({
    params: { id },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader title="Product detail"></ModalHeader>
      <div className="mt-2 flex min-w-[400px] flex-col gap-4">
        <ModalSection title="General Information">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold">Name:</span>
              <span className="text-sm">{data?.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold">Code:</span>
              <span className="text-sm">{data?.code}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold">Standard:</span>
              <span className="text-sm">{data?.standard}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-bold">Product Type:</span>
              <span className="text-sm">
                {data?.productType
                  ? PRODUCT_TYPE_OPTIONS.get(data.productType)
                  : "-"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold">Import Price:</span>
              <span className="text-sm">{data?.importPrice}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold">Export Price:</span>
              <span className="text-sm">{data?.exportPrice}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold">Profit Percentage:</span>
              <span className="text-sm">{data?.profitPercentage}</span>
            </div>
          </div>
        </ModalSection>
        <ModalSection title="Product Dimensions">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold">Length:</span>
              <span className="text-sm">{data?.length}</span>
            </div>
            {data?.width && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold">Width:</span>
                <span className="text-sm">{data.width}</span>
              </div>
            )}
            {data?.height && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold">Height:</span>
                <span className="text-sm">{data.height}</span>
              </div>
            )}
            {data?.unitWeight && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold">Unit Weight:</span>
                <span className="text-sm">{data.unitWeight}</span>
              </div>
            )}
            {data?.thickness && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold">Thickness:</span>
                <span className="text-sm">{data.thickness}</span>
              </div>
            )}
            {data?.diameter && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold">Diameter:</span>
                <span className="text-sm">{data.diameter}</span>
              </div>
            )}
          </div>
        </ModalSection>
      </div>
    </Modal>
  );
};
