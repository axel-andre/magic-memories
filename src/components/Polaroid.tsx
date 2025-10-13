import * as React from "react"
import { Card } from "~/components/ui/card"
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
      ...props
    },
    ref
  ) => {
    const aspectRatioClasses = {
      square: "aspect-square",
      portrait: "aspect-[3/4]",
      landscape: "aspect-[4/3]",
    }

    return (
      <Card
        ref={ref}
        className={cn(
          "bg-white p-4 pb-12 shadow-lg hover:scale-105 hover:shadow-xl rounded-sm cursor-pointer transition-all",
          className
        )}
        style={{ transform: `rotate(${rotate}deg)` }}
        {...props}
      >
        <div className="relative w-full overflow-hidden">
          <img
            src={src}
            alt={alt}
            className={cn(
              "w-full object-cover",
              aspectRatioClasses[aspectRatio],
              imageClassName
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
    )
  }
)

Polaroid.displayName = "Polaroid"

export { Polaroid }

