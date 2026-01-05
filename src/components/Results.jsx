import { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatCurrency, formatCurrencyWithDecimals } from '../utils/emiCalculator';
import './Results.css';

const Results = ({ data }) => {
    const [showBreakdown, setShowBreakdown] = useState(true);

    const exportToPDF = () => {
        try {
            const doc = new jsPDF();

            // Helper to strip currency symbol for PDF (since headers will have Rs.)
            // We keep the formatting (commas), just remove the symbol.
            const formatForPDF = (str) => str.replace(/₹/g, '').trim();

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
            doc.text(`Rs. ${data.originalPrice.toLocaleString('en-IN')}`, 52, 32);

            doc.setFont('helvetica', 'normal');
            doc.text('Monthly EMI: ', 14, 38);
            doc.setFont('helvetica', 'bold');
            doc.text(`Rs. ${data.monthlyEMI.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 52, 38);

            doc.setFont('helvetica', 'normal');
            doc.text('Tenure: ', 14, 44);
            doc.setFont('helvetica', 'bold');
            doc.text(`${data.tenure} months`, 52, 44);

            doc.setFont('helvetica', 'normal');
            doc.text('Total Hidden Cost: ', 14, 50);
            doc.setFont('helvetica', 'bold');
            doc.text(`Rs. ${data.totalHiddenCost.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 52, 50);

            // Effective Monthly Cost - Highlighted
            doc.setFontSize(12);
            // Effective Monthly Cost - Highlighted
            doc.setFontSize(12);
            doc.setTextColor(60, 60, 60); // Neutral dark gray
            doc.setFont('helvetica', 'bold');
            doc.text('Effective Monthly Cost: ', 14, 58);

            doc.setFontSize(14);
            const effectiveMonthlyCost = data.effectivePrice / data.tenure;
            doc.text(`Rs. ${effectiveMonthlyCost.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 70, 58);

            // Table headers
            const headers = ['Month', 'EMI (Rs.)', 'Principal (Rs.)', 'Interest (Rs.)', 'GST on Int (Rs.)', 'Total Payable (Rs.)', 'Balance (Rs.)'];
            let totalOutflowCol = 5;
            if (data.processingFee > 0) {
                headers.splice(5, 0, 'Pro Fee (Rs.)', 'PF GST (Rs.)');
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

            // Calculate totals for footer
            const totalEMI = data.monthlyBreakdown.reduce((sum, row) => sum + row.emi, 0);
            const totalPrincipal = data.monthlyBreakdown.reduce((sum, row) => sum + row.principal, 0);
            const totalInterest = data.monthlyBreakdown.reduce((sum, row) => sum + row.interest, 0);
            const totalGST = data.monthlyBreakdown.reduce((sum, row) => sum + row.gstOnInterest, 0);

            const footerRow = [
                'Total',
                formatForPDF(formatCurrencyWithDecimals(totalEMI)),
                formatForPDF(formatCurrencyWithDecimals(totalPrincipal)),
                formatForPDF(formatCurrencyWithDecimals(totalInterest)),
                formatForPDF(formatCurrencyWithDecimals(totalGST)),
            ];

            if (data.processingFee > 0) {
                footerRow.push(formatForPDF(formatCurrency(data.processingFee)));
                footerRow.push(formatForPDF(formatCurrencyWithDecimals(data.gstOnProcessingFee)));
            }

            footerRow.push(formatForPDF(formatCurrencyWithDecimals(data.effectivePrice)));
            footerRow.push('-'); // Balance

            // Generate table using autoTable
            autoTable(doc, {
                head: [headers],
                body: tableData,
                foot: [footerRow],
                startY: 68,
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
                footStyles: {
                    fillColor: [240, 240, 240], // Light gray background
                    textColor: [60, 60, 60], // Dark gray text
                    fontStyle: 'bold',
                    halign: 'right',
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

            {/* Top Stats Strip */}
            <div className="stats-strip">
                <div className="stat-item emi-display">
                    <span className="stat-label">Real Monthly Cost</span>
                    <span className="emi-value">{formatCurrencyWithDecimals(data.effectivePrice / data.tenure)}</span>
                    <div className="emi-comparison">
                        <span className="comparison-label">vs Bank EMI: </span>
                        <span className="comparison-value">{formatCurrencyWithDecimals(data.originalPrice / data.tenure)}</span>
                    </div>
                    <span className="emi-sublabel">for {data.tenure} months</span>
                </div>
            </div>

            {/* Mechanism Explanation - Simplified */}
            <div className="mechanism-simple">
                <span className="mech-icon">ℹ️</span>
                <p>
                    Bank charges interest of <span className="highlight-red">{formatCurrencyWithDecimals(data.totalInterest)}</span>,
                    which is offset by an upfront discount of <span className="highlight-green">{formatCurrencyWithDecimals(data.discountGiven || data.totalInterest)}</span>.
                </p>
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
                <div className="final-row effective-monthly">
                    <span className="final-label">Effective Monthly Cost</span>
                    <span className="final-value">{formatCurrencyWithDecimals(data.effectivePrice / data.tenure)}</span>
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
                <div className="breakdown-container">
                    {/* Desktop Table */}
                    <table className="breakdown-table desktop-only">
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
                                    <>
                                        <th className="tooltip-header">
                                            <span data-tooltip="Processing Fee">Pro Fee</span>
                                        </th>
                                        <th className="tooltip-header">
                                            <span data-tooltip="GST on Processing Fee (18%)">PF GST</span>
                                        </th>
                                    </>
                                )}
                                <th>Total Payable Amount</th>
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
                                        <>
                                            <td className={row.processingFee > 0 ? 'processing-fee' : ''}>
                                                {row.processingFee > 0 ? formatCurrency(row.processingFee) : '-'}
                                            </td>
                                            <td className={row.processingFeeGST > 0 ? 'processing-fee' : ''}>
                                                {row.processingFeeGST > 0 ? formatCurrencyWithDecimals(row.processingFeeGST) : '-'}
                                            </td>
                                        </>
                                    )}
                                    <td className="total-outflow">{formatCurrencyWithDecimals(row.totalOutflow)}</td>
                                    <td>{formatCurrencyWithDecimals(row.balance)}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <th>Total</th>
                                <th>{formatCurrencyWithDecimals(data.monthlyBreakdown.reduce((sum, row) => sum + row.emi, 0))}</th>
                                <th>{formatCurrencyWithDecimals(data.monthlyBreakdown.reduce((sum, row) => sum + row.principal, 0))}</th>
                                <th>{formatCurrencyWithDecimals(data.monthlyBreakdown.reduce((sum, row) => sum + row.interest, 0))}</th>
                                <th>{formatCurrencyWithDecimals(data.monthlyBreakdown.reduce((sum, row) => sum + row.gstOnInterest, 0))}</th>
                                {data.processingFee > 0 && (
                                    <>
                                        <th>{formatCurrency(data.processingFee)}</th>
                                        <th>{formatCurrencyWithDecimals(data.gstOnProcessingFee)}</th>
                                    </>
                                )}
                                <th>{formatCurrencyWithDecimals(data.effectivePrice)}</th>
                                <th>-</th>
                            </tr>
                        </tfoot>
                    </table>

                    {/* Mobile List View */}
                    <div className="mobile-breakdown-list mobile-only">
                        {data.monthlyBreakdown.map((row) => (
                            <div key={row.month} className={`mobile-card ${row.month === 1 && data.processingFee > 0 ? 'highlight-card' : ''}`}>
                                <div className="card-header">
                                    <span className="month-badge">Month {row.month}</span>
                                    <span className="card-total">{formatCurrencyWithDecimals(row.totalOutflow)}</span>
                                </div>
                                <div className="card-row">
                                    <span>EMI</span>
                                    <span>{formatCurrencyWithDecimals(row.emi)}</span>
                                </div>
                                <div className="card-row">
                                    <span>Principal</span>
                                    <span className="text-muted">{formatCurrencyWithDecimals(row.principal)}</span>
                                </div>
                                <div className="card-row">
                                    <span>Interest</span>
                                    <span className="text-warning">{formatCurrencyWithDecimals(row.interest)}</span>
                                </div>
                                <div className="card-row">
                                    <span>GST on Int</span>
                                    <span className="text-danger">{formatCurrencyWithDecimals(row.gstOnInterest)}</span>
                                </div>
                                {(row.processingFee > 0 || row.processingFeeGST > 0) && (
                                    <div className="card-extras">
                                        {row.processingFee > 0 && (
                                            <div className="card-row extra">
                                                <span>Processing Fee</span>
                                                <span>{formatCurrency(row.processingFee)}</span>
                                            </div>
                                        )}
                                        {row.processingFeeGST > 0 && (
                                            <div className="card-row extra">
                                                <span>PF GST</span>
                                                <span>{formatCurrencyWithDecimals(row.processingFeeGST)}</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                                <div className="card-row balance-row">
                                    <span>Balance</span>
                                    <span>{formatCurrencyWithDecimals(row.balance)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
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
