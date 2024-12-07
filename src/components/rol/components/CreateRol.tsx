import React, {useState} from "react";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Checkbox} from "@/components/ui/checkbox"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import {Input} from "@/components/ui/input";
import {Button} from "../../ui/button";
import {errorToast, successToast} from "@/lib/utils/core.function";
import {RolRequest, CreateRolProps} from "@/components/rol/services/rol.interface";
import {createRol} from "@/components/rol/services/rol.actions";
import {menuItems} from "@/lib/constants/menu";

interface MenuItem {
    id: number;
    title: string;
    items?: MenuItem[];
}

interface CheckboxMenuProps {
    menuItems: MenuItem[];
}

interface CheckedItems {
    [key: number]: boolean;
}

const parseNumber = (val: unknown) => parseFloat(val as string);
const requiredMessage = (field: string) => `Ingrese un ${field}`;

const Rol = z.object({
    type_name: z.string().min(1, requiredMessage("nombre")),
    permisos: z.array(z.number()),
});

export function CreateRol({onClose}: CreateRolProps) {
    const form = useForm<z.infer<typeof Rol>>({
        resolver: zodResolver(Rol),
        defaultValues: {
            type_name: "",
            permisos: [],
        },
    });

    const [checkedItems, setCheckedItems] = useState<CheckedItems>({});

    const handleCheckboxChange = (parentId: number, childId?: number) => {
        setCheckedItems((prev) => {
            const updated = {...prev};

            if (!childId) {
                // Toggle parent checkbox
                if (updated[parentId]) {
                    delete updated[parentId];
                    const parent = menuItems.find((item) => item.id === parentId);
                    parent?.items?.forEach((child) => delete updated[child.id]);
                } else {
                    updated[parentId] = true;
                    const parent = menuItems.find((item) => item.id === parentId);
                    parent?.items?.forEach((child) => (updated[child.id] = true));
                }
            } else {
                // Toggle child checkbox
                if (updated[childId]) {
                    delete updated[childId];
                } else {
                    updated[childId] = true;
                }

                // Update parent based on children
                const parent = menuItems.find((item) => item.id === parentId);
                const anyChildChecked = parent?.items?.some((child) => updated[child.id]);
                if (anyChildChecked) {
                    updated[parentId] = true;
                } else {
                    delete updated[parentId];
                }
            }

            return updated;
        });
    };

    const onSubmit = async (data: z.infer<typeof Rol>) => {
        const rolRequest: RolRequest = {
            type_name: data.type_name,
            permisos: Object.keys(checkedItems).map(parseNumber),
        };
        try {
            const response = await createRol(rolRequest);
            onClose();
            successToast(response.data.message);
        } catch (error: any) {
            errorToast(error.response.data.message);
        }
    };

    return (
        <div className="flex items-center justify-center">
            <div className="flex flex-col items-center justify-center w-full">
                <Form {...form}>
                    <form
                        className="w-full flex flex-col gap-3 pt-2 "
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        {/*NOMBRE*/}
                        <FormField
                            control={form.control}
                            name="type_name"
                            render={({field}) => (
                                <FormItem className="pt-2 w-full">
                                    <FormLabel>Nombre del Rol</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            className="w-full text-xs p-2 h-8 rounded focus:outline-none focus-visible:ring-offset-0"
                                            placeholder="Usuario"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <h1 className="text-lg font-medium pt-6">Permisos</h1>

                        {menuItems.map((item) => (
                            <div key={item.id} className="w-full">
                                {/* Parent */}
                                <div className="flex items-center">
                                    <label
                                        htmlFor={`parent-${item.id}`}
                                        className="w-full flex items-center gap-2 text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        <Checkbox
                                            id={`parent-${item.id}`}
                                            checked={!!checkedItems[item.id]}
                                            onCheckedChange={() => handleCheckboxChange(item.id)}
                                        />
                                        {item.title}
                                    </label>
                                </div>

                                {/* Children */}
                                {item.items && (
                                    <div className="flex flex-col pl-4 pt-2">
                                        {item.items?.map((subItem) => (
                                            <div key={subItem.id} className="flex items-center gap-2">
                                                <label
                                                    htmlFor={`child-${subItem.id}`}
                                                    className="w-full flex items-center gap-2 py-1 text-xs leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                >
                                                    <Checkbox
                                                        id={`child-${subItem.id}`}
                                                        checked={!!checkedItems[subItem.id]}
                                                        onCheckedChange={() => handleCheckboxChange(item.id, subItem.id)}
                                                    />
                                                    {subItem.title}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}


                        <div className="flex gap-3 w-full pt-4">
                            <Button type="submit" size="sm" className="w-full bg-primary">
                                Guardar
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}