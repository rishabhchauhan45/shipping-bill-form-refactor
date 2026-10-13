import { BillInvoiceForm, Business, emptyInvoice, ShippingBillFormValues } from '@/shipping-bills/model'
import { Button } from 'ui/basic/button'
import { FormContextData } from 'ui/form'
import { EmptyCardState } from '../common/empty-card-state'
import { BranchPath } from '../common/party-fields'
import { InvoiceEditorCard } from './invoice-editor-card'

interface InvoiceListSectionProps {
  formCtx: FormContextData<ShippingBillFormValues>
  invoices: { id: string }[]
  invoiceValues: BillInvoiceForm[]
  businesses: Business[]
  onAddInvoice: (invoice: BillInvoiceForm) => void
  onRemoveInvoice: (index: number) => void
  onQuickAdd: (role: 'buyer' | 'thirdParty' | 'itemThirdParty', invoiceIndex: number, itemIndex?: number) => void
  onAddBranch: (ownerId: number, branchName: BranchPath) => void
}

export function InvoiceListSection({
  formCtx,
  invoices,
  invoiceValues,
  businesses,
  onAddInvoice,
  onRemoveInvoice,
  onQuickAdd,
  onAddBranch
}: InvoiceListSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-gray-950">Invoices & goods</h2>
          <p className="text-sm text-gray-500">One invoice and one item are ready to fill in.</p>
        </div>
        <Button variant="outline" type="button" onClick={() => onAddInvoice(emptyInvoice())}>
          + Add invoice
        </Button>
      </div>

      {invoices.length === 0 ? (
        <EmptyCardState
          title="No Invoices Added"
          description="A shipping bill requires at least one invoice. Click below to add an invoice."
          actionLabel="+ Add Invoice"
          onAction={() => onAddInvoice(emptyInvoice())}
        />
      ) : (
        invoices.map((field, index) => (
          <InvoiceEditorCard
            key={field.id}
            formCtx={formCtx}
            index={index}
            invoice={invoiceValues[index] ?? emptyInvoice()}
            businesses={businesses}
            canRemove={invoices.length > 1}
            onRemove={() => onRemoveInvoice(index)}
            onQuickAdd={onQuickAdd}
            onAddBranch={onAddBranch}
          />
        ))
      )}
    </div>
  )
}
