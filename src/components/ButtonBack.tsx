import {ChevronLeft} from "lucide-react";
import {Button} from "./ui/button";

interface ButtonBackProps {
    onClick: () => void;
    variant?:
        | "default"
        | "secondary"
        | "ghost"
        | "outline"
        | "destructive"
        | "link"
        | null
        | undefined;
}

export default function ButtonBack({
                                       onClick,
                                       variant = "secondary",
                                   }: ButtonBackProps) {
    return (
        <Button variant={variant} size="icon" className="w-full h-7 sm:w-7" onClick={onClick}>
            <ChevronLeft className="h-4 w-4"/>
            <span className="sm:hidden text-xs">Regresar</span>
        </Button>
    );
}
