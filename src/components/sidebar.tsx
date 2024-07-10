import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { FileText } from "lucide-react";

export default function Sidebar() {
  const navigate = useRouter();

  const handleCombustion = () => {
    navigate.push("/combustible");
  };

  const logo = "/img/logoUNAJ.png";
  return (
    <>
      <div className="flex flex-col items-center p-4">
        <div className="flex justify-center mb-6 pt-4 ">
          <img src={logo} alt="Logo" className="w-[140px] h-auto" />
        </div>
        <div className="flex flex-col gap-4 w-full pt-4">
          {/* <div className="flex flex-col">
          </div> */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="default"
                className="w-full justify-start"
              >
                <FileText className="mr-2 h-4 w-4" />
                <p className="ml-3 text-sm">Registros</p>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 rounded-xl "
              side="right"
              sideOffset={5}
            >
              <DropdownMenuRadioGroup
                className="font-Manrope"
                onClick={handleCombustion}
              >
                <DropdownMenuItem className="flex  items-center w-full">
                  Combustion
                </DropdownMenuItem>
                <DropdownMenuItem className="flex  items-center w-full">
                  Refrigerantes
                </DropdownMenuItem>
                <DropdownMenuItem className="flex  items-center w-full">
                  Refrigerantes
                </DropdownMenuItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </>
  );
}
