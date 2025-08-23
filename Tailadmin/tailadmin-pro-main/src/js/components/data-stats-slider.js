// import Swiper JS
import Swiper, { Navigation } from "swiper";
// import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

const swiper = new Swiper(".dataStatsSlider", {
  modules: [Navigation],
  slidesPerView: 1,
  loop: false,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  breakpoints: {
    768: {
      slidesPerView: 2,
    },
    1280: {
      slidesPerView: 3,
    },
    1536: {
      slidesPerView: 4,
    },
  },
});
