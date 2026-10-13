import { Business, Exporter, ShippingBillFormValues } from '@/shipping-bills/model'
import { Card, CardContent, CardHeader } from 'ui/basic/card'
import { FormContextData } from 'ui/form'
import { PartyFields } from '../common/party-fields'

interface ShipmentBasicsSectionProps {
  formCtx: FormContextData<ShippingBillFormValues>
  exporters: Exporter[]
  consignees: Business[]
  onQuickAddExporter: () => void
  onQuickAddConsignee: () => void
  onAddExporterBranch: (ownerId: number) => void
  onAddConsigneeBranch: (ownerId: number) => void
}

export function ShipmentBasicsSection({
  formCtx,
  exporters,
  consignees,
  onQuickAddExporter,
  onQuickAddConsignee,
  onAddExporterBranch,
  onAddConsigneeBranch
}: ShipmentBasicsSectionProps) {
  const { watch } = formCtx.hooks
  const currentExporterId = watch('exporterId')
  const currentConsigneeId = watch('consigneeId')

  const availableExporters = exporters.filter((item) => !item.disabled || String(item.id) === currentExporterId)
  const availableConsignees = consignees.filter(
    (business) => business.isConsignee || String(business.id) === currentConsigneeId
  )

  return (
    <Card>
      <CardHeader title="Shipment basics" description="Parties and route are the core details for this bill." />
      <CardContent className="space-y-5">
        <PartyFields
          formCtx={formCtx}
          ownerName="exporterId"
          branchName="exporterBranchId"
          label="Exporter"
          kind="exporter"
          parties={availableExporters}
          onQuickAdd={onQuickAddExporter}
          onAddBranch={onAddExporterBranch}
        />
        <PartyFields
          formCtx={formCtx}
          ownerName="consigneeId"
          branchName="consigneeBranchId"
          label="Consignee"
          kind="business"
          parties={availableConsignees}
          onQuickAdd={onQuickAddConsignee}
          onAddBranch={onAddConsigneeBranch}
        />
      </CardContent>
    </Card>
  )
}
