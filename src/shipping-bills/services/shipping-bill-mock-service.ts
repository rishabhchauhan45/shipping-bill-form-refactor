import { getDemoData, saveBill } from '../demo-store'
import { SavedBill, ShippingBillFormValues } from '../model'
import { shippingBillService } from '../shipping-bill-service'

const SUBMIT_DELAY_MS = 350

function delay<T>(value: T, ms = SUBMIT_DELAY_MS): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

export interface SubmitResult {
  bill: SavedBill
  isNew: boolean
  message: string
}

export const shippingBillMockService = {
  /**
   * Submit Shipping Bill (Create or Update)
   * Resolves asynchronously with realistic network latency.
   * Persists to demo storage and handles optional backend synchronization gracefully.
   */
  async submitShippingBill(values: ShippingBillFormValues, draftId?: number): Promise<SubmitResult> {
    const isNew = draftId == null
    // Persist locally
    const saved = saveBill(values, draftId)

    // Attempt backend sync if available (safe fallback if backend is offline)
    try {
      await shippingBillService.upsert(values)
    } catch {
      // Backend server offline; saved in local storage seamlessly
    }

    const message = isNew ? 'Shipping bill created successfully' : 'Shipping bill updated successfully'
    return delay({ bill: saved, isNew, message }, SUBMIT_DELAY_MS)
  },

  /**
   * Save partial draft during multi-step navigation
   */
  async saveDraft(values: ShippingBillFormValues, draftId?: number): Promise<SavedBill> {
    const saved = saveBill(values, draftId)
    return delay(saved, 100)
  },

  /**
   * Fetch a single shipping bill by ID
   */
  async getShippingBillById(id: number | string): Promise<SavedBill | undefined> {
    const { bills } = getDemoData()
    const found = bills.find((item) => String(item.id) === String(id)) ?? shippingBillService.getById(id)
    return delay(found, 150)
  },

  /**
   * List all shipping bills
   */
  async listShippingBills(): Promise<SavedBill[]> {
    return shippingBillService.list()
  },

  /**
   * Download flat file (.sb)
   */
  async downloadFlatFile(id: number | string, billData?: SavedBill) {
    return shippingBillService.downloadFlatFile(id, billData)
  }
}
