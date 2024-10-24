import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

const bannerData = [
  {
    title: "Koi Shop",
    subtitle: "If animals could talk, they'd talk about us!",
    description:
      "At a vehicula est proin turpis pellentesque sinulla a aliquam amet rhoncus quisque eget sit",
    image: "src/assets/images/download.gif",
    cta: { text: "Booking Service", link: "/booking" },
    badge: { text: "New Arrivals", color: "bg-green-500" },
  },
  {
    title: "Exotic Koi",
    subtitle: "Discover the beauty of rare koi varieties",
    description:
      "Explore our collection of exotic koi fish, each with unique patterns and colors that will mesmerize you.",
    image: "src/assets/images/image.png",
    cta: { text: "View Collection", link: "/exotic-koi" },
    badge: { text: "Limited Stock", color: "bg-red-500" },
  },
  {
    title: "Koi Care Essentials",
    subtitle: "Everything you need for happy, healthy koi",
    description:
      "From premium food to state-of-the-art filtration systems, we've got all your koi care needs covered.",
    image: "src/assets/images/download(1).gif",
    cta: { text: "Shop Now", link: "/koi-care" },
    badge: { text: "20% Off", color: "bg-blue-500" },
  },
];

export default function EnhancedBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      if (isAutoplay) {
        setCurrentSlide((prev) => (prev + 1) % bannerData.length);
      }
    }, 5000);

    return () => clearInterval(timer);
  }, [isAutoplay]);

  return (
    <div className="relative h-screen overflow-hidden bg-gradient-to-r from-primary/10 to-secondary/10">
      <Swiper
        slidesPerView={1}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          renderBullet: function (index, className) {
            return '<span class="' + className + ' w-3 h-3"></span>';
          },
        }}
        navigation={{
          prevEl: ".swiper-button-prev",
          nextEl: ".swiper-button-next",
        }}
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        className="h-full"
        onSlideChange={(swiper) => setCurrentSlide(swiper.activeIndex)}
      >
        {bannerData.map((slide, index) => (
          <SwiperSlide
            key={index}
            className="relative h-full slide"
            style={{
              backgroundImage: `url(${slide.image})`, // Set background image here
              backgroundSize: "cover", // Make the background image cover the entire slide
              backgroundPosition: "center", // Center the image
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-40 z-0"></div>{" "}
            {/* Overlay for better text visibility */}
            <div className="relative flex flex-col items-center justify-center h-full px-4 md:px-16 py-12 z-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="max-w-2xl text-center text-white"
                >
                  <Badge className={`mb-4 ${slide.badge.color}`}>
                    {slide.badge.text}
                  </Badge>
                  <h1 className="text-4xl md:text-6xl font-bold mb-4">
                    {slide.title}
                  </h1>
                  <h3 className="text-xl md:text-2xl mb-4">{slide.subtitle}</h3>
                  <p className="mb-8">{slide.description}</p>
                  <Button
                    asChild
                    className="group relative overflow-hidden rounded-full pl-8 h-12"
                  >
                    <Link to={slide.cta.link}>
                      <span className="relative z-10">{slide.cta.text}</span>
                      <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                      <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">
                        →
                      </span>
                    </Link>
                  </Button>
                </motion.div>
              </AnimatePresence>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="absolute bottom-4 left-4 z-20 flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsAutoplay(!isAutoplay)}
          aria-label={isAutoplay ? "Pause autoplay" : "Start autoplay"}
        >
          {isAutoplay ? "⏸" : "▶"}
        </Button>
      </div>
      <div className="swiper-button-prev !text-white"></div>
      <div className="swiper-button-next !text-white"></div>
    </div>
  );
}
