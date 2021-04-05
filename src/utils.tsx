import { useMemo } from "react"

export function uuidv4(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export const Table: React.FC<{ columns: string[] }> = ({
  children,
  columns,
}) => {
  const columnNames = useMemo(() => {
    return columns.map((column, idx) => <th key={idx}>{column}</th>)
  }, columns) // eslint-disable-line

  return (
    <table>
      <thead>
        <tr>{columnNames}</tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  )
}

export function formatPrice(price: number | string) {
  return Number(price).toFixed(2)
}

const flags: Record<string, string> = {
  eur: "🇪🇺",
  usd: "🇺🇸",
  rup: "🇮🇳",
  aus: "🇦🇺",
  can: "🇨🇦",
}

export function formatCurrency(currency: string) {
  return flags[currency] || currency
}

export const NumberInput: React.FC<
  Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> & {
    value: number
    onChange: (newValue: number) => void
  }
> = ({ value, onChange, ...other }) => {
  return (
    <input
      value={value}
      type="number"
      step={0.1}
      min={0}
      max={1000}
      onChange={(e) => {
        onChange(Number(e.target.value))
      }}
      {...other}
    />
  )
}

export const initialCurrencyRates: Record<string, number> = {
  eur: 1.12,
  usd: 1.33,
  rup: 97.45,
  aus: 1.75,
  can: 1.75,
}

export interface Order {
  id: string
  title: string
  price: number
  currency: string
}

export const initialOrders: Record<string, Order> = Object.fromEntries(
  [
    {
      id: uuidv4(),
      title: "The LEGO Movie 2: The Second Part",
      price: 8,
      currency: "usd",
    },
    {
      id: uuidv4(),
      title: "Kangaroo, 2yo 🦘",
      price: 750,
      currency: "aus",
    },
    {
      id: uuidv4(),
      title: "Old Amsterdam 🧀",
      price: 12.99,
      currency: "eur",
    },
    {
      id: uuidv4(),
      title: "Old Football boots Virgil van Dijk",
      price: 1200,
      currency: "eur",
    },
  ].map((order) => [order.id, order]),
)

export const getRandomOrder = (id: string): Order => ({
  id,
  title: "Item " + Math.round(Math.random() * 1000),
  price: Math.round(Math.random() * 1000),
  currency: "usd",
})

export const getBaseCurrencyPrice = (price: number, currencyRate: number) =>
  price * (1 / currencyRate)

export function isCurrecyRateValid(
  currency: string,
  rate: number,
): Promise<boolean> {
  const result = Math.random() > 0.5
  const time = Math.random() * 2000
  return new Promise<boolean>((res) => {
    setTimeout(res, time, result)
  })
}
