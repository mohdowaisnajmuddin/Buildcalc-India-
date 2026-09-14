import type { EstimateResponse } from '../types.js';

/**
 * Formats a number to Indian numbering system (e.g., 42,50,000)
 */
export function formatIndianNumber(num: number): string {
  if (isNaN(num)) return '0';
  const rounded = Math.round(num);
  const str = Math.abs(rounded).toString();
  
  if (str.length <= 3) {
    return (rounded < 0 ? '-' : '') + str;
  }
  
  const lastThree = str.substring(str.length - 3);
  const otherNumbers = str.substring(0, str.length - 3);
  const formattedOthers = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  
  return (rounded < 0 ? '-' : '') + formattedOthers + ',' + lastThree;
}

/**
 * Formats currency with Rupee symbol in Indian numbering system
 */
export function formatCurrency(amount: number): string {
  return `₹${formatIndianNumber(amount)}`;
}

/**
 * Formats in Lakhs (L) or Crores (Cr) for quick scannability
 */
export function formatCompactINR(amount: number): string {
  if (isNaN(amount)) return '₹0';
  const abs = Math.abs(amount);
  if (abs >= 10000000) {
    // 1 Crore = 10,000,000
    const cr = (amount / 10000000).toFixed(2);
    return `₹${cr} Cr`;
  }
  if (abs >= 100000) {
    // 1 Lakh = 100,000
    const lk = (amount / 100000).toFixed(2);
    return `₹${lk} L`;
  }
  return formatCurrency(amount);
}

/**
 * Generates pre-filled WhatsApp share link
 */
export function generateWhatsAppShareUrl(estimate: EstimateResponse, recipientPhone?: string): string {
  const gradeLabel = estimate.materialGrade.toUpperCase();
  const dateStr = new Date(estimate.generatedAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const message = `*BuildCalc Construction Cost Estimate*
📍 *Location:* ${estimate.cityName}
📐 *Built-up Area:* ${formatIndianNumber(estimate.areaSqft)} sq ft (${estimate.floors} Floor${estimate.floors > 1 ? 's' : ''})
🏗️ *Specification:* ${gradeLabel} Grade | ${estimate.soilType.replace('_', ' ').toUpperCase()} Soil

*Cost Breakdown:*
• Base Civil & Turnkey: ${formatCurrency(estimate.breakdown.baseCost)}
• Foundation / Soil Surcharge: ${formatCurrency(estimate.breakdown.soilSurcharge)} (${estimate.breakdown.soilSurchargePercent}%)
• Material Wastage Allowance: ${formatCurrency(estimate.breakdown.wastageCost)} (${estimate.breakdown.wastagePercent}%)
• Statutory GST (18%): ${formatCurrency(estimate.breakdown.gstCost)}
-------------------------------------
*TOTAL ESTIMATED COST:* ${formatCurrency(estimate.estimatedCost)} (${formatCompactINR(estimate.estimatedCost)})
*Confidence Range (90%):* ${formatCompactINR(estimate.confidenceRange[0])} – ${formatCompactINR(estimate.confidenceRange[1])}
*Effective Rate:* ₹${formatIndianNumber(estimate.breakdown.effectiveRatePerSqft)}/sq ft

_Model: ${estimate.modelVersion} (MAE: ±₹${formatIndianNumber(estimate.evalScores.maeScore)})_
_Rates Schedule: ${estimate.ratesLastUpdated}_
_Generated via BuildCalc on ${dateStr}_`;

  const encodedText = encodeURIComponent(message);
  if (recipientPhone && recipientPhone.trim().length >= 10) {
    const cleanPhone = recipientPhone.replace(/\D/g, '');
    return `https://wa.me/${cleanPhone}?text=${encodedText}`;
  }
  return `https://wa.me/?text=${encodedText}`;
}
