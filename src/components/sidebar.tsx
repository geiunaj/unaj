import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { FileText } from "lucide-react";

export default function Sidebar() {
  const navigate = useRouter();

  // const handleCombustion = () => {
  //   navigate.push("/combustible");
  // };
  const handleCombustionEstacionaria = () => {
    navigate.push("/combustion/estacionaria");
  };

  const handleCombustionMovil = () => {
    navigate.push("/combustion/movil");
  };

  const handleFertilizante = () => {
    navigate.push("/fertilizante");
  };

  const handleConsElectricidad = () => {
    navigate.push("/electricidad");
  };

  const handleConsPapel = () => {
    navigate.push("/papel");
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
              <Button variant="default" className="w-full justify-start h-10">
                <FileText className="mr-2 h-4 w-4" />
                <p className="ml-3 text-sm">Registros</p>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 rounded-xl"
              side="right"
              sideOffset={5}
            >
              <DropdownMenuRadioGroup className="font-Manrope">
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Combustion</DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem onClick={handleCombustionEstacionaria}>
                        Combustion Estacionaria
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleCombustionMovil}>
                        Combustion Movil
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuItem
                  className="flex items-center w-full"
                  onClick={handleFertilizante}
                >
                  Fertilizantes
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex items-center w-full"
                  onClick={handleConsElectricidad}
                >
                  Electricidad
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex items-center w-full"
                  onClick={handleConsPapel}
                >
                  Papel
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center w-full">
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
