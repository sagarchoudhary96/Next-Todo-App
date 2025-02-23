import { ControllerRenderProps, FieldValues } from "react-hook-form";
import { FormControl, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { HTMLInputTypeAttribute } from "react";

type FormTextInputFieldProps<T extends FieldValues> = {
  field: ControllerRenderProps<T>;
  label: string;
  placeholder?: string;
  type?: HTMLInputTypeAttribute;
};
const TextInputField = <T extends FieldValues>({
  label,
  placeholder,
  field,
  type = "text",
}: FormTextInputFieldProps<T>) => {
  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <Input
          placeholder={placeholder}
          type={type}
          {...field}
          value={`${field.value}`}
          onChange={(e) =>
            field.onChange(
              type === "number" ? Number(e.target.value) : e.target.value
            )
          }
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};

export default TextInputField;
