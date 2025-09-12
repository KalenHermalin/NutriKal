import { cn } from "@/lib/utils";

interface CircularProgressProps {
    value: number;
    max: number;
    size?: number;
    strokeWidth?: number;
    strokeLineCap?: "round" | "butt" | "square" | "inherit";
    color: string;
    unfilledColor?: string;
    children?: React.ReactNode;
    className?: string;
}

export const CircularProgress = ({
    value,
    max,
    size = 80,
    strokeWidth = 6,
    strokeLineCap,
    color,
    unfilledColor,
    children,
    className
}: CircularProgressProps) => {
    const percentage = (value / max) * 100;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
    return (
        <div className={cn("relative inline-flex items-center justify-center", className)}>
            <svg
                width={size}
                height={size}
                className="transform -rotate-90"
            >
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="transparent"
                    className={cn(``, unfilledColor ? unfilledColor : "stroke-muted")}
                    strokeWidth={strokeWidth}
                />
                {/* Progress circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="transparent"  
                    strokeWidth={strokeWidth}
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap={strokeLineCap || "round"}
                    className={cn(`transition-all duration-300 ease-in-out`, color)}
                />
            </svg>
            {children && (
                <div className="absolute inset-0 flex items-center justify-center">
                    {children}
                </div>
            )}
        </div>
    );
}
