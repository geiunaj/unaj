import { Calculator } from "lucide-react";
import { Button } from "./ui/button";

interface ButtonCalculateProps {
  onClick: () => void;
  variant?: "default" | "secondary";
  text?: string;
}

export default function ButtonCalculate({
  onClick,
  variant,
  text,
}: ButtonCalculateProps) {
  return (
    <Button
      size="sm"

      variant={variant || "secondary"}
      className="h-7 gap-1"
      onClick={onClick}
    >
      <Calculator className="h-3.5 w-3.5" />
      {/* <span className="sr-only sm:not-sr-only sm:whitespace-nowrap"> */}
      <span className="">
        {text || "Cálculos"}
      </span>
    </Button>
  );
}
