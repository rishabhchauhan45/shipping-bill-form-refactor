import { quantityCodes } from '@/data/quantity-code'
import schemeCodes from '@/data/scheme-codes'
import { Trades } from '@/data/trade-agrements'
import { BillInvoiceForm, BillItemForm, Business, lineTotal, ShippingBillFormValues } from '@/shipping-bills/model'
import { Button } from 'ui/basic/button'
import { FormContextData } from 'ui/form'
import { Checkbox } from 'ui/inputs/checkbox'
import { Input } from 'ui/inputs/input'
import { Select } from 'ui/inputs/select'
import { AdvancedAccordion } from '../common/advanced-accordion'
import { BranchPath, PartyFields } from '../common/party-fields'

interface GoodsItemCardProps {
  formCtx: FormContextData<ShippingBillFormValues>
  invoiceIndex: number
  itemIndex: number
  item: BillItemForm
  invoice: BillInvoiceForm
  canRemove: boolean
  businesses: Business[]
  onRemove: () => void
  onQuickAdd: (role: 'itemThirdParty', invoiceIndex: number, itemIndex: number) => void
  onAddBranch: (ownerId: number, branchName: BranchPath) => void
}

const dateType = 'date' as 'text'

export function GoodsItemCard({
  formCtx,
  invoiceIndex,
  itemIndex,
  item,
  invoice,
  canRemove,
  businesses,
  onRemove,
  onQuickAdd,
  onAddBranch
}: GoodsItemCardProps) {
  const { register } = formCtx.hooks

  const selectedScheme = schemeCodes.find((s) => s.value === item.schemeCode)
  const showDrawback = selectedScheme && (selectedScheme.drawback || selectedScheme.RODTEP || selectedScheme.ROSCTL)

  const thirdPartyOptions = businesses.filter(
    (business) => business.isThirdParty || business.id === Number(item.itemThirdPartyId)
  )

  const lineTotalCalculated = lineTotal(item).toLocaleString(undefined, { maximumFractionDigits: 2 })

  return (
    <div className="rounded-lg border border-gray-200 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-sm font-semibold">Item {itemIndex + 1}</h4>
        {canRemove && (
          <Button size="sm" variant="ghost" type="button" onClick={onRemove}>
            Remove
          </Button>
        )}
      </div>

      <div className="mb-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
        <Input
          label="RITC / HS code"
          {...register(`invoices.${invoiceIndex}.items.${itemIndex}.ritcCode`)}
          placeholder="e.g. 61091000"
        />
        <Select<ShippingBillFormValues>
          label="Scheme code"
          name={`invoices.${invoiceIndex}.items.${itemIndex}.schemeCode`}
          options={schemeCodes}
          placeholder="Select scheme"
        />
        <Input
          label="Goods description"
          {...register(`invoices.${invoiceIndex}.items.${itemIndex}.goodsDescription1`)}
          wrapClass="lg:col-span-4"
          placeholder="e.g. Cotton T-shirts"
        />
        <Input label="Quantity" type="number" {...register(`invoices.${invoiceIndex}.items.${itemIndex}.quantity`)} />
        <Select<ShippingBillFormValues>
          label="Unit"
          name={`invoices.${invoiceIndex}.items.${itemIndex}.unitOfMeasurement`}
          options={quantityCodes}
          rules={{ required: true }}
        />
        <Input
          label={`Unit price (${invoice.currency || 'currency'})`}
          type="number"
          {...register(`invoices.${invoiceIndex}.items.${itemIndex}.unitPrice`)}
        />
        <Input
          label="Item Total"
          type="number"
          placeholder={`${invoice.currency} ${lineTotalCalculated}`}
          {...register(`invoices.${invoiceIndex}.items.${itemIndex}.lineTotal`)}
        />
        <Select<ShippingBillFormValues>
          label="IGST payment"
          name={`invoices.${invoiceIndex}.items.${itemIndex}.igstPaymentStatus`}
          options={[
            { value: 'NA', label: 'Not applicable' },
            { value: 'LUT', label: 'Under LUT / bond' },
            { value: 'P', label: 'Against payment' }
          ]}
          placeholder="Select if applicable"
        />
      </div>

      {/* Row 3: Drawback inputs (conditional) + Checkboxes */}
      <div className="mb-3 flex flex-wrap items-end gap-4">
        {showDrawback && (
          <>
            <div className="w-36">
              <Input
                label="Drawback Serial no."
                {...register(`invoices.${invoiceIndex}.items.${itemIndex}.drawbackSerialNumber`)}
              />
            </div>
            <div className="w-32">
              <Input label="Drawback Unit" {...register(`invoices.${invoiceIndex}.items.${itemIndex}.drawbackUnit`)} />
            </div>
            <div className="w-36">
              <Input
                label="Drawback Quantity"
                type="number"
                {...register(`invoices.${invoiceIndex}.items.${itemIndex}.drawbackQuantity`)}
              />
            </div>
          </>
        )}
        <label className="flex items-center gap-2 pb-1 text-sm">
          <Checkbox {...register(`invoices.${invoiceIndex}.items.${itemIndex}.rewardItem`)} />
          Claim reward
        </label>
        <label className="flex items-center gap-2 pb-1 text-sm">
          <Checkbox {...register(`invoices.${invoiceIndex}.items.${itemIndex}.thirdPartyItem`)} />
          Third-party item
        </label>
      </div>

      {item.thirdPartyItem && (
        <div className="my-4">
          <PartyFields
            formCtx={formCtx}
            ownerName={`invoices.${invoiceIndex}.items.${itemIndex}.itemThirdPartyId`}
            branchName={`invoices.${invoiceIndex}.items.${itemIndex}.itemThirdPartyBranchId`}
            label="Item third party"
            kind="business"
            parties={thirdPartyOptions}
            onQuickAdd={() => onQuickAdd('itemThirdParty', invoiceIndex, itemIndex)}
            onAddBranch={(ownerId) =>
              onAddBranch(ownerId, `invoices.${invoiceIndex}.items.${itemIndex}.itemThirdPartyBranchId`)
            }
          />
        </div>
      )}

      <AdvancedAccordion title="Item customs, taxes and incentives">
        <div className="mb-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Select<ShippingBillFormValues>
            label="Unit of rate"
            {...register(`invoices.${invoiceIndex}.items.${itemIndex}.unitOfRate`)}
            options={quantityCodes}
            placeholder={item.unitOfMeasurement || 'Unit'}
          />
          <Input
            label="Per Unit (Rate)"
            type="number"
            placeholder="1"
            {...register(`invoices.${invoiceIndex}.items.${itemIndex}.numberOfUnits`)}
          />
          <Input
            label="Present market value"
            type="number"
            {...register(`invoices.${invoiceIndex}.items.${itemIndex}.presentMarketValue`)}
          />
          <Input label="GCess" type="number" {...register(`invoices.${invoiceIndex}.items.${itemIndex}.cess`)} />
          <Input
            label="Accessories description"
            wrapClass="lg:col-span-3"
            {...register(`invoices.${invoiceIndex}.items.${itemIndex}.accessoriesDescription`)}
          />
          <Select<ShippingBillFormValues>
            label="Accessory status"
            name={`invoices.${invoiceIndex}.items.${itemIndex}.accessoryStatus`}
            options={[
              { value: '0', label: 'No accessory' },
              { value: '1', label: 'Included free of cost' },
              { value: '2', label: 'Entered separately' }
            ]}
            placeholder="Select if relevant"
          />
          {item.igstPaymentStatus === 'P' && (
            <>
              <Input
                label="Taxable value"
                type="number"
                {...register(`invoices.${invoiceIndex}.items.${itemIndex}.taxableValue`)}
              />
              <Input
                label="IGST amount"
                type="number"
                {...register(`invoices.${invoiceIndex}.items.${itemIndex}.igstAmount`)}
              />
            </>
          )}
          <Input
            label="Origin district code"
            {...register(`invoices.${invoiceIndex}.items.${itemIndex}.originDistrictCode`)}
          />
          <Select<ShippingBillFormValues>
            label="Trade agreement code"
            name={`invoices.${invoiceIndex}.items.${itemIndex}.tradeAgreementsCode`}
            options={Trades}
            placeholder="NCPTI"
          />
          <Input label="End use code" {...register(`invoices.${invoiceIndex}.items.${itemIndex}.endUseOfItem`)} />
          <Input
            label="Packages for item"
            type="number"
            {...register(`invoices.${invoiceIndex}.items.${itemIndex}.totalPackage`)}
          />
        </div>

        <AdvancedAccordion title="AR4 / excise details">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Input label="AR4 number" {...register(`invoices.${invoiceIndex}.items.${itemIndex}.ar4Number`)} />
            <Input
              label="AR4 date"
              type={dateType}
              {...register(`invoices.${invoiceIndex}.items.${itemIndex}.ar4Date`)}
            />
          </div>
        </AdvancedAccordion>
      </AdvancedAccordion>
    </div>
  )
}
