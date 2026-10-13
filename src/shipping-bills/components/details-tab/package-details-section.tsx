import { cargoOptions, sealTypes, weightUnits } from '@/data/types'
import { ShippingBillFormValues } from '@/shipping-bills/model'
import { MarksAndNumbersOption, optionsMockService } from '@/shipping-bills/services/options-mock-service'
import { useEffect, useRef, useState } from 'react'
import { Card, CardContent } from 'ui/basic/card'
import { FormContextData } from 'ui/form'
import { Input } from 'ui/inputs/input'
import { Select } from 'ui/inputs/select'
import { AdvancedAccordion } from '../common/advanced-accordion'
import { SectionHeading } from '../common/section-heading'

interface PackageDetailsSectionProps {
  formCtx: FormContextData<ShippingBillFormValues>
  containersCount: number
}

export function PackageDetailsSection({ formCtx, containersCount }: PackageDetailsSectionProps) {
  const { register, setValue, watch } = formCtx.hooks
  const exporterId = watch('exporterId')

  const [marksAndNumbersOptions, setMarksAndNumbersOptions] = useState<MarksAndNumbersOption[]>([])
  const [marksLoading, setMarksLoading] = useState(false)
  const [marksError, setMarksError] = useState<string | null>(null)
  const previousExporterId = useRef(exporterId)

  // Fetch marks and numbers when exporter changes
  useEffect(() => {
    if (previousExporterId.current !== exporterId) {
      previousExporterId.current = exporterId
      setValue('marksAndNumbers', '', { shouldValidate: true })
    }

    let active = true
    setMarksAndNumbersOptions([])
    setMarksError(null)

    if (!exporterId) {
      setMarksLoading(false)
      return
    }

    setMarksLoading(true)
    void optionsMockService
      .getMarksAndNumbersOptions(exporterId)
      .then((opts) => {
        if (active) {
          setMarksAndNumbersOptions(opts)
          setMarksLoading(false)
        }
      })
      .catch(() => {
        if (active) {
          setMarksAndNumbersOptions([])
          setMarksLoading(false)
          setMarksError('Failed to load marks and numbers')
        }
      })

    return () => {
      active = false
    }
  }, [exporterId, setValue])

  const marksPlaceholder = !exporterId
    ? 'Select exporter first'
    : marksLoading
      ? 'Loading marks and numbers...'
      : marksError
        ? marksError
        : marksAndNumbersOptions.length === 0
          ? 'No marks found for exporter'
          : 'Select marks and numbers'

  return (
    <Card>
      <CardContent className="space-y-5 pt-6">
        <SectionHeading title="Package Detail" />
        <div className="grid gap-4 pb-4 sm:grid-cols-2 lg:grid-cols-4">
          <Select<ShippingBillFormValues> label="Nature of cargo" name="natureOfCargo" options={cargoOptions} />
          <Input label="Gross weight" type="number" {...register('grossWeight')} />
          <Input label="Net weight" type="number" {...register('netWeight')} />
          <Select<ShippingBillFormValues> label="Weight unit" name="measurementUnit" options={weightUnits} />
          <Input label="Total packages" type="number" {...register('totalPackages')} />
          <Select<ShippingBillFormValues>
            label="Marks and numbers"
            name="marksAndNumbers"
            options={marksAndNumbersOptions}
            placeholder={marksPlaceholder}
            disabled={!exporterId || marksLoading || !marksAndNumbersOptions.length}
            wrapClass="sm:col-span-3"
          />
        </div>

        <AdvancedAccordion title="Additional Details">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Select<ShippingBillFormValues>
              label="Seal type"
              name="sealType"
              options={sealTypes}
              placeholder="Select if relevant"
            />
            {containersCount === 0 && (
              <Input label="Number of containers" type="number" {...register('numberOfContainers')} />
            )}
            <Input label="Loose packets" type="number" {...register('loosePackets')} />
            <Input label="MAWB number" {...register('mawbNumber')} />
            <Input label="HAWB number" {...register('hawbNumber')} />
          </div>
        </AdvancedAccordion>
      </CardContent>
    </Card>
  )
}
