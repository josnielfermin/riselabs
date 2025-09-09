import Image from 'next/image';
import MenuMobileLink from '@/components/MenuMobile/MenuMobileLink';
import MenuLine from '@/components/UI/Icons/MenuLine';
import ComponentVisible from '@/library/hooks/useVisible';
import { useRouter } from 'next/navigation';

import { menuLinksLanding } from '@/data/menuLinks';

export const MenuMobileLanding = () => {
  const router = useRouter();
  const { ref, isVisible, setIsVisible } = ComponentVisible(false);

  const handleMenuClick = (sectionId: string) => {
    if (sectionId.includes('/')) {
      router.push(sectionId);
    } else {
      const sectionElement = document.getElementById(sectionId);
      if (sectionElement) {
        const yOffset = 0;
        const y =
          sectionElement.getBoundingClientRect().top +
          window.pageYOffset +
          yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  };
  return (
    <div className="lg:hidden flex gap-2.5 z-50" ref={ref}>
      <button
        type="button"
        className={`btn w-[35px] h-[34px] text-[30px] !rounded-[100px] z-10`}
        onClick={() => {
          setIsVisible(!isVisible);
        }}
      >
        <MenuLine />
      </button>

      <div
        className={`py-[22px] px-1.5 rounded-tl-[10px] rounded-bl-[10px] bg-[rgba(74,176,234,0.50)] bg-opacity-50 backdrop-blur-[10px] fixed bottom-0 right-0 w-[416px] max-xs:w-[95%] flex flex-col gap-3 z-[9000] h-[100vh] transition-all ${
          isVisible ? 'visible translate-x-0' : 'invisible translate-x-[100%]'
        }`}
      >
        <div className="flex items-center justify-between px-4 z-[9000]">
          <div
            className="z-50 text-2xl cursor-pointer text-white __className_02ffdd [font-feature-settings:_'liga'_off,_'clig'_off] bg-[#101013] hover:bg-[#111B4D] hover:text-[#F00] hover:[box-shadow:0px_0px_4px_0px_#F00] rounded-[15px] px-3 py-2 transition-all"
            onClick={() => setIsVisible(false)}
          >
            x
          </div>
        </div>
        <div className="flex items-center justify-end gap-3">
          <Image
            quality={100}
            src={'/static/images/header/linus-white.svg'}
            alt="Linus"
            className="w-[65px] h-[65px] relative z-10"
            width={65}
            height={65}
            loading="eager"
            unoptimized={true}
          />
        </div>
        {menuLinksLanding.map((link, i) => (
          <span
            key={i}
            onClick={() => {
              handleMenuClick(
                link.root ? link.root : `${link.href.replace('#', '')}`
              );
              setIsVisible(!isVisible);
            }}
          >
            <MenuMobileLink link={link} />
          </span>
        ))}
      </div>
      {/* {isVisible && (
      )} */}
    </div>
  );
};
