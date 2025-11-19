import React from 'react'

interface CardProps {
    children?: React.ReactNode;
    width?: string;
    title?: React.ReactNode;
    bodyText?: React.ReactNode;
    className?: string;
}

const Card: React.FC<CardProps> = ({
    children,
    width = 'max-w-md',
    title,
    bodyText,
    className = '',
}) => {
    const classes = [
        'flex',
        'flex-col',
        width,
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