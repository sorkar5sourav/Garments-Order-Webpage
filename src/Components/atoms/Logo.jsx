import LogoPNG from "../../assets/Logo.png";

const Logo = () => {
  return (
    <div className="flex items-center">
      <img src={LogoPNG} className="h-10 w-10" alt="" />
    </div>
  );
};
export default Logo;
