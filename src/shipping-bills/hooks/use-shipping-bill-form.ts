import { routes } from '@/shared/route-paths'
import { BranchPath } from '@/shipping-bills/components/common/party-fields'
import { saveBill } from '@/shipping-bills/demo-store'
import { Branch, Business, emptyBill, Exporter, SavedBill, ShippingBillFormValues } from '@/shipping-bills/model'
import { billSchema } from '@/shipping-bills/schema/bill-validation'
import { shippingBillMockService } from '@/shipping-bills/services/shipping-bill-mock-service'
import { useFieldArray, useForm } from 'core/form'
import { navigate } from 'core/routing'
import { toast } from 'core/toast-manager'
import { useEffect, useState } from 'react'

export interface QuickAdd {
  kind: 'exporter' | 'business'
  role?: 'consignee' | 'buyer' | 'thirdParty' | 'itemThirdParty'
  invoiceIndex?: number
  itemIndex?: number
}

export interface QuickBranch {
  kind: 'exporter' | 'business'
  ownerId: number
  branchName: BranchPath
}

export function useShippingBillForm(initialBill?: SavedBill) {
  const formCtx = useForm<ShippingBillFormValues>(billSchema, {
    defaultValues: initialBill?.values ?? emptyBill()
  })

  const { control, setValue, formState, getValues } = formCtx.hooks

  // Field arrays
  const invoicesArray = useFieldArray({ control, name: 'invoices' })
  const containersArray = useFieldArray({ control, name: 'containers' })
  const packingRangesArray = useFieldArray({ control, name: 'packingRanges' })
  const documentsArray = useFieldArray({ control, name: 'documents' })
  const licensesArray = useFieldArray({ control, name: 'licenses' })

  // State
  const [activeTab, setActiveTab] = useState<'details' | 'invoices' | 'documents'>('details')
  const [draftId, setDraftId] = useState<number | undefined>(initialBill?.id)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [quickAdd, setQuickAdd] = useState<QuickAdd | null>(null)
  const [quickBranch, setQuickBranch] = useState<QuickBranch | null>(null)

  // Automatic tab switching upon validation error on submit
  useEffect(() => {
    if (!formState.submitCount || !Object.keys(formState.errors).length) return

    toast.error('Please check the required fields')

    const detailsFields = [
      'jobDate',
      'exporterId',
      'exporterBranchId',
      'consigneeId',
      'consigneeBranchId',
      'loadingPort',
      'finalDestinationPort'
    ]

    if (detailsFields.some((field) => field in formState.errors)) {
      setActiveTab('details')
    } else if (formState.errors.invoices) {
      setActiveTab('invoices')
    } else if (
      formState.errors.containers ||
      formState.errors.packingRanges ||
      formState.errors.documents ||
      formState.errors.licenses
    ) {
      setActiveTab('documents')
    }
  }, [formState.submitCount, formState.errors])

  // Submission handler
  async function handleSubmit(data: ShippingBillFormValues) {
    if (isSubmitting) return

    setIsSubmitting(true)
    try {
      const result = await shippingBillMockService.submitShippingBill(data, draftId)
      setDraftId(result.bill.id)
      toast.success(result.message)
      navigate(routes.toShippingBillEdit(result.bill.id))
    } catch (err: unknown) {
      console.error('Failed to submit shipping bill:', err)
      toast.error('Failed to save shipping bill. Please check the values and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Previous button handler
  function handlePrevious() {
    const current = getValues()
    const saved = saveBill(current, draftId)
    setDraftId(saved.id)
    setActiveTab(activeTab === 'documents' ? 'invoices' : 'details')
  }

  // Save & Next button handler
  function handleSaveAndNext() {
    const current = getValues()
    const saved = saveBill(current, draftId)
    setDraftId(saved.id)
    toast.success('Details saved')
    setActiveTab(activeTab === 'details' ? 'invoices' : 'documents')
  }

  // Quick party saved callback
  function handleQuickPartySaved(party: Exporter | Business) {
    const branchId = party.branches[0]?.id
    if (!quickAdd || !branchId) return

    if (quickAdd.kind === 'exporter') {
      setValue('exporterId', String(party.id), { shouldValidate: true })
      setValue('exporterBranchId', String(branchId), { shouldValidate: true })
    } else if (quickAdd.role === 'consignee') {
      setValue('consigneeId', String(party.id), { shouldValidate: true })
      setValue('consigneeBranchId', String(branchId), { shouldValidate: true })
    } else if (quickAdd.role === 'itemThirdParty' && quickAdd.invoiceIndex != null && quickAdd.itemIndex != null) {
      setValue(`invoices.${quickAdd.invoiceIndex}.items.${quickAdd.itemIndex}.itemThirdPartyId`, String(party.id), {
        shouldValidate: true
      })
      setValue(
        `invoices.${quickAdd.invoiceIndex}.items.${quickAdd.itemIndex}.itemThirdPartyBranchId`,
        String(branchId),
        { shouldValidate: true }
      )
    } else if (quickAdd.invoiceIndex != null) {
      const field = quickAdd.role === 'buyer' ? 'buyer' : 'thirdParty'
      setValue(`invoices.${quickAdd.invoiceIndex}.${field}Id`, String(party.id), { shouldValidate: true })
      setValue(`invoices.${quickAdd.invoiceIndex}.${field}BranchId`, String(branchId), { shouldValidate: true })
    }

    setQuickAdd(null)
  }

  // Quick branch saved callback
  function handleQuickBranchSaved(branch: Branch) {
    if (!quickBranch) return
    setValue(quickBranch.branchName as any, String(branch.id), { shouldValidate: true })
    setQuickBranch(null)
  }

  return {
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
  }
}
