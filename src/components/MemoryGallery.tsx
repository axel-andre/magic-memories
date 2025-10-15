import React, { memo, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { PolaroidWithIntersection } from '~/components/PolaroidWithIntersection';

interface Memory {
  id: string;
  title: string;
  image: string;
  content?: string;
  date?: Date;
}

interface MemoryGalleryProps {
  memories: Memory[];
  revealedMemories: number[];
  isOwner: boolean;
  onMemoryVisible: (index: number) => void;
  onMemoryClick: (index: number) => void;
  onAddMemory: () => void;
}

export const MemoryGallery = memo<MemoryGalleryProps>(({
  memories,
  revealedMemories,
  isOwner,
  onMemoryVisible,
  onMemoryClick,
  onAddMemory,
}) => {
  const handleMemoryVisible = useCallback((index: number) => {
    onMemoryVisible(index);
  }, [onMemoryVisible]);

  const handleMemoryClick = useCallback((index: number, event: React.MouseEvent<HTMLDivElement>) => {
    event.currentTarget.scrollIntoView({ behavior: "smooth", block: "center" });
    onMemoryClick(index);
  }, [onMemoryClick]);

  return (
    <div className="flex flex-col gap-4 justify-start items-start mt-12">
      {memories.map((memory, index) => (
        <PolaroidWithIntersection
          hasSelection
          isSelected={revealedMemories.includes(index)}
          key={memory.id}
          src={memory.image}
          alt={memory.title}
          caption={memory.title}
          aspectRatio="square"
          className="max-w-80 max-h-96"
          rotate={index % 2 === 0 ? 10 : 20}
          visibilityThreshold={0.8}
          triggerOnce={false}
          onVisible={() => handleMemoryVisible(index)}
          onClick={(e) => handleMemoryClick(index, e)}
        />
      ))}

      {isOwner && (
        <Button
          onClick={onAddMemory}
          variant="default"
          size="lg"
          className="flex gap-2 h-auto p-6 mx-auto mt-12"
        >
          <Plus className="h-8 w-8 " />
          <span className="">Add Memory</span>
        </Button>
      )}
    </div>
  );
});

MemoryGallery.displayName = 'MemoryGallery';
