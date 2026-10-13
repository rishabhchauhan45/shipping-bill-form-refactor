import { stateOptions } from '@/data/states'
import { portCountry, ports, ShippingBillFormValues } from '@/shipping-bills/model'
import { optionsMockService } from '@/shipping-bills/services/options-mock-service'
import { Card, CardContent } from 'ui/basic/card'
import { FormContextData } from 'ui/form'
import { Input } from 'ui/inputs/input'
import { Select } from 'ui/inputs/select'
import { AdvancedAccordion } from '../common/advanced-accordion'
import { AsyncSearchSelect } from '../common/async-search-select'
import { SectionHeading } from '../common/section-heading'

interface RouteSectionProps {
  formCtx: FormContextData<ShippingBillFormValues>
}

const portOptions = ports.map((port) => ({
  value: port.code,
  label: `${port.name} · ${port.code}`
}))

const dateType = 'date' as 'text'

const nfeiCategoryOptions = [
  ['01', 'Free trade sample'],
  ['02', 'Diplomatic goods'],
  ['03', 'Warranty replacement'],
  ['07', 'Gift parcel'],
  ['08', 'Other']
].map(([value, label]) => ({ value, label }))

export function RouteSection({ formCtx }: RouteSectionProps) {
  const { register, watch } = formCtx.hooks
  const loadingPort = watch('loadingPort')
  const finalDestinationPort = watch('finalDestinationPort')

  return (
    <Card>
      <CardContent className="space-y-5 pt-6">
        <SectionHeading title="Route" />
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <span className="mb-1 block text-sm font-medium">Port of loading</span>
            <AsyncSearchSelect
              name="loadingPort"
              placeholder="Select Indian port"
              rules={{ required: true }}
              fetchOptions={(q) => optionsMockService.searchLoadingPorts(q)}
              getInitialLabel={async (code) => {
                const port = await optionsMockService.getPortByCode(code)
                return port ? `${port.name} · ${port.code}` : code
              }}
            />
          </div>
          <div>
            <span className="mb-1 block text-sm font-medium">Final destination port</span>
            <AsyncSearchSelect
              name="finalDestinationPort"
              placeholder="Select destination"
              rules={{ required: true }}
              fetchOptions={(q) => optionsMockService.searchDestinationPorts(q)}
              getInitialLabel={async (code) => {
                const port = await optionsMockService.getPortByCode(code)
                return port ? `${port.name} · ${port.code}` : code
              }}
            />
          </div>
        </div>
        <p className="mt-3 text-xs text-gray-500">
          Countries are derived from the port codes when saved: {portCountry(loadingPort) || '—'} →{' '}
          {portCountry(finalDestinationPort) || '—'}.
        </p>

        <AdvancedAccordion title="Regulatory and route exceptions">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Select<ShippingBillFormValues>
              label="Discharge port"
              name="dischargePort"
              options={portOptions}
              placeholder="Defaults to destination"
            />
            <Select<ShippingBillFormValues>
              label="Origin state"
              name="originStateCode"
              options={stateOptions}
              placeholder="Defaults to Branch State Code"
            />
            <div />
            <Select<ShippingBillFormValues>
              label="NFEI category"
              name="nfeiCategory"
              options={nfeiCategoryOptions}
              placeholder="Not applicable"
            />
            <Input label="RBI waiver number" {...register('rbiWaiverNumber')} />
            <Input label="RBI waiver date" type={dateType} {...register('rbiWaiverDate')} />
          </div>
        </AdvancedAccordion>
      </CardContent>
    </Card>
  )
}
