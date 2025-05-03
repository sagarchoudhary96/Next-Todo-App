import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { Task, TableColumn } from '@/lib/types';
import KanbanCard from './KanbanCard';
import { ScrollArea } from "@/components/ui/scroll-area" // Assuming ScrollArea for long columns
import { cn } from '@/lib/utils';

type KanbanColumnProps = {
  title: string;
  columnId: string;
  tasks: Task[];
  columns: TableColumn[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: number) => void;
};

const KanbanColumn = ({ title, columnId, tasks, columns, onEditTask, onDeleteTask }: KanbanColumnProps) => {
  return (
    // Increased padding to p-4, using bg-muted
    <div className="flex flex-col w-72 md:w-80 flex-shrink-0 bg-muted rounded-lg p-4">
      {/* Adjusted title margin, added muted color for count */}
      <h3 className="text-base font-semibold mb-4 flex justify-between items-center">
        <span>{title}</span>
        <span className="text-sm text-muted-foreground">{tasks.length}</span>
      </h3>
      <ScrollArea className="flex-1 -mx-2"> {/* Negative margin to counteract inner padding */}
        <Droppable droppableId={columnId}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={cn(
                "min-h-[400px] p-2 rounded-md transition-colors duration-200 space-y-3", // Added space-y-3 for card spacing
                snapshot.isDraggingOver ? "bg-primary/10" : ""
              )}
            >
              {tasks.map((task, index) => (
                <KanbanCard
                  key={task.id}
                  task={task}
                  index={index}
                  columns={columns}
                  onEditTask={onEditTask}
                  onDeleteTask={onDeleteTask}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </ScrollArea>
    </div>
  );
};

export default KanbanColumn;
