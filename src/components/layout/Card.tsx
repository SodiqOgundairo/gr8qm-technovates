import React from 'react'

interface CardProps {
    children?: React.ReactNode;
    /** width utility (e.g. 'max-w-md') */
    width?: string;
    title?: React.ReactNode;
    bodyText?: React.ReactNode;
    /** Tailwind utility or custom class for background (e.g. 'bg-white' or 'bg-skyblue') */
    bgClass?: string;
    /** Tailwind utility or custom class for border (e.g. 'border border-gray-200' or 'border-b-4 border-skyblue') */
    borderClass?: string;
    /** Tailwind utility for shadow (e.g. 'shadow-md') */
    shadowClass?: string;
    /** Tailwind utility for rounding (e.g. 'rounded-lg') */
    roundedClass?: string;
    /** Tailwind utility for padding (e.g. 'p-4', 'px-6 py-4') */
    paddingClass?: string;
    /** Additional classes to apply */
    className?: string;
    /** Inline style fallback */
    style?: React.CSSProperties;
}

const Card: React.FC<CardProps> = ({
    children,
    width = 'max-w-md',
    title,
    bodyText,
    // bgClass = 'bg-white',
    // borderClass = 'border border-gray-100',
    // shadowClass = 'shadow-sm',
    // roundedClass = 'rounded-md',
    // paddingClass = 'p-4',
    className = '',
    style,
}) => {
    const classes = [
        'flex',
        'flex-col',
        width,
        // bgClass,
        // borderClass,
        // shadowClass,
        // roundedClass,
        // paddingClass,
        className,
    ]
        .filter(Boolean)
        .join(' ')

    return (
        <div className={classes}>
            {title && <div className="text-lg font-bold mb-2">{title}</div>}
            {bodyText && <div className="text-sm mb-3">{bodyText}</div>}
            {children}
        </div>
    )
}

export default Card;