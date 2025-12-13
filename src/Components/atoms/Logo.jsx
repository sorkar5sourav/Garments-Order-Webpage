import LogoPNG from "../../assets/Logo.png";

const Logo = () => {
  return (
    <div className="flex items-center hover:scale-120 duration-300">
      <img src={LogoPNG} className="h-15 w-15" alt="" />
    </div>
  );
};
export default Logo;
