import * as React from "react"
import { useState } from "react"
import { Card } from "~/components/ui/card";
import { cn } from "~/lib/utils";

export interface PolaroidProps extends React.HTMLAttributes<HTMLDivElement> {
  src: string;
  alt: string;
  rotate?: number;
  aspectRatio?: "square" | "portrait" | "landscape";
  imageClassName?: string;
  caption?: string;
  captionClassName?: string;
  isStacked?: boolean;
  hasSelection?: boolean;
  footer?: React.ReactNode;
  isSelected?: boolean;
}
const Root = React.forwardRef<HTMLDivElement, PolaroidProps>(
  (
    {
      src,
      alt,
      rotate = 0,
      aspectRatio = "square",
      imageClassName,
      className,
      hasSelection = false,
      isStacked = false,
      footer,
      isSelected = false,
      ...props
    },
    ref
  ) => {
    const aspectRatioClasses = {
      square: "aspect-square",
      portrait: "aspect-[3/4]",
      landscape: "aspect-[4/3]",
    };
    const [isHovered, setIsHovered] = useState(false);

    return (
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "flex flex-col gap-4 relative hover:scale-105 hover:shadow-xl rounded-sm cursor-pointer transition-all",
          isStacked && "flex-col-reverse",
          {
            [`rotate-[${rotate}deg]`]: !isStacked,
          }
        )}
      >
        {isStacked && (
          <>
            <div
              className={cn(
                "absolute top-0 left-0 bg-white h-full w-full -rotate-3 shadow-lg transition-all",
                { "-rotate-6": isHovered }
              )}
            ></div>
            <div
              className={cn(
                "absolute top-0 left-0 bg-white h-full w-full rotate-3 shadow-lg transition-all",
                { "^rotate-6": isHovered }
              )}
            ></div>
          </>
        )}
        <Card
          ref={ref}
          className={cn(
            `bg-white p-4 pb-12 shadow-lg hover:scale-105 rounded-sm cursor-pointer transition-all`,
            { "rotate-[10deg]": isStacked },
            className
          )}
          {...props}
        >
          <div className="relative w-full overflow-hidden">
            <img
              src={src}
              alt={alt}
              className={cn(
                " w-full object-cover opacity-100 transition-opacity delay-300 duration-700",
                aspectRatioClasses[aspectRatio],
                imageClassName
              )}
            />
            <div
              className={cn(
                "absolute bottom-0 left-0 w-full h-full bg-black transition-opacity duration-700",
                {
                  "opacity-0": !hasSelection || isSelected,
                  "opacity-100": hasSelection && !isSelected,
                }
              )}
            />
          </div>
          {footer}
        </Card>
      </div>
    );
  }
);
export const SubCaption = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "mt-4 text-center font-handwriting text-sm text-gray-700 max-w-full overflow-hidden text-ellipsis whitespace-nowrap",
      className
    )}
    {...props}
  />
));
export const Caption = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "mt-4 text-center font-handwriting text-sm text-gray-700 font-bold max-w-full overflow-hidden text-ellipsis whitespace-nowrap",
      className
    )}
    {...props}
  />
));
SubCaption.displayName = "SubCaption"
Caption.displayName = "Caption"
export const Polaroid = {
  Root,
  SubCaption,
  Caption,
}

