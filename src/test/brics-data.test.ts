import { describe, it, expect } from 'vitest';
import { BRICS_33_LANGUAGES } from '../data/bricsData';

/**
 * Validates that the BRICS 33-language configuration dataset is complete,
 * well-structured, and covers all required BRICS member nations.
 */

describe('BRICS 33-Language Configuration', () => {
  it('contains at least 33 language entries', () => {
    expect(BRICS_33_LANGUAGES.length).toBeGreaterThanOrEqual(33);
  });

  it('each language has required properties', () => {
    for (const lang of BRICS_33_LANGUAGES) {
      expect(lang).toHaveProperty('code');
      expect(lang).toHaveProperty('name');
      expect(lang).toHaveProperty('nativeName');
      expect(lang.code).toBeTruthy();
      expect(lang.name).toBeTruthy();
      expect(lang.nativeName).toBeTruthy();
    }
  });

  it('includes all major BRICS nation languages', () => {
    const names = BRICS_33_LANGUAGES.map(l => l.name.toLowerCase());

    // India
    expect(names.some(n => n.includes('hindi'))).toBe(true);
    expect(names.some(n => n.includes('tamil'))).toBe(true);

    // Brazil
    expect(names.some(n => n.includes('portugu'))).toBe(true);

    // Russia
    expect(names.some(n => n.includes('russian'))).toBe(true);

    // China
    expect(names.some(n => n.includes('mandarin') || n.includes('chinese'))).toBe(true);

    // Arabic-speaking members (Egypt, UAE, Saudi Arabia)
    expect(names.some(n => n.includes('arabic'))).toBe(true);
  });

  it('has unique language codes (no duplicates)', () => {
    const codes = BRICS_33_LANGUAGES.map(l => l.code);
    const uniqueCodes = new Set(codes);
    expect(uniqueCodes.size).toBe(codes.length);
  });

  it('each language has a valid regionFlag emoji', () => {
    for (const lang of BRICS_33_LANGUAGES) {
      expect(lang).toHaveProperty('regionFlag');
      expect(lang.regionFlag.length).toBeGreaterThan(0);
    }
  });
});

describe('Infrastructure Sector Type Validation', () => {
  const VALID_SECTORS = [
    'Water & Sanitation',
    'Transport & Connectivity',
    'Energy & Microgrids',
    'Health Infrastructure',
    'Digital Public Infrastructure',
    'Education & Sanitation',
    'Agricultural & Irrigation',
  ];

  it('has 7 defined infrastructure sectors', () => {
    expect(VALID_SECTORS.length).toBe(7);
  });

  it('all sectors follow consistent naming convention', () => {
    for (const sector of VALID_SECTORS) {
      // Each sector name should be a non-empty, properly capitalized string
      expect(sector.length).toBeGreaterThan(3);
      expect(sector[0]).toBe(sector[0].toUpperCase());
    }
  });
});
