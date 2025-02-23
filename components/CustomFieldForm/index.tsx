import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { TableColumn, TableColumnType } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon, PlusIcon, Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import BooleanInputField from "../FormFields/BooleanInputField";
import SelectInputField from "../FormFields/SelectInputField";
import TextInputField from "../FormFields/TextInputField";
import { Button } from "../ui/button";
import { Form, FormField } from "../ui/form";

const TABLE_COLUMN_TYPE_OPTIONS = Object.values(TableColumnType).map(
  (type) => ({
    label: type.charAt(0).toUpperCase() + type.slice(1),
    value: type,
  })
);

const DEFAULT_CUSTOM_FIELD_FORM_VALUE = {
  title: "",
  type: TableColumnType.TEXT,
  options: [],
  isCustom: true,
};

export type CustomFieldFormSubmitFn = (
  taskValues: TableColumn | Omit<TableColumn, "key">
) => Promise<void>;

const customFieldSchema = z.object({
  title: z.string().nonempty("Field Title is required"),
  type: z.nativeEnum(TableColumnType),
  options: z
    .array(
      z.object({
        value: z.string().nonempty("Value is requred"),
        label: z.string().nonempty("Label is required"),
      })
    )
    .optional(),
  required: z.boolean().optional(),
  isCustom: z.boolean().optional(),
});

/**
 * Custom Field Form Schema
 * @type CustomFieldFormType
 * @property title - Field Title
 * @property type - Field Type
 * @property options - Field Options - Optional
 * @property required - Is Field Required
 * @property isCustom - Is Field Custom -set by default to true
 * @returns CustomFieldFormType
 */
export type CustomFieldFormType = z.infer<typeof customFieldSchema>;

/**
 * Custom Field Form
 * @param onSubmit - Function to handle form submission
 * @param fieldToEdit - present when editing a field
 * @param onClose - Function called when form is closed
 * @returns JSX.Element
 */
const CustomFieldForm = ({
  onSubmit,
  fieldToEdit,
  onClose,
}: {
  isSaving?: boolean;
  onSubmit: CustomFieldFormSubmitFn;
  fieldToEdit?: TableColumn;
  onClose: () => void;
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const form = useForm<CustomFieldFormType>({
    resolver: zodResolver(customFieldSchema),
    defaultValues: DEFAULT_CUSTOM_FIELD_FORM_VALUE,
  });

  const { control, watch } = form;
  const fieldType = watch("type");
  const [open, setOpen] = useState(false);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setIsSaving(false);
      onClose();
    }
  };

  const handleSubmitForm: CustomFieldFormSubmitFn = async (values) => {
    setIsSaving(true);
    toast.promise(onSubmit(values), {
      loading: "Saving Field...",
      success: () => {
        handleOpenChange(false);
        return "Field saved successfully";
      },
      error: (err: string) => {
        setIsSaving(false);
        return "Failed to save Field: " + err;
      },
    });
  };

  useEffect(() => {
    form.reset(
      fieldToEdit
        ? {
            ...fieldToEdit,
            options: fieldToEdit.options || [],
          }
        : DEFAULT_CUSTOM_FIELD_FORM_VALUE
    );
    if (fieldToEdit) {
      setOpen(true);
    }
  }, [fieldToEdit, form, open]);

  const {
    fields: optionFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "options",
  });

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <PlusIcon className="w-4 h-4" /> Add Field
        </Button>
      </SheetTrigger>
      <SheetContent className="md:max-w-md">
        <SheetHeader>
          <SheetTitle>{`${
            fieldToEdit?.key ? "Edit" : "Add"
          } Custom Field`}</SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmitForm)}
            className="flex flex-col gap-3 p-4 overflow-y-auto"
          >
            <FormField
              control={form.control}
              name="title"
              disabled={!!fieldToEdit?.key} // Disable title field when editing
              render={({ field }) => (
                <TextInputField<CustomFieldFormType>
                  field={field}
                  label={"Field Title"}
                  placeholder={`Enter title`}
                />
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <SelectInputField<CustomFieldFormType>
                  field={field}
                  label={"Field Type"}
                  placeholder="Select field type"
                  options={TABLE_COLUMN_TYPE_OPTIONS}
                />
              )}
            />

            <FormField
              control={form.control}
              name="required"
              render={({ field }) => (
                <BooleanInputField<CustomFieldFormType>
                  field={field}
                  label={"Is Required?"}
                />
              )}
            />

            {/* Conditionally render options if type is SELECT */}
            {fieldType === TableColumnType.SELECT && (
              <>
                <label className="block text-sm font-medium">Options</label>
                <div className="border p-3 rounded-md">
                  {optionFields.map((field, index) => (
                    <div
                      key={field.id}
                      className="flex items-center gap-2 mt-2"
                    >
                      <FormField
                        control={form.control}
                        name={`options.${index}.label`}
                        render={({ field }) => (
                          <TextInputField
                            field={field}
                            label="Label"
                            placeholder="Option Label"
                          />
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`options.${index}.value`}
                        render={({ field }) => (
                          <TextInputField
                            field={field}
                            label="Value"
                            placeholder="Option Value"
                          />
                        )}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        className="text-destructive hover:text-destructive-dark"
                        size="icon"
                        onClick={() => remove(index)}
                      >
                        <Trash2Icon className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-2"
                    onClick={() => append({ label: "", value: "" })}
                  >
                    <PlusIcon className="w-4 h-4" />
                    Add Option
                  </Button>
                </div>
              </>
            )}
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="w-fit" disabled={isSaving}>
                {isSaving && <Loader2Icon className="animate-spin" />}
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export default CustomFieldForm;
