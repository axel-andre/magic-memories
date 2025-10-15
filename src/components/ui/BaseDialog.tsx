import React, { useEffect, useCallback, useRef } from 'react';
import { Dialog, DialogContent, DialogOverlay } from '~/components/ui/dialog';
import { X } from 'lucide-react';
import { Button } from './button';
import { useFocusTrap } from '~/hooks/useFocusTrap';

interface BaseDialogProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    children: React.ReactNode;
    className?: string;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    closeOnEscape?: boolean;
    closeOnOverlayClick?: boolean;
}

const maxWidthClasses = {
    sm: 'sm:max-w-sm',
    md: 'sm:max-w-md',
    lg: 'sm:max-w-lg',
    xl: 'sm:max-w-xl',
    '2xl': 'sm:max-w-2xl',
};

export const BaseDialog = React.memo<BaseDialogProps>(({
    isOpen,
    onClose,
    title,
    description,
    children,
    className = '',
    maxWidth = 'lg',
}) => {
    const dialogRef = useRef<HTMLDivElement | null>(null);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogOverlay
                className="fixed inset-0 bg-black/50 z-50"
            />
            <DialogContent
                ref={dialogRef}
                className={`${maxWidthClasses[maxWidth]} max-h-[90vh] overflow-y-auto bg-white ${className}`}
                role="dialog"
                aria-labelledby="dialog-title"
                aria-describedby={description ? "dialog-description" : undefined}
                aria-modal="true"
            >
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 id="dialog-title" className="text-lg font-semibold">
                            {title}
                        </h2>
                        {description && (
                            <p id="dialog-description" className="text-sm text-muted-foreground mt-1">
                                {description}
                            </p>
                        )}
                    </div>
                </div>
                <div className="space-y-4">
                    {children}
                </div>
            </DialogContent>
        </Dialog>
    );
});

BaseDialog.displayName = 'BaseDialog';
