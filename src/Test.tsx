import { render, screen, fireEvent } from '@testing-library/react';
import Home, { GetCurrencies, Convert, DropDown } from '@/pages/index';
import test, {describe} from "node:test";
import expect from "expect";

describe('Home component', () => {
    test('renders title correctly', () => {
        render(<Home />);
        const titleElement = screen.getByText(/Exchange Rate Calculator/i);
        expect(titleElement).toBeTruthy();
    });

    test('converts currency correctly', () => {
        render(<Home />);
        const convertButton = screen.getByRole('button', { name: /convert/i });
        const amountInput = screen.getByRole('textbox', { name: /amount/i });
        const fromCurrencySelect = screen.getByRole('combobox', { name: /from/i });
        const toCurrencySelect = screen.getByRole('combobox', { name: /to/i });

        fireEvent.change(amountInput, { target: { value: '10' } });
        fireEvent.change(fromCurrencySelect, { target: { value: 'EUR' } });
        fireEvent.change(toCurrencySelect, { target: { value: 'USD' } });
        fireEvent.click(convertButton);

        const convertedAmount = screen.getByText(/Converted:/i);
        expect(convertedAmount.textContent).toContain('11.5'); // Assuming conversion rate is 1 EUR = 1.15 USD
    });
});

describe('Convert function', () => {
    test('converts currency correctly', () => {
        const fromCurrency = 1.15;
        const toCurrency = 0.9;
        const amount = 10;

        const convertedAmount = Convert(fromCurrency, toCurrency, amount);
        expect(convertedAmount).toBe(7.826086956521739);
    });
});

describe('DropDown component', () => {
    test('renders dropdown options correctly', () => {
        const currencies = { USD: 1.15, GBP: 0.9 };
        render(<DropDown func={() => {}} currencies={currencies} />);
        const fromCurrencySelect = screen.getByRole('combobox', { name: /from/i });
        const toCurrencySelect = screen.getByRole('combobox', { name: /to/i });

        expect(fromCurrencySelect).toContain('<option value="USD">USD</option>');
        expect(fromCurrencySelect).toContain('<option value="GBP">GBP</option>');
        expect(toCurrencySelect).toContain('<option value="USD">USD</option>');
        expect(toCurrencySelect).toContain('<option value="GBP">GBP</option>');
    });
});