import { s } from 'core/form'

/**
 * Positive number validator refinement
 */
export const positiveNumber = s.string().refine((value) => {
  const num = Number(value)
  return !isNaN(num) && num > 0 ? undefined : 'Enter a number above zero'
})

/**
 * Non-negative number validator refinement
 */
export const nonNegativeNumber = s.string().refine((value) => {
  if (!value) return undefined
  const num = Number(value)
  return !isNaN(num) && num >= 0 ? undefined : 'Total cannot be negative'
})

/**
 * Shipping Bill Form Validation Schema
 * Leaf names are deliberate: fe-zen-arch resolves nested RHF field rules by their final path segment.
 */
export const billSchema = s.object({
  jobNumber: s.string().optional(),
  jobDate: s.string(),
  exporterId: s.string(),
  exporterBranchId: s.string(),
  consigneeId: s.string(),
  consigneeBranchId: s.string(),
  loadingPort: s.string(),
  finalDestinationPort: s.string(),
  dischargePort: s.string().optional(),
  originStateCode: s.string().optional(),
  nfeiCategory: s.string().optional(),
  rbiWaiverNumber: s.string().optional(),
  rbiWaiverDate: s.string().optional(),
  sealType: s.string().optional(),
  numberOfContainers: s.string().optional(),
  natureOfCargo: s.string().optional(),
  grossWeight: s.string().optional(),
  netWeight: s.string().optional(),
  measurementUnit: s.string().optional(),
  totalPackages: s.string().optional(),
  marksAndNumbers: s.string().optional(),
  loosePackets: s.string().optional(),
  mawbNumber: s.string().optional(),
  hawbNumber: s.string().optional(),
  invoiceNumber: s.string(),
  invoiceDate: s.string(),
  currency: s.string(),
  invoiceTotal: nonNegativeNumber.optional(),
  contractType: s.string(),
  buyerId: s.string().optional(),
  buyerBranchId: s.string().optional(),
  thirdPartyId: s.string().optional(),
  thirdPartyBranchId: s.string().optional(),
  ritcCode: s.string(),
  goodsDescription1: s.string(),
  quantity: positiveNumber,
  unitOfMeasurement: s.string(),
  unitPrice: positiveNumber,
  containerNumber: s.string().optional(),
  packingNumberFrom: s.string().optional(),
  packingNumberTo: s.string().optional(),
  documentTypeCode: s.string().optional(),
  documentReferenceNumber: s.string().optional(),
  registrationNumber: s.string().optional()
})
