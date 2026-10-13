import { routes } from '@/shared/route-paths'
import { Form } from 'core/form/components'
import { navigate, useParams } from 'core/routing'
import { Button } from 'ui/basic/button'
import { Tabs, TabsList, TabsTrigger } from 'ui/interactive/tabs'
import { PersistentTab } from './components/common/persistent-tab'
import { PackageDetailsSection } from './components/details-tab/package-details-section'
import { RouteSection } from './components/details-tab/route-section'
import { ShipmentBasicsSection } from './components/details-tab/shipment-basics-section'
import { FormNavigationBar } from './components/form-navigation-bar'
import { InvoiceListSection } from './components/invoices-tab/invoice-list-section'
import { ContainersSection } from './components/others-tab/containers-section'
import { DocumentsSection } from './components/others-tab/documents-section'
import { LicensesSection } from './components/others-tab/licenses-section'
import { useDemoData } from './demo-store'
import { useShippingBillForm } from './hooks/use-shipping-bill-form'
import { SavedBill } from './model'
import { BranchDialog, PartyDialog } from './party-dialogs'
import { shippingBillService } from './shipping-bill-service'
import { workflowSteps } from './workflow'

function BillEditor({ bill }: { bill?: SavedBill }) {
  const { exporters, businesses } = useDemoData()
  const {
    formCtx,
    activeTab,
    setActiveTab,
    isSubmitting,
    invoicesArray,
    containersArray,
    packingRangesArray,
    documentsArray,
    licensesArray,
    quickAdd,
    setQuickAdd,
    quickBranch,
    setQuickBranch,
    handleSubmit,
    handlePrevious,
    handleSaveAndNext,
    handleQuickPartySaved,
    handleQuickBranchSaved
  } = useShippingBillForm(bill)

  const invoiceValues = formCtx.hooks.watch('invoices')

  return (
    <div className="space-y-5">
      {/* Header and Workflow Navigation */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <button
            type="button"
            className="mb-2 text-sm text-gray-500 hover:underline"
            onClick={() => navigate(routes.dashboard)}>
            ← Shipping bills
          </button>
          <h1 className="text-2xl font-semibold text-gray-950">
            {bill ? `Edit shipping bill #${bill.id}` : 'New shipping bill'}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Enter the everyday details first. Open advanced sections only when needed.
          </p>
        </div>
      </div>

      {/* Workflow Steps Indicator */}
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {workflowSteps.map((step, index) => {
          const isShippingBill = step.id === 'shipping-bill'
          return (
            <div
              key={step.id}
              className={`rounded-lg border p-3 ${
                isShippingBill ? 'border-primary-300 bg-primary-50' : 'border-gray-200 bg-gray-50'
              }`}>
              <div className="flex items-center gap-2 text-sm font-medium">
                <span className="flex size-6 items-center justify-center rounded-full bg-white text-xs">
                  {index + 1}
                </span>
                {step.title}
              </div>
              <p className="ml-8 text-xs text-gray-500">{step.description}</p>
            </div>
          )
        })}
      </div>

      {/* Main Multi-Tab Form */}
      <Form ctx={formCtx} handleSubmit={handleSubmit} className="space-y-5">
        <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as 'details' | 'invoices' | 'documents')}>
          <TabsList className="flex w-full justify-start overflow-x-auto">
            <TabsTrigger value="details">1. Details</TabsTrigger>
            <TabsTrigger value="invoices">2. Invoices & goods</TabsTrigger>
            <TabsTrigger value="documents">3. Others</TabsTrigger>
          </TabsList>

          {/* Tab 1: Shipment Details */}
          <PersistentTab value="details" activeTab={activeTab} className="space-y-4">
            <ShipmentBasicsSection
              formCtx={formCtx}
              exporters={exporters}
              consignees={businesses}
              onQuickAddExporter={() => setQuickAdd({ kind: 'exporter' })}
              onQuickAddConsignee={() => setQuickAdd({ kind: 'business', role: 'consignee' })}
              onAddExporterBranch={(ownerId) =>
                setQuickBranch({ kind: 'exporter', ownerId, branchName: 'exporterBranchId' })
              }
              onAddConsigneeBranch={(ownerId) =>
                setQuickBranch({ kind: 'business', ownerId, branchName: 'consigneeBranchId' })
              }
            />
            <RouteSection formCtx={formCtx} />
            <PackageDetailsSection formCtx={formCtx} containersCount={containersArray.fields.length} />
          </PersistentTab>

          {/* Tab 2: Invoices & Goods */}
          <PersistentTab value="invoices" activeTab={activeTab} className="space-y-4">
            <InvoiceListSection
              formCtx={formCtx}
              invoices={invoicesArray.fields}
              invoiceValues={invoiceValues}
              businesses={businesses}
              onAddInvoice={invoicesArray.append}
              onRemoveInvoice={invoicesArray.remove}
              onQuickAdd={(role, invoiceIndex, itemIndex) =>
                setQuickAdd({ kind: 'business', role, invoiceIndex, itemIndex })
              }
              onAddBranch={(ownerId, branchName) => setQuickBranch({ kind: 'business', ownerId, branchName })}
            />
          </PersistentTab>

          {/* Tab 3: Containers, Packing, Documents, Licences */}
          <PersistentTab value="documents" activeTab={activeTab} className="space-y-4">
            <ContainersSection
              formCtx={formCtx}
              containers={containersArray.fields}
              packingRanges={packingRangesArray.fields}
              onAddContainer={containersArray.append}
              onRemoveContainer={containersArray.remove}
              onAddPackingRange={packingRangesArray.append}
              onRemovePackingRange={packingRangesArray.remove}
            />
            <DocumentsSection
              formCtx={formCtx}
              documents={documentsArray.fields}
              onAddDocument={documentsArray.append}
              onRemoveDocument={documentsArray.remove}
            />
            <LicensesSection
              formCtx={formCtx}
              licenses={licensesArray.fields}
              onAddLicense={licensesArray.append}
              onRemoveLicense={licensesArray.remove}
            />
          </PersistentTab>
        </Tabs>

        {/* Bottom Actions Bar */}
        <FormNavigationBar
          activeTab={activeTab}
          isSubmitting={isSubmitting}
          onCancel={() => navigate(routes.dashboard)}
          onPrevious={handlePrevious}
          onSaveAndNext={handleSaveAndNext}
        />
      </Form>

      {/* Quick Add Party Modal */}
      {quickAdd && (
        <PartyDialog
          key={`${quickAdd.kind}-${quickAdd.role ?? 'exporter'}-${quickAdd.invoiceIndex ?? 0}`}
          kind={quickAdd.kind}
          initialRole={quickAdd.role === 'itemThirdParty' ? 'thirdParty' : quickAdd.role}
          onClose={() => setQuickAdd(null)}
          onSaved={handleQuickPartySaved}
        />
      )}

      {/* Quick Add Branch Modal */}
      {quickBranch && (
        <BranchDialog
          key={`${quickBranch.kind}-${quickBranch.ownerId}`}
          kind={quickBranch.kind}
          ownerId={quickBranch.ownerId}
          onClose={() => setQuickBranch(null)}
          onSaved={handleQuickBranchSaved}
        />
      )}
    </div>
  )
}

export default function ShippingBillPage() {
  const { id } = useParams<{ id?: string }>()
  const { bills } = useDemoData()
  const bill = id ? (bills.find((item) => item.id === Number(id)) ?? shippingBillService.getById(id)) : undefined

  if (id && !bill) {
    return (
      <div className="space-y-3">
        <h1 className="text-xl font-semibold">Shipping bill not found</h1>
        <Button onClick={() => navigate(routes.dashboard)}>Back to list</Button>
      </div>
    )
  }

  return <BillEditor key={id ?? 'new'} bill={bill} />
}
