import React from "react";

interface SpinnerProps {
    size?: "sm" | "md" | "lg";
    variant?: "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "light" | "dark";
    className?: string;
    text?: string;
    center?: boolean;
    fullScreen?: boolean;
    minHeight?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
    size = "md",
    variant = "primary",
    className = "",
    text,
    center = false,
    fullScreen = false,
    minHeight = "200px",
}) => {
    const getSizeClass = () => {
        switch (size) {
            case "sm":
                return "spinner-border-sm";
            case "lg":
                return "spinner-border-lg";
            default:
                return "";
        }
    };

    const spinnerElement = (
        <div className={`d-flex flex-column align-items-center ${center ? "justify-content-center" : ""}`}>
            <div
                className={`spinner-border text-${variant} ${getSizeClass()} ${className}`}
                role="status"
                aria-hidden="true"
            />
            {text && (
                <div className={`mt-2 text-${variant} text-center`}>
                    {text}
                </div>
            )}
        </div>
    );

    if (fullScreen) {
        return (
            <div 
                className="d-flex justify-content-center align-items-center" 
                style={{ minHeight: "100vh" }}
            >
                <div className="text-center">
                    <div
                        className={`spinner-border text-${variant} ${size === 'lg' ? 'spinner-border-lg' : ''}`}
                        role="status"
                        aria-hidden="true"
                    />
                    {text && (
                        <div className={`mt-3 text-${variant}`}>
                            {text}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    if (center) {
        return (
            <div 
                className="d-flex justify-content-center align-items-center" 
                style={{ minHeight }}
            >
                {spinnerElement}
            </div>
        );
    }

    return spinnerElement;
};

export default Spinner;
