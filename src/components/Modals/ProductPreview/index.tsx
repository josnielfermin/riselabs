import { useEffect } from "react";
import Image from "next/image";
import useMediaQuery from "@/library/hooks/useMediaQuery";
import ComponentVisible from "@/library/hooks/useVisible";
import { Modal } from "@/components/ui/Modal";

interface ProductPreviewModalProps {
  openModal: boolean;
  setOpenModal: (openModal: boolean) => void;
}
const Common = () => {
  return <></>;
};

const Mobile = ({ openModal, setOpenModal }: ProductPreviewModalProps) => {
  const { ref, isVisible, setIsVisible } = ComponentVisible(false);
  useEffect(() => {
    if (openModal) {
      setIsVisible(true);
    }
    return () => {
      setIsVisible(false);
    };
  }, [openModal, setIsVisible]);

  return (
    <div className="w-full px-4 md:px-8 lg:px-16 relative h-full overflow-hidden">
      <div
        className="flex items-center justify-between max-lg:justify-center h-full container"
        ref={ref}
      >
        <div
          className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-[150vw] z-[9000] h-[150vw] *:transition-all lg:hidden ${
            isVisible
              ? "visible max-lg:translate-y-[72%] max-[890px]:translate-y-[68%] max-[725px]:translate-y-[60%] max-[580px]:translate-y-[54%] max-[490px]:translate-y-[48%] max-[445px]:translate-y-[40%] max-[385px]:translate-y-[34%] max-[345px]:translate-y-[28%] max-[325px]:translate-y-[20%]"
              : "invisible translate-y-[100%]"
          }`}
        >
          <div
            className="z-50 text-2xl cursor-pointer bg-woodsmoke-950 text-palm-green-400 [filter:drop-shadow(2px_0px_101.9px_rgba(92,_222,_102,_0.40))] rounded-full flex items-center justify-center *:transition-all absolute -top-16 left-1/2 -translate-x-1/2 w-12 h-12"
            onClick={() => {
              setOpenModal(false);
              setIsVisible(false);
            }}
          >
            <span className="icon-x" />
          </div>
          <div
            className={`rounded-full w-[150vw] h-[150vw] flex flex-col gap-3 [box-shadow:2px_0px_101.9px_0px_rgba(92,_222,_102,_0.90)] absolute top-0 left-1/2 -translate-x-1/2 bottom-0 z-10`}
          ></div>
          <div className="flex flex-col bg-woodsmoke-950 rounded-full w-[150vw] h-[150vw] bg items-center gap-3 py-10 px-10 relative z-[11] overflow-hidden">
            <Image
              src={"/static/images/header/decorator.png"}
              alt=""
              fill
              quality={100}
              className="mix-blend-overlay object-cover object-center z-[0]"
            />
            <Common />
          </div>
        </div>
      </div>
    </div>
  );
};
export const ProductPreviewModal = ({
  openModal,
  setOpenModal,
}: ProductPreviewModalProps) => {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  return (
    <>
      {!isDesktop && (
        <Mobile openModal={openModal} setOpenModal={setOpenModal} />
      )}
    </>
  );
};
