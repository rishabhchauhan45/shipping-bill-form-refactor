import { ContainerForm, PackingRangeForm, ShippingBillFormValues } from '@/shipping-bills/model'
import { Button } from 'ui/basic/button'
import { Card, CardContent, CardHeader } from 'ui/basic/card'
import { FormContextData } from 'ui/form'
import { Input } from 'ui/inputs/input'
import { Select } from 'ui/inputs/select'
import { AdvancedAccordion } from '../common/advanced-accordion'
import { EmptyCardState } from '../common/empty-card-state'
import { SectionHeading } from '../common/section-heading'

interface ContainersSectionProps {
  formCtx: FormContextData<ShippingBillFormValues>
  containers: { id: string }[]
  packingRanges: { id: string }[]
  onAddContainer: (item: ContainerForm) => void
  onRemoveContainer: (index: number) => void
  onAddPackingRange: (item: PackingRangeForm) => void
  onRemovePackingRange: (index: number) => void
}

const containerSizeOptions = [
  { value: '20', label: '20 ft' },
  { value: '40', label: '40 ft' },
  { value: '45', label: '45 ft' }
]

const containerSealTypeOptions = [
  { value: 1, label: 'BTSL - Bottle Seal' },
  { value: 2, label: 'ESEAL - Electronic Seal' },
  { value: 3, label: 'RFID - Radio Frequency Identifier' }
]

const dateType = 'date' as 'text'

export function ContainersSection({
  formCtx,
  containers,
  packingRanges,
  onAddContainer,
  onRemoveContainer,
  onAddPackingRange,
  onRemovePackingRange
}: ContainersSectionProps) {
  const { register } = formCtx.hooks

  return (
    <Card>
      <CardHeader title="Cargo & Package Detail" />
      <CardContent className="space-y-5">
        <div className="mb-3 flex items-center justify-between">
          <SectionHeading
            title={`Containers (${containers.length})`}
            description="Add only when the cargo is containerized."
          />
          <Button size="sm" variant="outline" type="button" onClick={() => onAddContainer({ containerNumber: '' })}>
            + Add container
          </Button>
        </div>

        {containers.length === 0 ? (
          <EmptyCardState
            title="No Containers Added"
            description="If your shipment is containerized, add container details and seal numbers here."
            actionLabel="+ Add Container"
            onAction={() => onAddContainer({ containerNumber: '' })}
          />
        ) : (
          <div className="space-y-3">
            {containers.map((field, index) => (
              <div key={field.id} className="rounded-lg border border-gray-200 p-4">
                <div className="mb-3 flex justify-between">
                  <h3 className="text-sm font-semibold">Container {index + 1}</h3>
                  <Button size="sm" variant="ghost" type="button" onClick={() => onRemoveContainer(index)}>
                    Remove
                  </Button>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <Input label="Container number" {...register(`containers.${index}.containerNumber`)} />
                  <Select<ShippingBillFormValues>
                    label="Size"
                    name={`containers.${index}.containerSize`}
                    options={containerSizeOptions}
                    placeholder="Select size"
                  />
                  <Input label="Seal number" {...register(`containers.${index}.exciseSealNumber`)} />
                  <Input label="Seal date" type={dateType} {...register(`containers.${index}.sealDate`)} />
                  <Select<ShippingBillFormValues>
                    label="Seal type"
                    name={`containers.${index}.sealType`}
                    options={containerSealTypeOptions}
                    placeholder="Select if needed"
                  />
                  <Input label="Seal device ID" {...register(`containers.${index}.sealDeviceId`)} />
                  <Input label="Movement document type" {...register(`containers.${index}.movementDocumentType`)} />
                  <Input label="Movement document number" {...register(`containers.${index}.movementDocumentNumber`)} />
                </div>
              </div>
            ))}
          </div>
        )}

        <AdvancedAccordion title={`Packing list ranges (${packingRanges.length})`}>
          <div className="space-y-3">
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => onAddPackingRange({ packingNumberFrom: '', packingNumberTo: '' })}>
              + Add packing range
            </Button>

            {packingRanges.length === 0 ? (
              <EmptyCardState
                title="No Packing Ranges Added"
                description="Specify package number sequences (e.g. 1 to 50) and package types if applicable."
              />
            ) : (
              packingRanges.map((field, index) => (
                <div key={field.id} className="rounded-lg border border-gray-200 p-3">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-medium">Range {index + 1}</span>
                    <Button size="sm" variant="ghost" type="button" onClick={() => onRemovePackingRange(index)}>
                      Remove
                    </Button>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <Input
                      label="Package from"
                      type="number"
                      {...register(`packingRanges.${index}.packingNumberFrom`)}
                    />
                    <Input label="Package to" type="number" {...register(`packingRanges.${index}.packingNumberTo`)} />
                    <Input label="Packing code" {...register(`packingRanges.${index}.packingCode`)} />
                  </div>
                </div>
              ))
            )}
          </div>
        </AdvancedAccordion>
      </CardContent>
    </Card>
  )
}
