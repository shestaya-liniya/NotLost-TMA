import Ai from "@/pages/Ai";
import Events from "@/pages/Events";
import Folders from "@/pages/Folders";
import TabBarLayout from "@/ui/tab-bar/TabBarLayout";
import KeepAlive from "react-activation";
import { Swiper, SwiperRef, SwiperSlide } from "swiper/react";
import { Navigation, Scrollbar, A11y } from "swiper/modules";
import { useEffect, useRef, useState } from "react";
import { DelayedUnmount } from "@/ui/DelayedUnmount";

const SLIDE_ANIMATION = 300;

const TabViewContainer = () => {
  const swiperRef = useRef<SwiperRef | null>(null);

  const [tabIndex, setTabIndex] = useState(1);

  const slideTo = (to: number) => {
    setTabIndex(to);
    if (swiperRef.current) {
      swiperRef.current.swiper.slideTo(to, SLIDE_ANIMATION);
    }
  };

  useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.swiper.slideTo(1, 0);
    }
  }, []);

  const tabs = [
    {
      title: "ai",
    },
    {
      title: "folders",
    },
    {
      title: "events",
    },
  ];

  return (
    <TabBarLayout
      activeTab={tabs[tabIndex].title}
      setActiveTab={(tab) => {
        const selectedTab = tabs.find((t) => tab === t.title);
        selectedTab && slideTo(tabs.indexOf(selectedTab));
      }}
    >
      <div className="relative w-screen h-full overflow-hidden">
        <Swiper
          modules={[Navigation, Scrollbar, A11y]}
          spaceBetween={0}
          slidesPerView={1}
          ref={swiperRef}
          onSlideChange={(swiper) => {
            setTabIndex(swiper.activeIndex);
          }}
          allowTouchMove={false}
        >
          <SwiperSlide>
            <KeepAlive>
              <Ai />
            </KeepAlive>
          </SwiperSlide>
          <SwiperSlide>
            <DelayedUnmount mounted={tabIndex === 1} delay={SLIDE_ANIMATION}>
              <KeepAlive>
                <Folders />
              </KeepAlive>
            </DelayedUnmount>
          </SwiperSlide>
          <SwiperSlide>
            <KeepAlive>
              <Events />
            </KeepAlive>
          </SwiperSlide>
        </Swiper>
      </div>
    </TabBarLayout>
  );
};

export default TabViewContainer;
