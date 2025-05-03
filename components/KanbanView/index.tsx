import React, { useState, useEffect } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { Task, TableColumn, SelectOption } from '@/lib/types'; // Assuming types are in lib/types.ts
import KanbanColumn from './KanbanColumn';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"; // Assuming ScrollArea for horizontal scroll

type KanbanViewProps = {
  tasks: Task[];
  columns: TableColumn[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: number) => void;
  onUpdateTask: (updatedTask: Task) => void; // Callback to update task in the parent state
};

// Helper to get status options or derive from tasks
const getStatusOptions = (columns: TableColumn[], tasks: Task[]): SelectOption[] => {
  const statusColumn = columns.find(col => col.key === 'status');
  if (statusColumn && statusColumn.options) {
    // Ensure options have both label and value
    return statusColumn.options.map(opt => ({ label: opt.label || opt.value, value: opt.value }));
  } else {
    // Derive unique statuses from tasks if no options defined
    const uniqueStatuses = Array.from(new Set(tasks.map(task => task.status)));
    return uniqueStatuses.map(status => ({ label: status, value: status }));
  }
};

const KanbanView = ({ tasks, columns, onEditTask, onDeleteTask, onUpdateTask }: KanbanViewProps) => {
  const [groupedTasks, setGroupedTasks] = useState<Record<string, Task[]>>({});
  const [statusOptions, setStatusOptions] = useState<SelectOption[]>([]);

  useEffect(() => {
    const options = getStatusOptions(columns, tasks);
    setStatusOptions(options);

    const initialGroupedTasks: Record<string, Task[]> = {};
    options.forEach(option => {
      initialGroupedTasks[option.value] = [];
    });

    // Add tasks to the appropriate group, handle tasks with statuses not in options (e.g., new tasks)
    tasks.forEach(task => {
      if (!initialGroupedTasks[task.status]) {
        // If a task's status isn't a predefined column, add it to the first column (or handle differently)
        if (options.length > 0) {
             initialGroupedTasks[options[0].value].push(task);
             // Optionally update the task status to the default column status
             // onUpdateTask({ ...task, status: options[0].value });
        }
         // If no options exist at all, we can't group, maybe show an error or a single default column
      } else {
        initialGroupedTasks[task.status].push(task);
      }
    });

    setGroupedTasks(initialGroupedTasks);

  }, [tasks, columns]); // Rerun when tasks or columns change

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // No destination or dropped in the same place
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return;
    }

    const taskId = parseInt(draggableId, 10);
    const task = tasks.find(t => t.id === taskId);

    if (!task) {
      console.error("Dragged task not found!");
      return;
    }

    // Update task status if dropped in a different column
    if (destination.droppableId !== source.droppableId) {
      const updatedTask: Task = {
        ...task,
        status: destination.droppableId, // destination.droppableId is the status value
      };
      onUpdateTask(updatedTask); // Call the prop function to update the task state in the parent
    } else {
      // Optional: Handle reordering within the same column if needed
      // This requires updating the order in the local state `groupedTasks`
      // and possibly passing the updated order back up if persistence is required.
      const columnTasks = Array.from(groupedTasks[source.droppableId]);
      const [removed] = columnTasks.splice(source.index, 1);
      columnTasks.splice(destination.index, 0, removed);

      setGroupedTasks(prev => ({
        ...prev,
        [source.droppableId]: columnTasks
      }));
      // Note: This reordering is visual only unless you persist the order.
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <ScrollArea className="w-full whitespace-nowrap rounded-md border">
        <div className="flex space-x-4 p-4">
          {statusOptions.map((statusOption) => (
            <KanbanColumn
              key={statusOption.value}
              columnId={statusOption.value}
              title={statusOption.label}
              tasks={groupedTasks[statusOption.value] || []}
              columns={columns}
              onEditTask={onEditTask}
              onDeleteTask={onDeleteTask}
            />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </DragDropContext>
  );
};

export default KanbanView;
