import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default function Header() {
  const logo = "/img/logoUNAJ.png";
  return (
    // <div className="flex justify-between items-center p-3">
    //   {/* <div className="flex items-center">
    //     <img src={logo} className="w-[178px] h-[55px]" alt="logo" />
    //   </div> */}

    // </div>
    <div className="flex items-center justify-end space-x-5 p-2">
      <div className="flex flex-col justify-end items-end">
        <h1 className="font-medium">Admin User</h1>
        <p className="text-xs text-gray-400">adminuser@example.com</p>
      </div>
      <Avatar>
        <AvatarFallback>NC</AvatarFallback>
      </Avatar>
    </div>
  );
}
