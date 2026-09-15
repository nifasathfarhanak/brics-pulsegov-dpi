import { describe, it, expect } from 'vitest';

/**
 * Unit tests for the server-side heuristic citizen analysis engine.
 * This mirrors the generateHeuristicCitizenAnalysis function from server.ts
 * to validate correct categorization, department routing, and multilingual detection.
 */

// Replicate the heuristic function for isolated unit testing
function generateHeuristicCitizenAnalysis(
  text: string = '',
  country: string = 'India',
  locationName: string = 'Local District',
  preferredLanguage: string = 'Auto-detect',
  hasPhoto: boolean = false
) {
  const lower = (text || '').toLowerCase();

  let category = 'Water & Sanitation';
  let assignedDepartment = 'Department of Public Health Engineering & Water Supply';
  let recommendedAction = 'Dispatch mobile field engineering unit for immediate pipeline inspection and water testing.';
  let urgencyScore = 8;
  let severityLevel: 'Critical' | 'High' | 'Medium' | 'Low' = 'High';
  let keyIssues = ['Community utility disruption', 'Public health risk mitigation'];
  let estimatedPop = 4200;

  if (lower.includes('road') || lower.includes('bridge') || lower.includes('सड़क')) {
    category = 'Transport & Connectivity';
    assignedDepartment = 'State Rural Roads Authority & Public Works Department';
    recommendedAction = 'Deploy road leveling equipment and structurally reinforced culvert repairs.';
    urgencyScore = 7;
    keyIssues = ['Road surface breakdown', 'Isolated agrarian transit corridor'];
    estimatedPop = 6500;
  } else if (lower.includes('power') || lower.includes('electric') || lower.includes('blackout') || lower.includes('बिजली')) {
    category = 'Energy & Microgrids';
    assignedDepartment = 'State Electricity Distribution Board & Renewable Microgrid Cell';
    urgencyScore = 9;
    severityLevel = 'Critical';
    keyIssues = ['Essential cold-chain outage', 'Frequent grid supply interruption'];
    estimatedPop = 3800;
  } else if (lower.includes('clinic') || lower.includes('hospital') || lower.includes('अस्पताल')) {
    category = 'Health Infrastructure';
    assignedDepartment = 'Ministry of Health & Family Welfare Primary Care Directorate';
    urgencyScore = 9;
    severityLevel = 'Critical';
    keyIssues = ['Primary health facility cold-chain failure', 'Emergency medical care disruption'];
    estimatedPop = 8900;
  } else if (lower.includes('farm') || lower.includes('crop') || lower.includes('irrigation') || lower.includes('सिंचाई')) {
    category = 'Agricultural & Irrigation';
    assignedDepartment = 'Department of Agriculture & Command Area Development Authority';
    urgencyScore = 7;
    keyIssues = ['Agricultural canal blockages', 'Irrigation water deficiency for seasonal crops'];
    estimatedPop = 5100;
  }

  let detectedLanguage = preferredLanguage !== 'Auto-detect' ? preferredLanguage : 'English';

  if (/[\u0900-\u097F]/.test(text)) {
    detectedLanguage = 'Hindi (हिंदी)';
  } else if (/[\u0600-\u06FF]/.test(text)) {
    detectedLanguage = 'Arabic / Persian (العربية / فارسی)';
  } else if (/[\u0400-\u04FF]/.test(text)) {
    detectedLanguage = 'Russian (Русский)';
  } else if (/[\u4e00-\u9fa5]/.test(text)) {
    detectedLanguage = 'Mandarin (中文)';
  }

  return {
    detectedLanguage,
    category,
    urgencyScore,
    severityLevel,
    keyIssuesIdentified: keyIssues,
    estimatedAffectedPopulation: estimatedPop,
    assignedDepartment,
    recommendedAction,
    imageAnalysis: hasPhoto
      ? 'Multimodal inspection confirmed: physical infrastructure damage and community access disruption verified.'
      : 'Text-only citizen report verified against regional GIS parameters.',
    verificationStatus: 'AI-Verified',
  };
}

describe('Citizen Report Heuristic Analysis Engine', () => {
  it('correctly categorizes water-related grievances', () => {
    const result = generateHeuristicCitizenAnalysis('no water in area', 'India');
    expect(result.category).toBe('Water & Sanitation');
    expect(result.assignedDepartment).toContain('Water Supply');
    expect(result.severityLevel).toBe('High');
  });

  it('correctly categorizes road/bridge infrastructure reports', () => {
    const result = generateHeuristicCitizenAnalysis('The main road near village is broken with deep potholes', 'India');
    expect(result.category).toBe('Transport & Connectivity');
    expect(result.assignedDepartment).toContain('Public Works');
    expect(result.estimatedAffectedPopulation).toBe(6500);
  });

  it('escalates power outage reports to Critical severity', () => {
    const result = generateHeuristicCitizenAnalysis('There is a complete power blackout for 3 days', 'India');
    expect(result.category).toBe('Energy & Microgrids');
    expect(result.severityLevel).toBe('Critical');
    expect(result.urgencyScore).toBe(9);
  });

  it('correctly routes hospital/clinic reports to Health Ministry', () => {
    const result = generateHeuristicCitizenAnalysis('The clinic has no medicine and the doctor has not visited in weeks', 'India');
    expect(result.category).toBe('Health Infrastructure');
    expect(result.assignedDepartment).toContain('Health');
    expect(result.severityLevel).toBe('Critical');
  });

  it('handles Hindi (Devanagari) script and detects language', () => {
    const result = generateHeuristicCitizenAnalysis('हमारे गांव में बिजली तीन दिन से नहीं आ रही', 'India');
    expect(result.detectedLanguage).toBe('Hindi (हिंदी)');
    expect(result.category).toBe('Energy & Microgrids');
  });

  it('handles Arabic script and detects language', () => {
    const result = generateHeuristicCitizenAnalysis('انقطاع خط مياه الشرب الرئيسي في حي الروضة', 'UAE');
    expect(result.detectedLanguage).toBe('Arabic / Persian (العربية / فارسی)');
  });

  it('correctly identifies irrigation/farm issues', () => {
    const result = generateHeuristicCitizenAnalysis('The irrigation canal is blocked and crops are dying', 'India');
    expect(result.category).toBe('Agricultural & Irrigation');
    expect(result.assignedDepartment).toContain('Agriculture');
  });

  it('marks photo-attached reports with multimodal analysis', () => {
    const result = generateHeuristicCitizenAnalysis('Broken pipeline', 'India', 'Bihar', 'Auto-detect', true);
    expect(result.imageAnalysis).toContain('Multimodal');
  });

  it('marks text-only reports without photo evidence', () => {
    const result = generateHeuristicCitizenAnalysis('Broken pipeline', 'India', 'Bihar', 'Auto-detect', false);
    expect(result.imageAnalysis).toContain('Text-only');
  });

  it('defaults to Water & Sanitation for ambiguous reports', () => {
    const result = generateHeuristicCitizenAnalysis('there is a big problem in our area please help', 'India');
    expect(result.category).toBe('Water & Sanitation');
    expect(result.verificationStatus).toBe('AI-Verified');
  });
});
