import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface SelectFilterProps<I> {
    list: I[];
    itemSelected: string;
    handleItemSelect: (value: string) => void;
    value: string;
    nombre: string;
    id: string;
    all?: boolean;
}

export default function SelectFilter({
                                         list,
                                         itemSelected,
                                         handleItemSelect,
                                         value,
                                         nombre,
                                         id,
                                         all,
                                     }: SelectFilterProps<any>) {
    return (
        <Select onValueChange={handleItemSelect} defaultValue={itemSelected}>
            <SelectTrigger className="rounded-sm h-7 text-xs w-auto gap-4 focus:outline-none focus-visible:ring-0">
                <SelectValue placeholder="Selecciona una opción"/>
            </SelectTrigger>
            <SelectContent className="border-none text-sm">
                <SelectGroup className="text-xs">
                    {all && (
                        <SelectItem className="text-xs" value=" ">
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
