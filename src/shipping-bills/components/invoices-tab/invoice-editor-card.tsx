import { contractTypes, paymentTypes, priceInclusionTypes } from '@/data/types'
import { BillInvoiceForm, Business, emptyItem, invoiceTotal, ShippingBillFormValues } from '@/shipping-bills/model'
import { useFieldArray } from 'core/form'
import { Button } from 'ui/basic/button'
import { Card, CardContent, CardHeader } from 'ui/basic/card'
import { FormContextData } from 'ui/form'
import { Checkbox } from 'ui/inputs/checkbox'
import { Input } from 'ui/inputs/input'
import { Select } from 'ui/inputs/select'
import { BranchPath, PartyFields } from '../common/party-fields'
import { SectionHeading } from '../common/section-heading'
import { GoodsItemCard } from './goods-item-card'

interface InvoiceEditorCardProps {
  formCtx: FormContextData<ShippingBillFormValues>
  index: number
  invoice: BillInvoiceForm
  businesses: Business[]
  canRemove: boolean
  onRemove: () => void
  onQuickAdd: (role: 'buyer' | 'thirdParty' | 'itemThirdParty', invoiceIndex: number, itemIndex?: number) => void
  onAddBranch: (ownerId: number, branchName: BranchPath) => void
}

const currencyOptions = ['USD', 'EUR', 'INR', 'AED', 'GBP', 'SGD'].map((value) => ({
  value,
  label: value
}))

const dateType = 'date' as 'text'

