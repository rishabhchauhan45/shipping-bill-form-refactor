import { RrCaretDown } from 'icons/rr/fi-rr-caret-down'

interface AdvancedAccordionProps {
  title: string
  children: React.ReactNode
  open?: boolean
  onToggle?: (isOpen: boolean) => void
  className?: string
}

export function AdvancedAccordion({ title, children, open, onToggle, className = '' }: AdvancedAccordionProps) {
  return (
    <details
      className={`group rounded-lg border border-gray-200 bg-gray-50/50 p-4 transition-colors ${className}`}
      open={open}
      onToggle={(e) => onToggle?.(e.currentTarget.open)}>
      <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium text-gray-700 hover:text-gray-900">
        <span>{title}</span>
        <RrCaretDown className="size-3.5 text-gray-400 transition-transform group-open:rotate-180" />
      </summary>
      <div className="mt-4">{children}</div>
    </details>
  )
}
