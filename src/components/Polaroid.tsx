import * as React from "react"
import { useState } from "react"
import { Card, CardHeader, CardTitle } from "~/components/ui/card"
import { cn } from "~/lib/utils"

export interface PolaroidProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The image source URL
   */
  src: string
  /**
   * Alt text for the image
   */
  alt: string
  /**
   * Optional caption text that appears at the bottom
   */
  caption?: string
  /**
   * Optional rotation angle in degrees (default: 0)
   * Can be used to create a scattered polaroid effect
   */
  rotate?: number
  /**
   * Image aspect ratio (default: "square")
   */
  aspectRatio?: "square" | "portrait" | "landscape"
  /**
   * Additional className for the image
   */
  imageClassName?: string
  /**
   * Additional className for the caption
   */
  captionClassName?: string
  /**
   * Whether the polaroid is stacked
   */
  isStacked?: boolean
  /**
   * Whether the polaroid has selection
   */
  hasSelection?: boolean
  /**
   * Whether the polaroid is selected
   */
  isSelected?: boolean
}

const Polaroid = React.forwardRef<HTMLDivElement, PolaroidProps>(
  (
    {
      src,
      alt,
      caption,
      rotate = 0,
      aspectRatio = "square",
      imageClassName,
      captionClassName,
      className,
      hasSelection = false,
      isSelected = false,
      isStacked = false,
      ...props
    },
    ref
  ) => {
    const aspectRatioClasses = {
      square: "aspect-square",
      portrait: "aspect-[3/4]",
      landscape: "aspect-[4/3]",
    }
    const [isHovered, setIsHovered] = useState(false)

    return (
      <div onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} className={cn("flex flex-col gap-4 relative hover:scale-105 hover:shadow-xl rounded-sm cursor-pointer transition-all", isStacked && "flex-col-reverse", {
        [`rotate-[${rotate}deg]`]: !isStacked
      })}>
        {isStacked && (
          <>
            <div className={cn("absolute top-0 left-0 bg-white h-full w-full -rotate-3 shadow-lg transition-all", { "-rotate-6": isHovered })} >
            </div>
            <div className={cn("absolute top-0 left-0 bg-white h-full w-full rotate-3 shadow-lg transition-all", { "^rotate-6": isHovered })}>
            </div>
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
              "w-full object-cover opacity-100 transition-opacity delay-300 duration-700",
              aspectRatioClasses[aspectRatio],
              imageClassName,
              {
                "opacity-0": hasSelection && !isSelected,
                "opacity-100": hasSelection && isSelected
              }
            )}
          />
        </div>
        {caption && (
          <div
            className={cn(
              "mt-4 text-center font-handwriting text-sm text-gray-700",
              captionClassName
            )}
          >
            {caption}
          </div>
        )}
        </Card>
      </div>
    )
  }
)

Polaroid.displayName = "Polaroid"

export { Polaroid }

