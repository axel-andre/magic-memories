import React from 'react';
import { Label } from '@radix-ui/react-label';
import { Input } from './input';
import { Textarea } from './textarea';

interface FormFieldProps {
    label: string;
    name: string;
    type?: 'text' | 'date' | 'email' | 'password';
    value: string;
    onChange: (value: string) => void;
    onBlur?: () => void;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    error?: string;
    multiline?: boolean;
    rows?: number;
    maxLength?: number;
}

export const FormField = React.memo<FormFieldProps>(({
    label,
    name,
    type = 'text',
    value,
    onChange,
    onBlur,
    placeholder,
    required = false,
    disabled = false,
    error,
    multiline = false,
    rows = 3,
    maxLength,
}) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        onChange(e.target.value);
    };

    return (
        <div className="space-y-2">
            <Label htmlFor={name} className="text-sm font-medium">
                {label} {required && <span className="text-destructive">*</span>}
            </Label>

            {multiline ? (
                <Textarea
                    id={name}
                    name={name}
                    value={value}
                    onChange={handleChange}
                    onBlur={onBlur}
                    placeholder={placeholder}
                    disabled={disabled}
                    rows={rows}
                    maxLength={maxLength}
                    className={error ? 'border-destructive' : ''}
                />
            ) : (
                <Input
                    id={name}
                    name={name}
                    type={type}
                    value={value}
                    onChange={handleChange}
                    onBlur={onBlur}
                    placeholder={placeholder}
                    disabled={disabled}
                    maxLength={maxLength}
                    className={error ? 'border-destructive' : ''}
                />
            )}

            {error && (
                <p className="text-sm text-destructive" role="alert">
                    {error}
                </p>
            )}
        </div>
    );
});

FormField.displayName = 'FormField';
