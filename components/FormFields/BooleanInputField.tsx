import { ControllerRenderProps, FieldValues } from "react-hook-form";
import { FormControl, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Switch } from "../ui/switch";

type FormTextInputFieldProps<T extends FieldValues> = {
  field: ControllerRenderProps<T>;
  label: string;
  placeholder?: string;
};
const BooleanInputField = <T extends FieldValues>({
  label,
  field,
}: FormTextInputFieldProps<T>) => {
  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <Switch checked={field.value} onCheckedChange={field.onChange} />
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};

export default BooleanInputField;
