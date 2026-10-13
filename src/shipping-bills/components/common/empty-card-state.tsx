import { Button } from 'ui/basic/button'

interface EmptyCardStateProps {
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  icon?: React.ReactNode
  className?: string
}

export function EmptyCardState({
  title,
  description,
  actionLabel,
  onAction,
  icon,
  className = ''
}: EmptyCardStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50/60 p-6 text-center ${className}`}>
      {icon && <div className="mb-2 text-gray-400">{icon}</div>}
      <h4 className="text-sm font-medium text-gray-800">{title}</h4>
      {description && <p className="mt-1 max-w-sm text-xs text-gray-500">{description}</p>}
      {actionLabel && onAction && (
        <Button variant="outline" size="sm" className="mt-3" onClick={onAction} type="button">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
