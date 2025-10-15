import { useState, useCallback } from "react";

interface UseMemoryLaneStateProps {
  initialSelectedMemory?: number;
  initialRevealedMemories?: number[];
}

export const useMemoryLaneState = ({
  initialSelectedMemory = 0,
  initialRevealedMemories = [0],
}: UseMemoryLaneStateProps = {}) => {
  const [revealedMemories, setRevealedMemories] = useState<number[]>(
    initialRevealedMemories
  );
  const [selectedMemory, setSelectedMemory] = useState<number>(
    initialSelectedMemory
  );
  const [showAddMemoryDialog, setShowAddMemoryDialog] = useState(false);

  const handleMemoryVisible = useCallback((index: number) => {
    setRevealedMemories((currentlySelectedIndexes) => {
      if (!currentlySelectedIndexes.includes(index)) {
        return [...currentlySelectedIndexes, index];
      }
      return currentlySelectedIndexes;
    });
    setSelectedMemory(index);
  }, []);

  const handleMemoryClick = useCallback((index: number) => {
    setSelectedMemory(index);
  }, []);

  const openAddMemoryDialog = useCallback(() => {
    setShowAddMemoryDialog(true);
  }, []);

  const closeAddMemoryDialog = useCallback(() => {
    setShowAddMemoryDialog(false);
  }, []);

  return {
    revealedMemories,
    selectedMemory,
    showAddMemoryDialog,
    handleMemoryVisible,
    handleMemoryClick,
    openAddMemoryDialog,
    closeAddMemoryDialog,
  };
};
