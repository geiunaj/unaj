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

export default function Sidebar() {
  const navigate = useRouter();

  const handleCombustion = () => {
    navigate.push("/combustible");
  };

  const logo = "/img/logoUNAJ.png";
  return (
    <>
      <div className="flex flex-col items-center p-4">
        <div className="flex justify-center mb-4 ">
          <img src={logo} alt="Logo" className="w-[140px] h-auto" />
        </div>
        <div className="flex flex-col gap-4 w-full pt-4">
          {/* <div className="flex flex-col">
          </div> */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                variant="default"
                className="h-9 py-2 w-full justify-start"
              >
                <p className="ml-3 text-sm">Huella de carbono</p>
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
          <div>
            <p className="text-base pl-3 font-medium">Calculos</p>
            <Button
              size="sm"
              variant="ghost"
              className="h-9 px-4 py-2 w-full justify-start"
            >
              <p className="ml-3 text-sm">Formulario 1</p>
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-9 px-4 py-2 w-full justify-start"
            >
              <p className="ml-3 text-sm">Formulario 2</p>
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-9 px-4 py-2 w-full justify-start"
            >
              <p className="ml-3 text-sm">Formulario 3</p>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
