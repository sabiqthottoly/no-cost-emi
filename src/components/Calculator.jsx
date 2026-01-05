import { useState, useEffect } from 'react';
import { BANKS, BANK_DATA } from '../utils/bankData';
import './Calculator.css';

const Calculator = ({ onCalculate }) => {
    const [formData, setFormData] = useState({
        productPrice: '',
        interestRate: '15',
        tenure: '6',
        discount: '',
        processingFee: '299',
    });

    const [selectedBank, setSelectedBank] = useState('');
    const [errors, setErrors] = useState({});

    // Effect to update rate when Bank or Tenure changes
    useEffect(() => {
        if (selectedBank && formData.tenure) {
            const bankInfo = BANK_DATA[selectedBank];
            if (bankInfo && bankInfo.rates) {
                // Find rate for selected tenure
                const rate = bankInfo.rates[formData.tenure];

                // If specific rate exists for this tenure, update it.
                // Otherwise we keep the current one (or could warn user).
                if (rate) {
                    setFormData(prev => ({
                        ...prev,
                        interestRate: rate.toString()
                    }));
                }
            }
        }
    }, [selectedBank, formData.tenure]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // If user manually changes processing fee, deselect bank
        if (name === 'processingFee') {
            setSelectedBank('');
        }

        // If user manually changes interest rate, we don't necessarily deselect bank,
        // but it means they are overriding the auto-fill.

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleBankChange = (e) => {
        const bankName = e.target.value;
        setSelectedBank(bankName);

        const bankInfo = BANK_DATA[bankName];

        if (bankInfo) {
            // Update Processing Fee
            const newFee = bankInfo.processingFee.toString();

            // Update Interest Rate based on current tenure
            let newRate = formData.interestRate;
            if (bankInfo.rates && formData.tenure) {
                const rateForTenure = bankInfo.rates[formData.tenure];
                if (rateForTenure) {
                    newRate = rateForTenure.toString();
                }
            }

            setFormData(prev => ({
                ...prev,
                processingFee: newFee,
                interestRate: newRate
            }));

            // Clear processing fee error if any
            if (errors.processingFee) {
                setErrors(prev => ({ ...prev, processingFee: '' }));
            }
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.productPrice || parseFloat(formData.productPrice) <= 0) {
            newErrors.productPrice = 'Please enter a valid product price';
        }
        if (!formData.interestRate || parseFloat(formData.interestRate) < 0) {
            newErrors.interestRate = 'Please enter a valid interest rate';
        }
        if (!formData.tenure || parseInt(formData.tenure) <= 0) {
            newErrors.tenure = 'Please enter a valid tenure';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        onCalculate({
            productPrice: parseFloat(formData.productPrice),
            interestRate: parseFloat(formData.interestRate),
            tenure: parseInt(formData.tenure),
            discount: formData.discount ? parseFloat(formData.discount) : null,
            processingFee: formData.processingFee ? parseFloat(formData.processingFee) : 0,
        });
    };

    const handleReset = () => {
        setFormData({
            productPrice: '',
            interestRate: '15',
            tenure: '6',
            discount: '',
            processingFee: '299',
        });
        setSelectedBank('');
        setErrors({});
    };

    return (
        <div className="calculator-card">
            <div className="calculator-header">
                <div className="header-icon">🧮</div>
                <h2>No Cost EMI Calculator</h2>
                <p>Discover the hidden costs in "No Cost" EMI offers</p>
            </div>

            <form onSubmit={handleSubmit} className="calculator-form">
                <div className="form-group">
                    <label htmlFor="productPrice">
                        <span className="label-icon">💰</span>
                        Product Price (₹)
                        <span className="required">*</span>
                    </label>
                    <input
                        type="number"
                        id="productPrice"
                        name="productPrice"
                        value={formData.productPrice}
                        onChange={handleChange}
                        placeholder="Enter product price (e.g., 24000)"
                        className={errors.productPrice ? 'error' : ''}
                    />
                    {errors.productPrice && <span className="error-text">{errors.productPrice}</span>}
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="interestRate">
                            <span className="label-icon">📊</span>
                            Interest Rate (% p.a.)
                            <span className="required">*</span>
                        </label>
                        <input
                            type="number"
                            id="interestRate"
                            name="interestRate"
                            value={formData.interestRate}
                            onChange={handleChange}
                            placeholder="15"
                            step="0.01"
                            className={errors.interestRate ? 'error' : ''}
                        />
                        {errors.interestRate && <span className="error-text">{errors.interestRate}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="tenure">
                            <span className="label-icon">📅</span>
                            Loan Tenure (months)
                            <span className="required">*</span>
                        </label>
                        <input
                            type="number"
                            id="tenure"
                            name="tenure"
                            value={formData.tenure}
                            onChange={handleChange}
                            placeholder="6"
                            min="1"
                            max="60"
                            className={errors.tenure ? 'error' : ''}
                        />
                        {errors.tenure && <span className="error-text">{errors.tenure}</span>}
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="bankSelect">
                        <span className="label-icon">🏦</span>
                        Select Your Bank (Optional)
                    </label>
                    <select
                        id="bankSelect"
                        value={selectedBank}
                        onChange={handleBankChange}
                        className="bank-select"
                    >
                        <option value="">-- Choose Your Bank (Auto-fills Rate & Fee) --</option>
                        {BANKS.map(bankName => (
                            <option key={bankName} value={bankName}>
                                {bankName}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="discount">
                            <span className="label-icon">🏷️</span>
                            No Cost EMI Discount (₹)
                            <span className="optional">optional</span>
                        </label>
                        <input
                            type="number"
                            id="discount"
                            name="discount"
                            value={formData.discount}
                            onChange={handleChange}
                            placeholder="Auto-calculated if empty"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="processingFee">
                            <span className="label-icon">📋</span>
                            Processing Fee (₹)
                            <span className="optional">optional</span>
                        </label>
                        <input
                            type="number"
                            id="processingFee"
                            name="processingFee"
                            value={formData.processingFee}
                            onChange={handleChange}
                            placeholder="0"
                        />
                    </div>
                </div>

                <p className="disclaimer-text">
                    ⚠️ <strong>Disclaimer:</strong> Interest rates and processing fees are automatically populated based on standard bank data.
                    However, these may vary by card type or ongoing offers. Please verify with your bank.
                </p>

                <div className="button-group">
                    <button type="submit" className="btn-calculate">
                        <span>Calculate EMI</span>
                        <span className="btn-icon">→</span>
                    </button>
                    <button type="button" className="btn-reset" onClick={handleReset}>
                        Reset
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Calculator;
