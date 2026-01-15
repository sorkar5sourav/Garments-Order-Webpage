import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Link } from "react-router";
import { motion } from "framer-motion";
import bannerImg1 from "../../assets/1.png";
import bannerImg2 from "../../assets/2.png";
import bannerImg3 from "../../assets/3.png";
import bannerImg4 from "../../assets/4.png";
import bannerImg5 from "../../assets/5.png";
import { fadeInUp, fadeInDown } from "../../utils/animations";

const Banner = () => (
  <motion.div 
    initial="hidden"
    animate="visible"
    variants={fadeInUp}
    className="relative lg:h-150 overflow-hidden max-w-390 mx-auto rounded-4xl"
  >
    <Carousel autoPlay={true} infiniteLoop={true} className="w-full mx-auto">
      <img src={bannerImg1} />
      <img src={bannerImg2} />
      <img src={bannerImg3} />
      <img src={bannerImg4} />
      <img src={bannerImg5} />
    </Carousel>
    <div className="absolute hidden md:flex top-11/20 lg:top-16/20 left-6/25 lg:left-1/6 -translate-x-1/2 -translate-y-1/2 flex-wrap justify-center gap-4">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <Link
          to={"/dashboard/trackorder"}
          className="btn max-h-14 btn-primary text-base-300 rounded-full"
        >
          Trak Your Order
        </Link>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <Link
          to={"/products"}
          className="btn btn-outline text-white border-white max-h-14"
        >
          Explore Products
        </Link>
      </motion.div>
    </div>
  </motion.div>
);

export default Banner;
