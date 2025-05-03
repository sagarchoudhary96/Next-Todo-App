import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Task, TableColumn } from '@/lib/types'; // Assuming types are in lib/types.ts
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'; // Assuming shadcn Card is available
import { Button } from '@/components/ui/button';
import { PenIcon, Trash2Icon } from 'lucide-react'; // Assuming lucide icons
import { getValueLabelFromSelectColumn } from '@/lib/utils'; // Assuming utils is in lib/utils.ts
import { cn } from '@/lib/utils';

type KanbanCardProps = {
  task: Task;
  index: number;
  columns: TableColumn[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: number) => void;
};

const KanbanCard = ({ task, index, columns, onEditTask, onDeleteTask }: KanbanCardProps) => {
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent drag start
    onEditTask(task);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent drag start
    onDeleteTask(task.id);
  };

  // Find the priority column and other displayable columns
  const priorityColumn = columns.find(col => col.key === 'priority');
  const otherDisplayColumns = columns.filter(col =>
    col.key !== 'id' &&
    col.key !== 'title' &&
    col.key !== 'status' &&
    col.key !== 'priority' // Exclude priority as it's handled separately
  );

  // Helper function to get display value
  const getDisplayValue = (col: TableColumn, taskValue: any) => {
    if (col.type === TableColumnType.SELECT && col.options) {
      return getValueLabelFromSelectColumn(col, taskValue);
    }
    return String(taskValue ?? '-');
  };


  return (
    <Draggable draggableId={String(task.id)} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={cn(
            "mb-2 p-0", // Reduced margin and padding
            snapshot.isDragging ? "opacity-80 shadow-lg" : ""
          )}
        >
          <Card className="bg-card/80 hover:bg-card">
            <CardHeader className="p-3 flex flex-row justify-between items-start">
              <CardTitle className="text-sm font-medium break-words">{task.title}</CardTitle>
              <div className="flex space-x-1 flex-shrink-0 ml-2">
                 <Button variant="ghost" size="iconSm" onClick={handleEditClick} aria-label="Edit Task">
                   <PenIcon className="h-4 w-4" />
                 </Button>
                 <Button variant="ghost" size="iconSm" onClick={handleDeleteClick} aria-label="Delete Task">
                   <Trash2Icon className="h-4 w-4 text-destructive" />
                 </Button>
              </div>
            </CardHeader>
            {(priorityColumn || otherDisplayColumns.length > 0) && (
              <CardContent className="p-3 pt-1 text-xs text-muted-foreground space-y-1">
                {/* Display Priority prominently if it exists */}
                {priorityColumn && task[priorityColumn.key] && (
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{priorityColumn.title}:</span>
                    <span className="font-semibold text-foreground">
                      {getDisplayValue(priorityColumn, task[priorityColumn.key])}
                    </span>
                  </div>
                )}
                 {/* Display other custom fields */}
                {otherDisplayColumns.map(col => {
                    const value = task[col.key];
                    // Only display if value is not null/undefined/empty string
                    if (value !== null && value !== undefined && value !== '') {
                        return (
                            <div key={col.key} className="flex justify-between">
                                <span className="font-normal mr-1">{col.title}:</span>
                                <span className="truncate max-w-[150px]"> {/* Truncate long values */}
                                  {getDisplayValue(col, value)}
                                </span>
                            </div>
                        );
                    }
                    return null; // Don't render if no value
                })}
              </CardContent>
            )}
          </Card>
        </div>
      )}
    </Draggable>
  );
};

export default KanbanCard;
