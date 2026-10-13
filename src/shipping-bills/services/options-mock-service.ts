import { documentCodes } from '@/data/e-sanchit-codes'
import { quantityCodes } from '@/data/quantity-code'
import schemeCodes from '@/data/scheme-codes'
import { stateOptions } from '@/data/states'
import { Trades } from '@/data/trade-agrements'
import { cargoOptions, contractTypes, paymentTypes, priceInclusionTypes, sealTypes, weightUnits } from '@/data/types'
import { loadingPorts, PortOption, ports } from '../model'

export interface AsyncSelectOption {
  value: string
  label: string
  sublabel?: string
}

export interface MarksAndNumbersOption {
  value: string
  label: string
}

const DEFAULT_DELAY_MS = 200

/**
 * Helper to simulate asynchronous network latency
 */
function delay<T>(value: T, ms = DEFAULT_DELAY_MS): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

// In-memory marks database keyed by exporter ID
const marksByExporter: Record<string, MarksAndNumbersOption[]> = {
  '1000': [
    { value: 'AARAV TEXTILES / MADE IN INDIA', label: 'AARAV TEXTILES / MADE IN INDIA' },
    { value: 'ATPL / LOT NO. ______', label: 'ATPL / LOT NO. ______' }
  ],
  '1002': [
    { value: 'BLUE HARBOR EXPORTS / INDIA', label: 'BLUE HARBOR EXPORTS / INDIA' },
    { value: 'BHE / SHIPPING MARKS AS PER INVOICE', label: 'BHE / SHIPPING MARKS AS PER INVOICE' }
  ],
  '1010': [
    { value: 'APEX GARMENTS / SURAT SEZ / EXPORT', label: 'APEX GARMENTS / SURAT SEZ / EXPORT' },
    { value: 'AGFPL / CONTAINER SEAL NO. ___', label: 'AGFPL / CONTAINER SEAL NO. ___' }
  ],
  '1020': [
    { value: 'ZENITH SPICES / KOCHI / INDIA', label: 'ZENITH SPICES / KOCHI / INDIA' },
    { value: 'ZSA / GRADE A ORGANIC / LOT #', label: 'ZSA / GRADE A ORGANIC / LOT #' }
  ]
}

export const optionsMockService = {
  /**
   * Search Port of Loading (Indian ports only: code starts with 'IN')
   */
  async searchLoadingPorts(query: string): Promise<AsyncSelectOption[]> {
    const q = query.trim().toLowerCase()
    const indianPorts = loadingPorts.filter((port) => port.code.startsWith('IN'))
    const filtered = indianPorts.filter(
      (port) => port.name.toLowerCase().includes(q) || port.code.toLowerCase().includes(q)
    )
    const options: AsyncSelectOption[] = filtered.map((port) => ({
      value: port.code,
      label: `${port.name} · ${port.code}`,
      sublabel: `Country: ${port.countryCode}`
    }))
    return delay(options)
  },

  /**
   * Search Final Destination Ports
   */
  async searchDestinationPorts(query: string): Promise<AsyncSelectOption[]> {
    const q = query.trim().toLowerCase()
    const filtered = ports.filter((port) => port.name.toLowerCase().includes(q) || port.code.toLowerCase().includes(q))
    const options: AsyncSelectOption[] = filtered.map((port) => ({
      value: port.code,
      label: `${port.name} · ${port.code}`,
      sublabel: `Country: ${port.countryCode}`
    }))
    return delay(options)
  },

  /**
   * Resolve a Port by code for display
   */
  async getPortByCode(code: string): Promise<PortOption | undefined> {
    const all = [...loadingPorts, ...ports]
    const found = all.find((port) => port.code === code)
    return delay(found, 50)
  },

  /**
   * Fetch marks and numbers options for a specific Exporter
   */
  async getMarksAndNumbersOptions(exporterId: string): Promise<MarksAndNumbersOption[]> {
    if (!exporterId) return delay([])
    const options = marksByExporter[exporterId] ?? [
      { value: `EXPORTER-${exporterId} / STANDARD PACKING`, label: `EXPORTER-${exporterId} / STANDARD PACKING` }
    ]
    return delay(options)
  },

  /**
   * Search e-Sanchit Document Type codes
   */
  async searchDocumentCodes(query: string): Promise<AsyncSelectOption[]> {
    const q = query.trim().toLowerCase()
    const filtered = documentCodes.filter(
      (doc) => doc.label.toLowerCase().includes(q) || doc.value.toLowerCase().includes(q)
    )
    const options: AsyncSelectOption[] = filtered.map((doc) => ({
      value: doc.value,
      label: doc.label
    }))
    return delay(options)
  },

  /**
   * Resolve document type code by value
   */
  async getDocumentCodeLabel(value: string): Promise<string> {
    const found = documentCodes.find((doc) => doc.value === value || doc.label === value)
    return delay(found ? found.label : value, 50)
  },

  /**
   * Fetch Scheme codes
   */
  async getSchemeCodes() {
    return delay([...schemeCodes], 100)
  },

  /**
   * Fetch Quantity / Unit codes
   */
  async getQuantityCodes() {
    return delay([...quantityCodes], 100)
  },

  /**
   * Fetch State options
   */
  async getStateOptions() {
    return delay([...stateOptions], 100)
  },

  /**
   * Fetch Trade Agreement options
   */
  async getTradeAgreementOptions() {
    return delay([...Trades], 100)
  },

  /**
   * Fetch Cargo options
   */
  async getCargoOptions() {
    return delay([...cargoOptions], 50)
  },

  /**
   * Fetch Seal types
   */
  async getSealTypes() {
    return delay([...sealTypes], 50)
  },

  /**
   * Fetch Weight units
   */
  async getWeightUnits() {
    return delay([...weightUnits], 50)
  },

  /**
   * Fetch Contract types
   */
  async getContractTypes() {
    return delay([...contractTypes], 50)
  },

  /**
   * Fetch Payment types
   */
  async getPaymentTypes() {
    return delay([...paymentTypes], 50)
  },

  /**
   * Fetch Price inclusion types
   */
  async getPriceInclusionTypes() {
    return delay([...priceInclusionTypes], 50)
  },

  /**
   * Fetch Currency options
   */
  async getCurrencyOptions() {
    const currencies = ['USD', 'EUR', 'INR', 'AED', 'GBP', 'SGD'].map((value) => ({
      value,
      label: value
    }))
    return delay(currencies, 50)
  },

  /**
   * Fetch Container sizes
   */
  async getContainerSizes() {
    return delay(
      [
        { value: '20', label: '20 ft' },
        { value: '40', label: '40 ft' },
        { value: '45', label: '45 ft' }
      ],
      50
    )
  },

  /**
   * Fetch Container seal types
   */
  async getContainerSealTypes() {
    return delay(
      [
        { value: '1', label: 'BTSL - Bottle Seal' },
        { value: '2', label: 'ESEAL - Electronic Seal' },
        { value: '3', label: 'RFID - Radio Frequency Identifier' }
      ],
      50
    )
  },

  /**
   * Fetch License source types
   */
  async getLicenseSourceTypes() {
    return delay(
      [
        { value: 'I', label: 'Imported' },
        { value: 'D', label: 'Indigenous' }
      ],
      50
    )
  }
}
