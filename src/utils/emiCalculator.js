/**
 * EMI Calculator Utility
 * Calculates EMI, total interest, GST, and monthly breakdown for No Cost EMI
 */

/**
 * Calculate EMI using the standard formula
 * EMI = P × r × (1 + r)^n / ((1 + r)^n - 1)
 * 
 * @param {number} principal - Loan principal amount
 * @param {number} annualRate - Annual interest rate in percentage
 * @param {number} tenureMonths - Loan tenure in months
 * @returns {number} Monthly EMI amount
 */
export const calculateEMI = (principal, annualRate, tenureMonths) => {
  if (principal <= 0 || tenureMonths <= 0) return 0;
  if (annualRate === 0) return principal / tenureMonths;

  const monthlyRate = annualRate / 12 / 100;
  const powerFactor = Math.pow(1 + monthlyRate, tenureMonths);
  const emi = (principal * monthlyRate * powerFactor) / (powerFactor - 1);

  return emi;
};

/**
 * Calculate total interest for a loan
 * 
 * @param {number} emi - Monthly EMI amount
 * @param {number} tenureMonths - Number of months
 * @param {number} principal - Principal amount
 * @returns {number} Total interest amount
 */
export const calculateTotalInterest = (emi, tenureMonths, principal) => {
  return (emi * tenureMonths) - principal;
};

/**
 * Calculate GST on interest (18% in India)
 * 
 * @param {number} totalInterest - Total interest amount
 * @returns {number} GST amount
 */
export const calculateGSTOnInterest = (totalInterest) => {
  const GST_RATE = 0.18;
  return totalInterest * GST_RATE;
};

/**
 * Calculate GST on processing fee (18% in India)
 * 
 * @param {number} processingFee - Processing fee amount
 * @returns {number} GST amount on processing fee
 */
export const calculateGSTOnProcessingFee = (processingFee) => {
  const GST_RATE = 0.18;
  return processingFee * GST_RATE;
};

/**
 * Generate monthly breakdown with principal, interest split, GST, and processing fee
 * 
 * @param {number} principal - Loan principal
 * @param {number} annualRate - Annual interest rate in percentage
 * @param {number} tenureMonths - Loan tenure in months
 * @param {number} emi - Monthly EMI amount
 * @param {number} processingFee - Processing fee (added to first month)
 * @param {number} gstOnProcessingFee - GST on processing fee (added to first month)
 * @returns {Array} Array of monthly breakdown objects
 */
export const generateMonthlyBreakdown = (principal, annualRate, tenureMonths, emi, processingFee = 0, gstOnProcessingFee = 0) => {
  const breakdown = [];
  let balance = principal;
  const monthlyRate = annualRate / 12 / 100;
  const GST_RATE = 0.18;

  for (let month = 1; month <= tenureMonths; month++) {
    const interestComponent = balance * monthlyRate;
    const principalComponent = emi - interestComponent;
    const gstOnMonthlyInterest = interestComponent * GST_RATE;
    balance -= principalComponent;

    // Processing fee and its GST are added to the first month only
    const monthProcessingFee = month === 1 ? processingFee : 0;
    const monthProcessingFeeGST = month === 1 ? gstOnProcessingFee : 0;

    // Total outflow for the month
    const totalMonthlyOutflow = emi + gstOnMonthlyInterest + monthProcessingFee + monthProcessingFeeGST;

    breakdown.push({
      month,
      emi: emi,
      principal: principalComponent,
      interest: interestComponent,
      gstOnInterest: gstOnMonthlyInterest,
      processingFee: monthProcessingFee,
      processingFeeGST: monthProcessingFeeGST,
      totalOutflow: totalMonthlyOutflow,
      balance: Math.max(0, balance),
    });
  }

  return breakdown;
};

/**
 * Find the effective interest rate given principal, tenure, and total interest
 * (Uses binary search to find the rate that results in the specific total interest)
 */
const findEffectiveInterestRate = (principal, tenureMonths, targetTotalInterest) => {
  if (targetTotalInterest <= 0) return 0;

  const targetEMI = (principal + targetTotalInterest) / tenureMonths;
  let low = 0;
  let high = 100; // Start with max 100% annual rate

  for (let i = 0; i < 20; i++) { // 20 iterations for high precision
    let mid = (low + high) / 2;
    let emi = calculateEMI(principal, mid, tenureMonths);
    if (emi < targetEMI) low = mid;
    else high = mid;
  }

  return (low + high) / 2;
};

