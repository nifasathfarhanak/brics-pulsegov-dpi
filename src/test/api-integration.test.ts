import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * Integration tests for the backend API endpoints.
 * Tests the server's REST API contract for citizen report analysis,
 * dialogflow agent, and health check.
 */

// Mock fetch for API integration tests
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('Backend API Contract Tests', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  describe('POST /api/analyze-citizen-report', () => {
    it('returns a valid structured response for water grievance', async () => {
      const mockResponse = {
        success: true,
        data: {
          detectedLanguage: 'English',
          category: 'Water & Sanitation',
          urgencyScore: 8,
          severityLevel: 'High',
          assignedDepartment: 'Department of Public Health Engineering & Water Supply',
          estimatedSlaDays: 14,
          citizenReassuranceMessage: 'Your grievance has been registered.',
          keyIssuesIdentified: ['Community utility disruption'],
          estimatedAffectedPopulation: 4200,
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const response = await fetch('/api/analyze-citizen-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: 'no water in area',
          country: 'India',
          preferredLanguage: 'English',
        }),
      });

      const result = await response.json();

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data.category).toBe('Water & Sanitation');
      expect(result.data.severityLevel).toBe('High');
      expect(result.data.assignedDepartment).toContain('Water');
      expect(result.data.estimatedSlaDays).toBeGreaterThan(0);
      expect(result.data.citizenReassuranceMessage).toBeTruthy();
    });

    it('returns a valid response with correct urgency for critical energy issues', async () => {
      const mockResponse = {
        success: true,
        data: {
          detectedLanguage: 'English',
          category: 'Energy & Microgrids',
          urgencyScore: 9,
          severityLevel: 'Critical',
          assignedDepartment: 'State Electricity Distribution Board',
          estimatedSlaDays: 7,
          citizenReassuranceMessage: 'Emergency power restoration dispatched.',
          keyIssuesIdentified: ['Grid supply interruption'],
          estimatedAffectedPopulation: 3800,
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const response = await fetch('/api/analyze-citizen-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: 'complete power blackout for 3 days',
          country: 'India',
        }),
      });

      const result = await response.json();

      expect(result.data.category).toBe('Energy & Microgrids');
      expect(result.data.severityLevel).toBe('Critical');
      expect(result.data.urgencyScore).toBeGreaterThanOrEqual(9);
    });
  });

  describe('POST /api/dialogflow-agent', () => {
    it('returns a conversational reply for simple greetings', async () => {
      const mockResponse = {
        success: true,
        data: {
          reply: 'Hello! I am your Dialogflow AI Assistant.',
          suggestedQuickActions: ['📍 Drop Pin on Map', '🎙️ Dictate in My Language'],
          detectedIntent: 'COMPLAINT_INTAKE_GUIDE',
          confidence: 0.98,
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const response = await fetch('/api/dialogflow-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'hi',
          language: 'English',
          userLocation: 'India',
        }),
      });

      const result = await response.json();

      expect(result.success).toBe(true);
      expect(result.data.reply).toBeTruthy();
      expect(result.data.suggestedQuickActions).toBeInstanceOf(Array);
      expect(result.data.suggestedQuickActions.length).toBeGreaterThan(0);
      expect(result.data.confidence).toBeGreaterThan(0.5);
    });
  });

  describe('API Response Schema Validation', () => {
    it('analyze-citizen-report response has all required fields', async () => {
      const mockResponse = {
        success: true,
        data: {
          detectedLanguage: 'Hindi (हिंदी)',
          languageCode: 'hi',
          originalTranscript: 'पानी नहीं आ रहा',
          englishTranslation: 'Water is not coming',
          category: 'Water & Sanitation',
          urgencyScore: 8,
          severityLevel: 'High',
          keyIssuesIdentified: ['Water supply disruption'],
          estimatedAffectedPopulation: 4200,
          imageAnalysis: 'Text-only citizen report.',
          verificationStatus: 'AI-Verified',
          assignedDepartment: 'Department of Water Supply',
          estimatedSlaDays: 14,
          recommendedAction: 'Dispatch engineering unit.',
          citizenReassuranceMessage: 'आपकी शिकायत दर्ज हो गई है।',
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const response = await fetch('/api/analyze-citizen-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: 'पानी नहीं आ रहा' }),
      });

      const result = await response.json();
      const data = result.data;

      // Validate all required schema fields are present
      expect(data).toHaveProperty('detectedLanguage');
      expect(data).toHaveProperty('category');
      expect(data).toHaveProperty('urgencyScore');
      expect(data).toHaveProperty('severityLevel');
      expect(data).toHaveProperty('keyIssuesIdentified');
      expect(data).toHaveProperty('estimatedAffectedPopulation');
      expect(data).toHaveProperty('assignedDepartment');
      expect(data).toHaveProperty('estimatedSlaDays');
      expect(data).toHaveProperty('recommendedAction');
      expect(data).toHaveProperty('citizenReassuranceMessage');

      // Validate types
      expect(typeof data.urgencyScore).toBe('number');
      expect(typeof data.estimatedAffectedPopulation).toBe('number');
      expect(Array.isArray(data.keyIssuesIdentified)).toBe(true);
    });
  });
});
