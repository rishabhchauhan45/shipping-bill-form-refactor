interface SectionHeadingProps {
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function SectionHeading({ title, description, action, className = 'mb-4' }: SectionHeadingProps) {
  return (
    <div className={`flex flex-wrap items-center justify-between gap-2 ${className}`}>
      <div>
        <h2 className="text-base font-semibold text-gray-950">{title}</h2>
        {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}
