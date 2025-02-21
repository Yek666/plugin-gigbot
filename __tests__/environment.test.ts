import { describe, it, expect, vi, beforeEach } from 'vitest';
import { validateGigConfig, gigEnvSchema } from '../src/environment';
import type { IAgentRuntime } from '@elizaos/core';

describe('Gig Environment Configuration', () => {
  let mockRuntime: IAgentRuntime;

  beforeEach(() => {
    mockRuntime = {
      getSetting: vi.fn(),
    } as unknown as IAgentRuntime;

    // Clear process.env before each test
    process.env = {};
  });

  it('uses default values when no config is provided', async () => {
    vi.mocked(mockRuntime.getSetting).mockImplementation(() => null);

    const config = await validateGigConfig(mockRuntime);
    expect(config).toEqual({
      GIGBOT_API_URL: 'https://www.gigbot.xyz/api',
      GIG_SEARCH_INTERVAL: '3',
      GIG_ACTION_INTERVAL: '12',
      GIG_CLAIM_INTERVAL: '24',
      GIG_CLAIM_PLATFORM: 'x'
    });
  });

  it('prioritizes runtime settings over process.env', async () => {
    const runtimeConfig = {
      GIGBOT_API_URL: 'https://runtime.example.com',
      GIG_SEARCH_INTERVAL: '5',
      GIG_ACTION_INTERVAL: '15',
      GIG_CLAIM_INTERVAL: '30',
      GIG_CLAIM_PLATFORM: 'x'
    };

    process.env = {
      GIGBOT_API_URL: 'https://env.example.com',
      GIG_SEARCH_INTERVAL: '1',
      GIG_ACTION_INTERVAL: '2',
      GIG_CLAIM_INTERVAL: '3',
      GIG_CLAIM_PLATFORM: 'farcaster'
    };

    vi.mocked(mockRuntime.getSetting).mockImplementation((key: string) => runtimeConfig[key as keyof typeof runtimeConfig]);

    const config = await validateGigConfig(mockRuntime);
    expect(config).toEqual(runtimeConfig);
  });

  it('uses process.env when runtime settings are undefined', async () => {
    vi.mocked(mockRuntime.getSetting).mockImplementation(() => null);

    process.env = {
      GIGBOT_API_URL: 'https://env.example.com',
      GIG_SEARCH_INTERVAL: '1',
      GIG_ACTION_INTERVAL: '2',
      GIG_CLAIM_INTERVAL: '3',
      GIG_CLAIM_PLATFORM: 'farcaster'
    };

    const config = await validateGigConfig(mockRuntime);
    expect(config).toEqual(process.env);
  });

  it('transforms empty interval values to defaults', async () => {
    const configWithEmpty = {
      GIGBOT_API_URL: 'https://example.com',
      GIG_SEARCH_INTERVAL: '',
      GIG_ACTION_INTERVAL: '12',
      GIG_CLAIM_INTERVAL: '24',
      GIG_CLAIM_PLATFORM: 'x'
    }

    vi.mocked(mockRuntime.getSetting).mockImplementation((key: string) => configWithEmpty[key as keyof typeof configWithEmpty])

    const config = await validateGigConfig(mockRuntime)
    expect(config.GIG_SEARCH_INTERVAL).toBe('3') // Should use default value
  });

  describe('validation errors', () => {
    it('throws error for invalid GIG_CLAIM_PLATFORM value', async () => {
      vi.mocked(mockRuntime.getSetting).mockImplementation(() => 'invalid_platform');

      await expect(validateGigConfig(mockRuntime)).rejects.toThrow();
    });

    it('throws error for invalid URL format', async () => {
      const invalidConfig = {
        GIGBOT_API_URL: 'not-a-url',
        GIG_SEARCH_INTERVAL: '3',
        GIG_ACTION_INTERVAL: '12',
        GIG_CLAIM_INTERVAL: '24',
        GIG_CLAIM_PLATFORM: 'x'
      };

      vi.mocked(mockRuntime.getSetting).mockImplementation((key: string) => invalidConfig[key as keyof typeof invalidConfig]);

      await expect(validateGigConfig(mockRuntime)).rejects.toThrow();
    });
  });

  describe('schema validation', () => {
    it('validates schema directly with valid data', () => {
      const validData = {
        GIGBOT_API_URL: 'https://example.com',
        GIG_SEARCH_INTERVAL: '5',
        GIG_ACTION_INTERVAL: '10',
        GIG_CLAIM_INTERVAL: '15',
        GIG_CLAIM_PLATFORM: 'farcaster' as const
      };

      const result = gigEnvSchema.parse(validData);
      expect(result).toEqual(validData);
    });

    it('applies default values for missing fields', () => {
      const partialData = {};
      
      const result = gigEnvSchema.parse(partialData);
      expect(result).toEqual({
        GIGBOT_API_URL: 'https://www.gigbot.xyz/api',
        GIG_SEARCH_INTERVAL: '3',
        GIG_ACTION_INTERVAL: '12',
        GIG_CLAIM_INTERVAL: '24',
        GIG_CLAIM_PLATFORM: 'x'
      });
    });
  });
});