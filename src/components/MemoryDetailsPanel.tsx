import React, { memo } from 'react';
import { MemoryDetails } from '~/components/MemoryDetails';
import { MemoryDetailsForm, MemoryDetailsFormValues } from '~/components/MemoryDetailsForm';

interface Memory {
  id: string;
  title: string;
  content?: string;
  date?: Date;
}

interface MemoryDetailsPanelProps {
  memory: Memory;
  memoryLaneId: string;
  isEditing: boolean;
  isPending: boolean;
  onMemoryChange: (values: MemoryDetailsFormValues) => void;
  onMemorySubmit: () => void;
  onMemoryDelete: () => void;
}

export const MemoryDetailsPanel = memo<MemoryDetailsPanelProps>(({
  memory,
  memoryLaneId,
  isEditing,
  isPending,
  onMemoryChange,
  onMemorySubmit,
  onMemoryDelete,
}) => {
  if (isPending) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4 justify-start items-start mt-20 w-1/2">
      {!isEditing || !memory.id || !memory.title ? (
        <MemoryDetails
          title={memory.title ?? ""}
          content={memory.content}
          date={memory.date}
        />
      ) : (
        <MemoryDetailsForm
          key={memory.id}
          memoryLaneId={memoryLaneId}
          id={memory.id}
          values={{
            title: memory.title ?? "",
            content: memory.content,
            date: memory.date?.toISOString(),
          }}
          onChange={onMemoryChange}
          onSubmit={onMemorySubmit}
          onDelete={onMemoryDelete}
        />
      )}
    </div>
  );
});

MemoryDetailsPanel.displayName = 'MemoryDetailsPanel';