export function InvoiceEditorCard({
  formCtx,
  index,
  invoice,
  businesses,
  canRemove,
  onRemove,
  onQuickAdd,
  onAddBranch
}: InvoiceEditorCardProps) {
  const { register, control, watch } = formCtx.hooks
  const invoiceValues = watch(`invoices.${index}`)

  const {
    fields: items,
    append: addItem,
    remove: removeItem
  } = useFieldArray({ control, name: `invoices.${index}.items` })

  const buyerSame = watch(`invoices.${index}.buyerSameAsConsignee`)
  const buyerOptions = businesses.filter((business) => business.isBuyer || business.id === Number(invoice.buyerId))
  const thirdPartyOptions = businesses.filter(
    (business) => business.isThirdParty || business.id === Number(invoice.thirdPartyId)
  )

  const calculatedTotal = invoiceTotal(invoice).toLocaleString(undefined, { maximumFractionDigits: 2 })

  return (
    <Card className="mb-4">
      <CardHeader className="flex-row items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-gray-950">Invoice {index + 1}</h3>
        </div>
        {canRemove && (
          <Button size="sm" variant="ghost" type="button" onClick={onRemove}>
            Remove invoice
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Input label="Invoice number" {...register(`invoices.${index}.invoiceNumber`)} />
          <Input label="Invoice date" type={dateType} {...register(`invoices.${index}.invoiceDate`)} />
          <div className="flex gap-2">
            <div className="w-[100px] shrink-0">
              <Select<ShippingBillFormValues>
                label="Currency"
                name={`invoices.${index}.currency`}
                options={currencyOptions}
                rules={{ required: true }}
              />
            </div>
            <div className="flex-1">
              <Input
                label="Total"
                type="number"
                min={0}
                {...register(`invoices.${index}.invoiceTotal`)}
                placeholder="0.00"
              />
            </div>
          </div>
          <Select<ShippingBillFormValues>
            label="Contract"
            name={`invoices.${index}.contractType`}
            options={contractTypes}
            rules={{ required: true }}
          />
        </div>

        <label className="flex items-center gap-2 text-sm">
          <Checkbox {...register(`invoices.${index}.buyerSameAsConsignee`)} />
          Buyer & consignee are same
        </label>

        {!buyerSame && (
          <PartyFields
            formCtx={formCtx}
            ownerName={`invoices.${index}.buyerId`}
            branchName={`invoices.${index}.buyerBranchId`}
            label="Buyer"
            kind="business"
            parties={buyerOptions}
            onQuickAdd={() => onQuickAdd('buyer', index)}
            onAddBranch={(ownerId) => onAddBranch(ownerId, `invoices.${index}.buyerBranchId`)}
          />
        )}

        <div className="space-y-4">
          <div className="divide-y divide-gray-100 rounded-lg border border-gray-200">
            {/* Freight & Insurance */}
            <div className="grid grid-cols-1 divide-y divide-gray-100 lg:grid-cols-2 lg:divide-x lg:divide-y-0">
              <div className="p-2">
                <div className="flex flex-wrap items-center gap-2 lg:flex-nowrap">
                  <span className="w-28 shrink-0 font-medium text-gray-900">Freight</span>
                  <div className="flex items-center gap-1">
                    <Input
                      type="number"
                      {...register(`invoices.${index}.freightRate`)}
                      className="text-right"
                      disabled={invoiceValues.freightAmount !== '' && invoiceValues.freightAmount != null}
                      placeholder="Rate"
                    />
                    <span className="text-xs text-gray-500">%</span>
                  </div>
                  <Input
                    type="number"
                    {...register(`invoices.${index}.freightAmount`)}
                    className="py-1 text-right"
                    disabled={invoiceValues.freightRate !== '' && invoiceValues.freightRate != null}
                    placeholder="Amount"
                  />
                  <Select<ShippingBillFormValues>
                    name={`invoices.${index}.freightCurrency`}
                    options={currencyOptions}
                    placeholder={invoice.currency}
                  />
                </div>
              </div>
              <div className="p-2">
                <div className="flex flex-wrap items-center gap-2 lg:flex-nowrap">
                  <span className="w-28 shrink-0 font-medium text-gray-900">Insurance</span>
                  <div className="flex items-center gap-1">
                    <Input
                      type="number"
                      {...register(`invoices.${index}.insuranceRate`)}
                      className="text-right"
                      disabled={invoiceValues.insuranceAmount !== '' && invoiceValues.insuranceAmount != null}
                      placeholder="Rate"
                    />
                    <span className="text-xs text-gray-500">%</span>
                  </div>
                  <Input
                    type="number"
                    {...register(`invoices.${index}.insuranceAmount`)}
                    className="py-1 text-right"
                    disabled={invoiceValues.insuranceRate !== '' && invoiceValues.insuranceRate != null}
                    placeholder="Amount"
                  />
                  <Select<ShippingBillFormValues>
                    name={`invoices.${index}.insuranceCurrency`}
                    options={currencyOptions}
                    placeholder={invoice.currency}
                  />
                </div>
              </div>
            </div>

            {/* Commission & Discount */}
            <div className="grid grid-cols-1 divide-y divide-gray-100 lg:grid-cols-2 lg:divide-x lg:divide-y-0">
              <div className="p-2">
                <div className="flex flex-wrap items-center gap-2 lg:flex-nowrap">
                  <span className="w-28 shrink-0 font-medium text-gray-900">Commission</span>
                  <div className="flex items-center gap-1">
                    <Input
                      type="number"
                      {...register(`invoices.${index}.commissionRate`)}
                      className="text-right"
                      disabled={invoiceValues.commissionAmount !== '' && invoiceValues.commissionAmount != null}
                      placeholder="Rate"
                    />
                    <span className="text-xs text-gray-500">%</span>
                  </div>
                  <Input
                    type="number"
                    {...register(`invoices.${index}.commissionAmount`)}
                    className="py-1 text-right"
                    disabled={invoiceValues.commissionRate !== '' && invoiceValues.commissionRate != null}
                    placeholder="Amount"
                  />
                  <Select<ShippingBillFormValues>
                    name={`invoices.${index}.commissionCurrency`}
                    options={currencyOptions}
                    placeholder={invoice.currency}
                  />
                </div>
              </div>
              <div className="p-2">
                <div className="flex flex-wrap items-center gap-2 lg:flex-nowrap">
                  <span className="w-28 shrink-0 font-medium text-gray-900">Discount</span>
                  <div className="flex items-center gap-1">
                    <Input
                      type="number"
                      {...register(`invoices.${index}.discountRate`)}
                      className="text-right"
                      disabled={invoiceValues.discountAmount !== '' && invoiceValues.discountAmount != null}
                      placeholder="Rate"
                    />
                    <span className="text-xs text-gray-500">%</span>
                  </div>
                  <Input
                    type="number"
                    {...register(`invoices.${index}.discountAmount`)}
                    className="py-1 text-right"
                    disabled={invoiceValues.discountRate !== '' && invoiceValues.discountRate != null}
                    placeholder="Amount"
                  />
                  <Select<ShippingBillFormValues>
                    name={`invoices.${index}.discountCurrency`}
                    options={currencyOptions}
                    placeholder={invoice.currency}
                  />
                </div>
              </div>
            </div>

            {/* Other Deductions & Packing Charges */}
            <div className="grid grid-cols-1 divide-y divide-gray-100 lg:grid-cols-2 lg:divide-x lg:divide-y-0">
              <div className="p-2">
                <div className="flex flex-wrap items-center gap-2 lg:flex-nowrap">
                  <span className="w-28 shrink-0 font-medium text-gray-900">Other Deductions</span>
                  <div className="flex items-center gap-1">
                    <Input
                      type="number"
                      {...register(`invoices.${index}.otherDeductionsRate`)}
                      className="text-right"
                      disabled={
                        invoiceValues.otherDeductionsAmount !== '' && invoiceValues.otherDeductionsAmount != null
                      }
                      placeholder="Rate"
                    />
                    <span className="text-xs text-gray-500">%</span>
                  </div>
                  <Input
                    type="number"
                    {...register(`invoices.${index}.otherDeductionsAmount`)}
                    className="py-1 text-right"
                    disabled={invoiceValues.otherDeductionsRate !== '' && invoiceValues.otherDeductionsRate != null}
                    placeholder="Amount"
                  />
                  <Select<ShippingBillFormValues>
                    name={`invoices.${index}.otherDeductionsCurrency`}
                    options={currencyOptions}
                    placeholder={invoice.currency}
                  />
                </div>
              </div>
              <div className="p-2">
                <div className="flex flex-wrap items-center gap-2 lg:flex-nowrap">
                  <span className="w-28 shrink-0 font-medium text-gray-900">Packing Charges</span>
                  <Input
                    type="number"
                    {...register(`invoices.${index}.packingCharges`)}
                    className="py-1 text-right"
                    placeholder="Amount"
                  />
                  <span className="w-14 text-sm text-gray-500">—</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Select<ShippingBillFormValues>
              label="Price includes"
              name={`invoices.${index}.freightInsuranceIncluded`}
              options={priceInclusionTypes}
              placeholder="Select if applicable"
            />
            <Input label="Contract / order number" {...register(`invoices.${index}.contractNumber`)} />
            <Select<ShippingBillFormValues>
              label="Payment type"
              name={`invoices.${index}.natureOfPayment`}
              options={paymentTypes}
              placeholder="Select if applicable"
            />
            <Input label="Payment period (days)" type="number" {...register(`invoices.${index}.periodOfPayment`)} />
          </div>

          <PartyFields
            formCtx={formCtx}
            ownerName={`invoices.${index}.thirdPartyId`}
            branchName={`invoices.${index}.thirdPartyBranchId`}
            label="Third party (optional)"
            kind="business"
            parties={thirdPartyOptions}
            required={false}
            onQuickAdd={() => onQuickAdd('thirdParty', index)}
            onAddBranch={(ownerId) => onAddBranch(ownerId, `invoices.${index}.thirdPartyBranchId`)}
          />
        </div>

        <div className="border-t border-gray-200 pt-5">
          <SectionHeading
            title="Goods"
            action={
              <Button size="sm" variant="outline" type="button" onClick={() => addItem(emptyItem())}>
                + Add item
              </Button>
            }
          />
          <div className="space-y-4">
            {items.map((field, itemIndex) => {
              const item = invoice.items[itemIndex] ?? emptyItem()
              return (
                <GoodsItemCard
                  key={field.id}
                  formCtx={formCtx}
                  invoiceIndex={index}
                  itemIndex={itemIndex}
                  item={item}
                  invoice={invoice}
                  canRemove={items.length > 1}
                  businesses={businesses}
                  onRemove={() => removeItem(itemIndex)}
                  onQuickAdd={onQuickAdd}
                  onAddBranch={onAddBranch}
                />
              )
            })}
          </div>
        </div>

        <div className="text-right text-sm font-semibold text-gray-950">
          Invoice total: {invoice.currency} {calculatedTotal}
        </div>
      </CardContent>
    </Card>
  )
}
