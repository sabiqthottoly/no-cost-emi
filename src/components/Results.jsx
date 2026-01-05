import { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatCurrency, formatCurrencyWithDecimals } from '../utils/emiCalculator';
import './Results.css';

const Results = ({ data }) => {
    const [showBreakdown, setShowBreakdown] = useState(false);

    const exportToPDF = () => {
        try {
            const doc = new jsPDF();

            // Helper to replace ₹ with INR for PDF compatibility
            const formatForPDF = (str) => str.replace(/₹/g, 'INR ');

            // Title
            doc.setFontSize(18);
            doc.setTextColor(50, 50, 50);
            doc.setFont('helvetica', 'bold');
            doc.text('No Cost EMI - Monthly Breakdown', 14, 20);

            // Summary info with bold values
            doc.setFontSize(10);
            doc.setTextColor(80);

            doc.setFont('helvetica', 'normal');
            doc.text('Product Price: ', 14, 32);
            doc.setFont('helvetica', 'bold');
            doc.text(formatForPDF(formatCurrency(data.originalPrice)), 52, 32);

            doc.setFont('helvetica', 'normal');
            doc.text('Monthly EMI: ', 14, 38);
            doc.setFont('helvetica', 'bold');
            doc.text(formatForPDF(formatCurrencyWithDecimals(data.monthlyEMI)), 52, 38);

            doc.setFont('helvetica', 'normal');
            doc.text('Tenure: ', 14, 44);
            doc.setFont('helvetica', 'bold');
            doc.text(`${data.tenure} months`, 52, 44);

            doc.setFont('helvetica', 'normal');
            doc.text('Total Hidden Cost: ', 14, 50);
            doc.setFont('helvetica', 'bold');
            doc.text(formatForPDF(formatCurrencyWithDecimals(data.totalHiddenCost)), 52, 50);

            // Table headers
            const headers = ['Month', 'EMI', 'Principal', 'Interest', 'GST on Int', 'Total Outflow', 'Balance'];
            let totalOutflowCol = 5;
            if (data.processingFee > 0) {
                headers.splice(5, 0, 'Pro Fee', 'PF GST');
                totalOutflowCol = 7;
            }

            // Table data
            const tableData = data.monthlyBreakdown.map(row => {
                const rowData = [
                    row.month,
                    formatForPDF(formatCurrencyWithDecimals(row.emi)),
                    formatForPDF(formatCurrencyWithDecimals(row.principal)),
                    formatForPDF(formatCurrencyWithDecimals(row.interest)),
                    formatForPDF(formatCurrencyWithDecimals(row.gstOnInterest)),
                ];
                if (data.processingFee > 0) {
                    rowData.push(row.processingFee > 0 ? formatForPDF(formatCurrency(row.processingFee)) : '-');
                    rowData.push(row.processingFeeGST > 0 ? formatForPDF(formatCurrencyWithDecimals(row.processingFeeGST)) : '-');
                }
                rowData.push(formatForPDF(formatCurrencyWithDecimals(row.totalOutflow)));
                rowData.push(formatForPDF(formatCurrencyWithDecimals(row.balance)));
                return rowData;
            });

            // Generate table using autoTable
            autoTable(doc, {
                head: [headers],
                body: tableData,
                startY: 58,
                theme: 'grid',
                styles: {
                    fontSize: 8,
                    cellPadding: 3,
                    halign: 'right',
                },
                headStyles: {
                    fillColor: [60, 60, 60],
                    textColor: 255,
                    fontStyle: 'bold',
                    halign: 'center',
                },
                columnStyles: {
                    0: { halign: 'center' },
                    [totalOutflowCol]: { fontStyle: 'bold' },
                },
                alternateRowStyles: {
                    fillColor: [248, 248, 248],
                },
            });

            // Footer
            const finalY = doc.lastAutoTable.finalY + 10;
            doc.setFontSize(9);
            doc.setTextColor(100);
            doc.text(`Generated on: ${new Date().toLocaleDateString('en-IN')}`, 14, finalY);

            // Save
            doc.save(`EMI_Breakdown_${data.tenure}months.pdf`);
        } catch (error) {
            console.error('PDF Export Error:', error);
            alert('Failed to export PDF. Please try again.');
        }
    };

    if (!data) return null;

    return (
        <div className="results-card">
            <div className="results-header">
                <h2>📊 EMI Calculation Results</h2>
            </div>

            {/* Compact Stats Strip */}
            <div className="stats-strip">
                <div className="main-emi">
                    <span className="emi-value">{formatCurrencyWithDecimals(data.monthlyEMI)}</span>
                    <span className="emi-label">per month × {data.tenure} months</span>
                </div>
                <div className="quick-stats">
                    <div className="quick-stat">
                        <span className="qs-value">{formatCurrency(data.originalPrice)}</span>
                        <span className="qs-label">Price</span>
                    </div>
                    <div className="quick-stat">
                        <span className="qs-value green">−{formatCurrency(data.discountGiven)}</span>
                        <span className="qs-label">Discount</span>
                    </div>
                    <div className="quick-stat">
                        <span className="qs-value yellow">+{formatCurrency(data.totalInterest)}</span>
                        <span className="qs-label">Interest</span>
                    </div>
                </div>
            </div>

            {/* Hidden Costs Alert */}
            <div className="hidden-costs-section">
                <div className="alert-header">
                    <span className="alert-icon">⚠️</span>
                    <h3>Hidden Costs Revealed!</h3>
                </div>

                <div className="hidden-costs-grid">
                    <div className="hidden-cost-item">
                        <div className="cost-info">
                            <span className="cost-label">GST on Interest (18%)</span>
                            <span className="cost-description">Charged on the total interest amount</span>
                        </div>
                        <span className="cost-value">{formatCurrencyWithDecimals(data.gstOnInterest)}</span>
                    </div>

                    {data.processingFee > 0 && (
                        <>
                            <div className="hidden-cost-item">
                                <div className="cost-info">
                                    <span className="cost-label">Processing Fee</span>
                                    <span className="cost-description">One-time bank processing charge</span>
                                </div>
                                <span className="cost-value">{formatCurrency(data.processingFee)}</span>
                            </div>
                            <div className="hidden-cost-item">
                                <div className="cost-info">
                                    <span className="cost-label">GST on Processing Fee (18%)</span>
                                    <span className="cost-description">GST charged on processing fee</span>
                                </div>
                                <span className="cost-value">{formatCurrencyWithDecimals(data.gstOnProcessingFee)}</span>
                            </div>
                        </>
                    )}

                    <div className="hidden-cost-total">
                        <span className="total-label">Total Hidden Cost</span>
                        <span className="total-value">{formatCurrencyWithDecimals(data.totalHiddenCost)}</span>
                    </div>
                </div>
            </div>

            {/* Final Summary */}
            <div className="final-summary">
                <div className="final-row">
                    <span className="final-label">Total EMI Payments ({data.tenure} months)</span>
                    <span className="final-value">{formatCurrencyWithDecimals(data.monthlyEMI * data.tenure)}</span>
                </div>
                <div className="final-row">
                    <span className="final-label">+ Hidden Costs</span>
                    <span className="final-value hidden">{formatCurrencyWithDecimals(data.totalHiddenCost)}</span>
                </div>
                <div className="final-row total">
                    <span className="final-label">Effective Price You Pay</span>
                    <span className="final-value">{formatCurrencyWithDecimals(data.effectivePrice)}</span>
                </div>
                <div className="price-difference">
                    <span>You pay</span>
                    <span className="diff-amount">{formatCurrencyWithDecimals(data.totalHiddenCost)}</span>
                    <span>more than the sticker price!</span>
                </div>
            </div>

            {/* Monthly Breakdown Controls */}
            <div className="breakdown-controls">
                <button
                    className="breakdown-toggle"
                    onClick={() => setShowBreakdown(!showBreakdown)}
                >
                    <span>{showBreakdown ? 'Hide' : 'Show'} Monthly Breakdown</span>
                    <span className={`toggle-icon ${showBreakdown ? 'open' : ''}`}>▼</span>
                </button>
                <button className="export-btn" onClick={exportToPDF}>
                    <span>📄</span>
                    <span>Export PDF</span>
                </button>
            </div>

            {/* Monthly Breakdown Table */}
            {showBreakdown && (
                <div className="breakdown-table-container">
                    <table className="breakdown-table">
                        <thead>
                            <tr>
                                <th>Month</th>
                                <th>EMI</th>
                                <th>Principal</th>
                                <th>Interest</th>
                                <th className="tooltip-header">
                                    <span data-tooltip="GST on Interest (18%)">GST on Int</span>
                                </th>
                                {data.processingFee > 0 && (
                                    <th className="tooltip-header">
                                        <span data-tooltip="Processing Fee">Pro Fee</span>
                                    </th>
                                )}
                                {data.processingFee > 0 && (
                                    <th className="tooltip-header">
                                        <span data-tooltip="GST on Processing Fee (18%)">PF GST</span>
                                    </th>
                                )}
                                <th>Total Outflow</th>
                                <th>Balance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.monthlyBreakdown.map((row) => (
                                <tr key={row.month} className={row.month === 1 && data.processingFee > 0 ? 'first-month' : ''}>
                                    <td>{row.month}</td>
                                    <td>{formatCurrencyWithDecimals(row.emi)}</td>
                                    <td className="principal">{formatCurrencyWithDecimals(row.principal)}</td>
                                    <td className="interest">{formatCurrencyWithDecimals(row.interest)}</td>
                                    <td className="gst">{formatCurrencyWithDecimals(row.gstOnInterest)}</td>
                                    {data.processingFee > 0 && (
                                        <td className={row.processingFee > 0 ? 'processing-fee' : ''}>
                                            {row.processingFee > 0 ? formatCurrency(row.processingFee) : '-'}
                                        </td>
                                    )}
                                    {data.processingFee > 0 && (
                                        <td className={row.processingFeeGST > 0 ? 'processing-fee' : ''}>
                                            {row.processingFeeGST > 0 ? formatCurrencyWithDecimals(row.processingFeeGST) : '-'}
                                        </td>
                                    )}
                                    <td className="total-outflow">{formatCurrencyWithDecimals(row.totalOutflow)}</td>
                                    <td>{formatCurrencyWithDecimals(row.balance)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* How It Works */}
            <div className="explanation-section">
                <h4>💡 How "No Cost EMI" Really Works</h4>
                <ol className="explanation-list">
                    <li>
                        <strong>The Discount Trick:</strong> The seller shows a discount of {formatCurrency(data.discountGiven)}
                        on the invoice, reducing the price to {formatCurrency(data.discountedPrincipal)}.
                    </li>
                    <li>
                        <strong>Bank Booking:</strong> The bank creates a loan of {formatCurrency(data.discountedPrincipal)}
                        at {data.interestRate}% interest.
                    </li>
                    <li>
                        <strong>Interest Addition:</strong> Over {data.tenure} months, the bank adds {formatCurrency(data.totalInterest)} as interest.
                    </li>
                    <li>
                        <strong>Hidden GST:</strong> 18% GST ({formatCurrencyWithDecimals(data.gstOnInterest)}) is charged on the interest – this is your hidden cost!
                    </li>
                </ol>
            </div>
        </div>
    );
};

export default Results;
