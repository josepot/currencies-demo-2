import { Subscribe } from "@react-rxjs/core"
import { act, renderHook } from "@testing-library/react-hooks"
import {
  useCurrencyRate,
  currencyRate$,
  CurrencyRateState,
  onRateChange,
} from "./App"
import { initialCurrencyRates } from "./utils"

const CURRENCY = "eur"

const renderUseCurrencyRate = () => {
  return renderHook(() => useCurrencyRate(CURRENCY), {
    wrapper: ({ children }) => (
      <Subscribe source$={currencyRate$(CURRENCY)}>{children}</Subscribe>
    ),
  })
}

describe("useCurrencyRate", () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  it("returns the correct initial value", () => {
    const { result } = renderUseCurrencyRate()

    expect(result.current).toEqual({
      state: CurrencyRateState.ACCEPTED,
      value: initialCurrencyRates[CURRENCY],
    })
  })

  it("transitions to DIRTY when the user changes its value", () => {
    const { result } = renderUseCurrencyRate()

    const newValue = 100
    act(() => {
      onRateChange(CURRENCY, newValue)
    })

    expect(result.current).toEqual({
      state: CurrencyRateState.DIRTY,
      value: newValue,
    })
  })

  it("stays DIRTY for half a second after the latest change and then it starts the request", () => {
    const { result } = renderUseCurrencyRate()

    let newValue = 100
    act(() => {
      onRateChange(CURRENCY, newValue)
      jest.advanceTimersByTime(499)
    })

    expect(result.current).toEqual({
      state: CurrencyRateState.DIRTY,
      value: newValue,
    })

    act(() => {
      onRateChange(CURRENCY, ++newValue)
      jest.advanceTimersByTime(1)
    })

    expect(result.current).toEqual({
      state: CurrencyRateState.DIRTY,
      value: newValue,
    })

    act(() => {
      jest.advanceTimersByTime(498)
    })

    expect(result.current).toEqual({
      state: CurrencyRateState.DIRTY,
      value: newValue,
    })

    act(() => {
      jest.advanceTimersByTime(2)
    })

    expect(result.current).toEqual({
      state: CurrencyRateState.IN_PROGRESS,
      value: newValue,
    })
  })

  it("immediately returns back from DIRTY to ACCEPTED if it changes to its latest accepted", () => {
    const { result } = renderUseCurrencyRate()

    const initialValue = result.current.value
    act(() => {
      onRateChange(CURRENCY, initialValue + 1)
    })

    expect(result.current).toEqual({
      state: CurrencyRateState.DIRTY,
      value: initialValue + 1,
    })

    act(() => {
      onRateChange(CURRENCY, initialValue)
    })

    expect(result.current).toEqual({
      state: CurrencyRateState.ACCEPTED,
      value: initialValue,
    })

    act(() => {
      jest.advanceTimersByTime(501)
    })

    expect(result.current).toEqual({
      state: CurrencyRateState.ACCEPTED,
      value: initialValue,
    })
  })
})
