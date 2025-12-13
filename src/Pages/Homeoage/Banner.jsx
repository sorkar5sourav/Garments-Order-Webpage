import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Link } from "react-router";

const Banner = () => (
    <div className="bg-black/30 rounded-4xl overflow-hidden">
        <div className="flex flex-col justify-center text-white items-center text-center gap-5 max-w-xl mx-auto py-20">
    <h1 className="text-4xl font-bold">Start Your Busieness Now!</h1>
    <div className="">We simplifies the tracking of orders from buyers,
          manages production stages monitors inventory, and ensures timely
          delivery.</div>
    <div className="flex gap-5"><button className="btn btn-accent rounded-full">view Product</button>
    <button className="btn btn-outline rounded-full">Vew Orders</button></div>
</div>
    {/* <div className="">
      <Carousel autoPlay={true} infiniteLoop={true} className="w-full mx-auto">
        <img src={bannerImg1} />
        <img src={bannerImg2} />
        <img src={bannerImg3} />
      </Carousel>
    </div> */}
    </div>
);

export default Banner;