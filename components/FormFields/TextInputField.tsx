import { ControllerRenderProps, FieldValues } from "react-hook-form";
import { FormControl, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";

type FormTextInputFieldProps<T extends FieldValues> = {
  field: ControllerRenderProps<T>;
  label: string;
  placeholder?: string;
};
const TextInputField = <T extends FieldValues>({
  label,
  placeholder,
  field,
}: FormTextInputFieldProps<T>) => {
  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <Input placeholder={placeholder} {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};

export default TextInputField;
