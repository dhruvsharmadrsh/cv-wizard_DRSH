import type { ReactNode } from "react";
import React, { createContext, useContext, useState } from "react";
import { cn } from "~/lib/utils";

interface AccordionContextType {
    activeItems: string[];
    toggleItem: (id: string) => void;
    isItemActive: (id: string) => boolean;
}

const AccordionContext = createContext<AccordionContextType | undefined>(
    undefined
);

const useAccordion = () => {
    const context = useContext(AccordionContext);
    if (!context) {
        throw new Error("Accordion components must be used within an Accordion");
    }
    return context;
};

interface AccordionProps {
    children: ReactNode;
    defaultOpen?: string;
    allowMultiple?: boolean;
    className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
    children,
    defaultOpen,
    allowMultiple = false,
    className = "",
}) => {
    const [activeItems, setActiveItems] = useState<string[]>(
        defaultOpen ? [defaultOpen] : []
    );

    const toggleItem = (id: string) => {
        setActiveItems((prev) => {
            if (allowMultiple) {
                return prev.includes(id)
                    ? prev.filter((item) => item !== id)
                    : [...prev, id];
            } else {
                return prev.includes(id) ? [] : [id];
            }
        });
    };

    const isItemActive = (id: string) => activeItems.includes(id);

    return (
        <AccordionContext.Provider
            value={{ activeItems, toggleItem, isItemActive }}
        >
            <div className={`accordion-root ${className}`}>{children}</div>

            <style>{`
                .accordion-root {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .accordion-item {
                    position: relative;
                    overflow: hidden;
                    background: #1a1a1a;
                    border: 1px solid #3c3c3c;
                    transition: border-color 0.4s ease;
                }

                .accordion-item:hover {
                    border-color: #555;
                }

                .accordion-item--active {
                    border-color: #7e7e7e;
                }

                /* M-stripe left accent for active */
                .accordion-item__accent {
                    position: absolute;
                    left: 0;
                    top: 0;
                    bottom: 0;
                    width: 3px;
                    display: flex;
                    flex-direction: column;
                    z-index: 5;
                }

                .accordion-item__accent-s1 { flex: 1; background: #0066b1; }
                .accordion-item__accent-s2 { flex: 1; background: #1c69d4; }
                .accordion-item__accent-s3 { flex: 1; background: #e22718; }

                /* Header */
                .accordion-header-btn {
                    width: 100%;
                    padding: 16px 24px;
                    text-align: left;
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    cursor: pointer;
                    background: transparent;
                    border: none;
                    color: inherit;
                    font: inherit;
                    transition: background 0.3s ease;
                }

                .accordion-header-btn:hover,
                .accordion-header-btn--active {
                    background: #0d0d0d;
                }

                .accordion-header-btn:focus {
                    outline: none;
                }

                .accordion-chevron {
                    width: 20px;
                    height: 20px;
                    color: #7e7e7e;
                    transition: transform 0.3s ease, color 0.3s ease;
                    flex-shrink: 0;
                }

                .accordion-header-btn:hover .accordion-chevron,
                .accordion-chevron--active {
                    color: #fff;
                }

                .accordion-chevron--active {
                    transform: rotate(180deg);
                }

                /* Content */
                .accordion-content {
                    overflow: hidden;
                    transition: max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
                    max-height: 0;
                    opacity: 0;
                }

                .accordion-content--active {
                    max-height: 2000px;
                    opacity: 1;
                }

                .accordion-content__inner {
                    padding: 16px 24px 24px;
                    border-top: 1px solid #262626;
                    background: #1a1a1a;
                }
            `}</style>
        </AccordionContext.Provider>
    );
};

interface AccordionItemProps {
    id: string;
    children: ReactNode;
    className?: string;
}

export const AccordionItem: React.FC<AccordionItemProps> = ({
    id,
    children,
    className = "",
}) => {
    const { isItemActive } = useAccordion();
    const isActive = isItemActive(id);

    return (
        <div className={cn(
            "accordion-item",
            isActive && "accordion-item--active",
            className
        )}>
            {/* M-stripe left accent */}
            {isActive && (
                <div className="accordion-item__accent">
                    <div className="accordion-item__accent-s1" />
                    <div className="accordion-item__accent-s2" />
                    <div className="accordion-item__accent-s3" />
                </div>
            )}
            
            <div className="relative">
                {children}
            </div>
        </div>
    );
};

interface AccordionHeaderProps {
    itemId: string;
    children: ReactNode;
    className?: string;
    icon?: ReactNode;
    iconPosition?: "left" | "right";
}

export const AccordionHeader: React.FC<AccordionHeaderProps> = ({
    itemId,
    children,
    className = "",
    icon,
    iconPosition = "right",
}) => {
    const { toggleItem, isItemActive } = useAccordion();
    const isActive = isItemActive(itemId);

    const defaultIcon = (
        <svg
            className={cn(
                "accordion-chevron",
                isActive && "accordion-chevron--active"
            )}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
            />
        </svg>
    );

    return (
        <button
            onClick={() => toggleItem(itemId)}
            className={cn(
                "accordion-header-btn",
                isActive && "accordion-header-btn--active",
                className
            )}
        >
            <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-4">
                    {iconPosition === "left" && (icon || defaultIcon)}
                    <div className="flex-1">{children}</div>
                </div>
                {iconPosition === "right" && (icon || defaultIcon)}
            </div>
        </button>
    );
};

interface AccordionContentProps {
    itemId: string;
    children: ReactNode;
    className?: string;
}

export const AccordionContent: React.FC<AccordionContentProps> = ({
    itemId,
    children,
    className = "",
}) => {
    const { isItemActive } = useAccordion();
    const isActive = isItemActive(itemId);

    return (
        <div
            className={cn(
                "accordion-content",
                isActive && "accordion-content--active",
                className
            )}
        >
            <div className="accordion-content__inner">
                {children}
            </div>
        </div>
    );
};

export const accordionStyles = ``;