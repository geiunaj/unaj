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
        <div className="flex justify-center mb-6 pt-4 ">
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
                className="h-12 py-2 w-full bg-blue-800 justify-start"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                  <path d="M9 10h6" />
                  <path d="M12 13V7" />
                  <path d="M9 17h6" />
                </svg>
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
