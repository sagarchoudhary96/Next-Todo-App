import { TASK_PRIORITY_OPTIONS, TASK_STATUS_OPTIONS } from "@/lib/constants";
import { TASK_PRIORITY, TASK_STATUS } from "@/types/task";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { TaskFormProps } from ".";
import SelectInputField from "../FormFields/SelectInputField";
import TextInputField from "../FormFields/TextInputField";
import { Button } from "../ui/button";
import { Form, FormField } from "../ui/form";
import { Loader2Icon } from "lucide-react";

const taskSchema = z.object({
  title: z.string().nonempty("Title is required"),
  priority: z.nativeEnum(TASK_PRIORITY),
  status: z.nativeEnum(TASK_STATUS),
});

type TaskFormType = z.infer<typeof taskSchema>;

type TaskEditorProps = TaskFormProps & {
  isSaving?: boolean;
};

const TaskEditor = ({ task, onSubmit, isSaving, onClose }: TaskEditorProps) => {
  const form = useForm<TaskFormType>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task?.title ?? "",
      priority: task?.priority ?? TASK_PRIORITY.NONE,
      status: task?.status ?? TASK_STATUS.NOT_STARTED,
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-2"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <TextInputField<TaskFormType>
              field={field}
              label="Title"
              placeholder="Enter Task"
            />
          )}
        />
        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <SelectInputField<TaskFormType>
              field={field}
              label="Priority"
              placeholder="Select Priority"
              options={TASK_PRIORITY_OPTIONS}
            />
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <SelectInputField<TaskFormType>
              field={field}
              label="Status"
              placeholder="Select Status"
              options={TASK_STATUS_OPTIONS}
            />
          )}
        />
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

export default TaskEditor;
