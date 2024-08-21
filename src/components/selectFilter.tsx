import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {ReactNode} from "react";

interface SelectFilterProps<I> {
    list: I[];
    itemSelected: string;
    handleItemSelect: (value: string) => void;
    value: string;
    nombre: string;
    id: string;
    all?: boolean;
    icon?: ReactNode;
}

export default function SelectFilter({
                                         list,
                                         itemSelected,
                                         handleItemSelect,
                                         value,
                                         nombre,
                                         id,
                                         all,
                                         icon,
                                     }: SelectFilterProps<any>) {
    return (
        <Select onValueChange={(selectedValue) => handleItemSelect(selectedValue === "all" ? "" : selectedValue)}
                value={itemSelected}>
            <SelectTrigger className="rounded-sm h-7 text-xs w-auto gap-2 focus:outline-none focus-visible:ring-0">
                {icon && <span>{icon}</span>}
                <SelectValue placeholder="Seleccionar"/>
            </SelectTrigger>
            <SelectContent className="border-none text-sm">
                <SelectGroup className="text-xs">
                    {all && (
                        <SelectItem className="text-xs" value="all">
                            Todos
                        </SelectItem>
                    )}
                    {list.map((item: any) => (
                        <SelectItem className="text-xs" key={item[id]} value={item[value].toString()}>
                            {item[nombre]}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}
