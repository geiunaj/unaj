import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

interface SelectFilterProps<I> {
    list: I[];
    itemSelected: string;
    handleItemSelect: (value: string) => void;
    value: string;
    nombre: string;
    id: string;
}

export default function SelectFilter(
    {list, itemSelected, handleItemSelect, value, nombre, id}: SelectFilterProps<any>
) {
    return (
        <Select
            onValueChange={handleItemSelect}
            defaultValue={itemSelected}
        >
            <SelectTrigger className="rounded-sm h-9 w-auto gap-2 focus:outline-none focus-visible:ring-0">
                <SelectValue placeholder="Selecciona una opción"/>
            </SelectTrigger>
            <SelectContent className="border-none">
                <SelectGroup>
                    {list.map((item: any) => (
                        <SelectItem key={item[id]} value={item[value].toString()}>
                            {item[nombre]}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}