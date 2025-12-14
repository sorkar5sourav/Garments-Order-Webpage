import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Link } from "react-router";
import bannerImg1 from "../../assets/1.png";
import bannerImg2 from "../../assets/2.png";
import bannerImg3 from "../../assets/3.png";
import bannerImg4 from "../../assets/4.png";
import bannerImg5 from "../../assets/5.png";

const Banner = () => (
    <div className="relative">
      <Carousel autoPlay={true} infiniteLoop={true} className="w-full mx-auto">
        <img src={bannerImg1} />
        <img src={bannerImg2} />
        <img src={bannerImg3} />
         <img src={bannerImg4} />
          <img src={bannerImg5} />
      </Carousel>
      <div className="absolute hidden md:flex top-12/20 left-6/25 lg:left-1/6 -translate-x-1/2 -translate-y-1/2 flex-wrap justify-center">
        <Link to={"/track"} className="btn max-h-14 btn-primary rounded-full">
          Trak Your Order
        </Link>
        <Link to={"/rider-apply"} className="btn btn-outline text-white border-white ml-4 max-h-14">
          Explore Products
        </Link>
      </div>
    </div>
);

export default Banner;
