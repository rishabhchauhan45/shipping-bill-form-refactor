import { LicenseForm, ShippingBillFormValues } from '@/shipping-bills/model'
import { Button } from 'ui/basic/button'
import { Card, CardContent, CardHeader } from 'ui/basic/card'
import { FormContextData } from 'ui/form'
import { Input } from 'ui/inputs/input'
import { Select } from 'ui/inputs/select'
import { EmptyCardState } from '../common/empty-card-state'

interface LicensesSectionProps {
  formCtx: FormContextData<ShippingBillFormValues>
  licenses: { id: string }[]
  onAddLicense: (license: LicenseForm) => void
  onRemoveLicense: (index: number) => void
}

const goodsSourceOptions = [
  { value: 'I', label: 'Imported' },
  { value: 'D', label: 'Indigenous' }
]

const dateType = 'date' as 'text'

export function LicensesSection({ formCtx, licenses, onAddLicense, onRemoveLicense }: LicensesSectionProps) {
  const { register } = formCtx.hooks

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-gray-950">Licences</h3>
          <p className="mt-1 text-sm text-gray-500">Only enter these for schemes that require a licence.</p>
        </div>
        <Button variant="outline" size="sm" type="button" onClick={() => onAddLicense({ registrationNumber: '' })}>
          + Add licence
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {licenses.length === 0 ? (
          <EmptyCardState
            title="No Licences Added"
            description="If your export scheme is subject to duty exemption or advance licensing, add license details here."
            actionLabel="+ Add Licence"
            onAction={() => onAddLicense({ registrationNumber: '' })}
          />
        ) : (
          licenses.map((field, index) => (
            <div key={field.id} className="rounded-lg border border-gray-200 p-4">
              <div className="mb-3 flex justify-between">
                <h3 className="text-sm font-semibold">Licence {index + 1}</h3>
                <Button size="sm" variant="ghost" type="button" onClick={() => onRemoveLicense(index)}>
                  Remove
                </Button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Input label="Registration number" {...register(`licenses.${index}.registrationNumber`)} />
                <Input label="Registration date" type={dateType} {...register(`licenses.${index}.registrationDate`)} />
                <Input
                  label="Invoice serial number"
                  type="number"
                  {...register(`licenses.${index}.invoiceSerialNumber`)}
                />
                <Input label="Item serial number" type="number" {...register(`licenses.${index}.itemSerialNumber`)} />
                <Input
                  label="Licence serial number"
                  type="number"
                  {...register(`licenses.${index}.licenseSerialNumber`)}
                />
                <Input label="Item serial, Part E" {...register(`licenses.${index}.itemSerialNumberPartE`)} />
                <Input label="Item serial, Part C" {...register(`licenses.${index}.itemSerialNumberPartC`)} />
                <Input label="Licence quantity" type="number" {...register(`licenses.${index}.licenseQuantity`)} />
                <Input label="Export quantity" type="number" {...register(`licenses.${index}.licenseExportQuantity`)} />
                <Select<ShippingBillFormValues>
                  label="Goods source"
                  name={`licenses.${index}.indigenousOrImported`}
                  options={goodsSourceOptions}
                  placeholder="Select if needed"
                />
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