/**
 * Complete No Cost EMI calculation
 * 
 * @param {Object} params - Calculation parameters
 * @param {number} params.productPrice - Original product price
 * @param {number} params.interestRate - Annual interest rate (%)
 * @param {number} params.tenure - Loan tenure in months
 * @param {number} params.discount - Optional upfront discount (if not provided, calculated)
 * @param {number} params.processingFee - Processing fee amount
 * @returns {Object} Complete calculation results
 */
export const calculateNoCostEMI = ({
  productPrice,
  interestRate,
  tenure,
  discount = null,
  processingFee = 0
}) => {
  let actualDiscount;
  let totalInterest;
  let actualEMI;
  let calculationRate = interestRate;

  if (discount !== null && discount > 0) {
    // If discount is provided manually, use it
    actualDiscount = discount;
    const discountedPrincipal = productPrice - actualDiscount;

    // For manual discount, we calculate the EMI based on the discounted principal
    // (This overrides the "No Cost" assumption if the discount doesn't perfectly align)
    actualEMI = calculateEMI(discountedPrincipal, interestRate, tenure);
    totalInterest = calculateTotalInterest(actualEMI, tenure, discountedPrincipal);
    calculationRate = interestRate; // Use the provided rate
  } else {
    // Reverse EMI Calculation Logic (Standard Bank Method for No Cost EMI)
    // 1. Target EMI is simply Price / Tenure
    const targetEMI = productPrice / tenure;

    // 2. Calculate the "Present Value" (Principal) required to generate this EMI
    // Formula: P = EMI * [ (1 - (1+r)^-n) / r ]
    const monthlyRate = interestRate / 12 / 100;

    let principalFromEMI;
    if (monthlyRate === 0) {
      principalFromEMI = productPrice;
    } else {
      principalFromEMI = targetEMI * (1 - Math.pow(1 + monthlyRate, -tenure)) / monthlyRate;
    }

    // 3. The discount is the difference between Price and this calculated Principal
    // (Product Price - Principal = Interest Component, which is the Discount)
    actualDiscount = productPrice - principalFromEMI;

    // 4. Set values for breakdown
    actualEMI = targetEMI;
    totalInterest = actualDiscount; // In No Cost EMI, Discount = Interest

    // Note: We use the calculated principal for the loan
  }

  const discountedPrincipal = productPrice - actualDiscount;

  // Step 6: Calculate GST on interest (hidden cost!)
  const gstOnInterest = calculateGSTOnInterest(totalInterest);

  // Step 7: Calculate GST on processing fee (hidden cost!)
  const gstOnProcessingFee = calculateGSTOnProcessingFee(processingFee);

  // Step 8: Generate monthly breakdown with GST and processing fee
  const monthlyBreakdown = generateMonthlyBreakdown(
    discountedPrincipal,
    calculationRate,
    tenure,
    actualEMI,
    processingFee,
    gstOnProcessingFee
  );

  // Step 9: Calculate totals - now includes GST on processing fee
  const totalHiddenCost = gstOnInterest + processingFee + gstOnProcessingFee;
  const totalPayment = (actualEMI * tenure) + totalHiddenCost;
  const effectivePrice = productPrice + totalHiddenCost;

  return {
    // Input summary
    originalPrice: productPrice,
    discountGiven: actualDiscount,
    discountedPrincipal,
    interestRate: calculationRate, // Return the rate used for breakdown
    tenure,
    processingFee,

    // EMI details
    monthlyEMI: actualEMI,
    totalInterest,

    // Hidden costs (the key insight!)
    gstOnInterest,
    gstOnProcessingFee,
    totalHiddenCost,

    // Final amounts
    totalPayment,
    effectivePrice,

    // Monthly breakdown
    monthlyBreakdown,
  };
};

/**
 * Format currency in Indian Rupee format
 * 
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format currency with decimals
 * 
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string with decimals
 */
export const formatCurrencyWithDecimals = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};
