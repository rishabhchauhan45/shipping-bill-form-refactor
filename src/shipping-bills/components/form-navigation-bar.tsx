import { Button } from 'ui/basic/button'
import { Spinner } from 'ui/notify/spinner'

interface FormNavigationBarProps {
  activeTab: string
  isSubmitting: boolean
  onCancel: () => void
  onPrevious: () => void
  onSaveAndNext: () => void
}

export function FormNavigationBar({
  activeTab,
  isSubmitting,
  onCancel,
  onPrevious,
  onSaveAndNext
}: FormNavigationBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 pt-5">
      <Button variant="outline" type="button" onClick={onCancel} disabled={isSubmitting}>
        Cancel
      </Button>

      <div className="flex items-center gap-2">
        {activeTab !== 'details' && (
          <Button variant="outline" type="button" onClick={onPrevious} disabled={isSubmitting}>
            Previous
          </Button>
        )}

        {activeTab !== 'documents' ? (
          <Button type="button" onClick={onSaveAndNext} disabled={isSubmitting}>
            Save & Next
          </Button>
        ) : (
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Spinner size="sm" />
                <span>Saving changes...</span>
              </span>
            ) : (
              'Save changes'
            )}
          </Button>
        )}
      </div>
    </div>
  )
}
