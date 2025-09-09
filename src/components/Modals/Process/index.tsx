import { Modal } from '@/components/UI';
import Image from 'next/image';

interface ProcessProps {
  open: boolean;
  onClose: () => void;
  status: 'loading' | 'success' | 'error';
  title?: string;
  message?: string;
  persist?: boolean;
}

const Process = ({
  open,
  onClose,
  status,
  title,
  message,
  persist = false,
}: ProcessProps) => {
  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="flex flex-col items-center gap-4">
            <Image
              src="/static/images/modals/process/spinner.png"
              alt="Success"
              width={153.825}
              height={156}
              className="animate-spin"
            />
            <p className="text-lg font-bold text-white">Processing</p>
            <p className="text-sm font-normal text-woodsmoke-800">
              Waiting for your approval...
            </p>
          </div>
        );
      case 'success':
        return (
          <div className="flex flex-col items-center gap-4">
            <Image
              src="/static/images/modals/process/check.png"
              alt="Success"
              width={150}
              height={150}
              className=""
            />
            <p className="text-lg font-bold text-white">
              {title || 'Transaction Successfull'}
            </p>
            <p className="text-sm font-normal text-woodsmoke-800">
              {message || 'Your action was completed successfully.'}
            </p>
          </div>
        );
      case 'error':
        return (
          <div className="flex flex-col items-center gap-4">
            <Image
              src="/static/images/modals/process/x.png"
              alt="Error"
              width={150}
              height={150}
            />
            <p className="text-lg font-bold text-white">
              {title || 'Something went wrong'}
            </p>
            <p className="text-sm font-normal text-woodsmoke-800">
              {message || 'Please try again or contact support.'}
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Modal openModal={open} setOpenModal={onClose} persist={persist}>
      <div className="flex items-center justify-center px-6 py-12 bg-woodsmoke-950 rounded-[20px] w-[95vw] xs:w-[478px] h-[478px] shadow-lg relative overflow-hidden">
        <Image
          src={'/static/images/landing/decorator-1-minimalist.png'}
          alt=""
          width={742}
          height={1638}
          className={`absolute -top-20 -left-20 z-[1] select-none transition-all`}
          quality={100}
        />
        <Image
          src={'/static/images/landing/decorator-2-minimalist.png'}
          alt=""
          width={430}
          height={1492}
          className={`absolute -bottom-10 -right-10 z-[1] select-none`}
          quality={100}
        />
        {!persist ? (
          <div
            className="absolute top-3 right-4 text-white text-xl hover:text-pastel-green-400 transition-colors cursor-pointer z-[2]"
            onClick={onClose}
          >
            <span className="icon-x" />
          </div>
        ) : null}
        <div className="relative w-full max-w-sm text-center">
          {renderContent()}
        </div>
      </div>
    </Modal>
  );
};

export default Process;
