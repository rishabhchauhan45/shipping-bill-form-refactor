interface PersistentTabProps {
  value: string
  activeTab: string
  children: React.ReactNode
  className?: string
}

/**
 * Keep fields registered in the DOM while another tab is active
 * so React Hook Form validates the entire multi-tab bill on submission.
 */
export function PersistentTab({ value, activeTab, children, className = '' }: PersistentTabProps) {
  return (
    <div role="tabpanel" hidden={activeTab !== value} className={`mt-3 ${className}`}>
      {children}
    </div>
  )
}
