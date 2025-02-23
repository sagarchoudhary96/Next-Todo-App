import { TableColumn, TableColumnType, Task } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { TaskFormProps } from ".";
import TextInputField from "../FormFields/TextInputField";
import { Button } from "../ui/button";
import { Form, FormField } from "../ui/form";
import SelectInputField from "../FormFields/SelectInputField";

type TaskEditFormProps = TaskFormProps & {
  isSaving?: boolean;
};

/**
 * Get Default Values for Task Form
 * @param columns - Table Columns
 * @param task - Task
 * @returns Record<string, string | number>
 */
const getDefaultValues = (columns: TableColumn[], task?: Task) => {
  const defaultValues: Record<string, string | number> = {};
  columns.forEach((column) => {
    if (task && task[column.key]) {
      defaultValues[column.key] = task[column.key] || "";
    } else {
      if (column.type === TableColumnType.TEXT) {
        defaultValues[column.key] = "";
      } else if (column.type === TableColumnType.SELECT) {
        defaultValues[column.key] = column.options
          ? column.options[0].value
          : "";
      } else if (column.type === TableColumnType.NUMBER) {
        defaultValues[column.key] = 0;
      }
    }
  });
  return defaultValues;
};

const TaskEditForm = ({
  task,
  onSubmit,
  isSaving,
  onClose,
  columns,
}: TaskEditFormProps) => {
  const taskSchema = useMemo(() => {
    const schemaFields: z.ZodRawShape = {};
    columns.forEach((column) => {
      if (column.type === TableColumnType.TEXT) {
        if (column.required) {
          schemaFields[column.key] = z
            .string()
            .nonempty(`"${column.title}" is required`);
        } else {
          schemaFields[column.key] = z.string();
        }
      } else if (column.type === TableColumnType.SELECT && column.options) {
        schemaFields[column.key] = z.enum(
          column.options.map((option) => option.value) as [string, ...string[]]
        );
        if (!column.required) {
          schemaFields[column.key] = schemaFields[column.key].optional();
        }
      } else if (column.type === TableColumnType.NUMBER) {
        if (column.required) {
          schemaFields[column.key] = z
            .number()
            .int(`"${column.title}" is required`);
        } else {
          schemaFields[column.key] = z.number().int().optional();
        }
      }
    });
    return z.object(schemaFields);
  }, [columns]);

  type TaskFormType = z.infer<typeof taskSchema>;

  const form = useForm<TaskFormType>({
    resolver: zodResolver(taskSchema),
    defaultValues: getDefaultValues(columns, task),
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-2"
      >
        {columns.map((column) =>
          column.type === TableColumnType.SELECT ? (
            <FormField
              key={column.key}
              control={form.control}
              name={column.key}
              render={({ field }) => (
                <SelectInputField<TaskFormType>
                  field={field}
                  label={column.title}
                  options={column.options || []}
                />
              )}
            />
          ) : (
            <FormField
              key={column.key}
              control={form.control}
              name={column.key}
              render={({ field }) => (
                <TextInputField<TaskFormType>
                  field={field}
                  label={column.title}
                  placeholder={`Enter ${column.title}`}
                  type={
                    column.type === TableColumnType.NUMBER ? "number" : "text"
                  }
                />
              )}
            />
          )
        )}
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" className="w-fit" disabled={isSaving}>
            {isSaving && <Loader2Icon className="animate-spin" />}
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TaskEditForm;
