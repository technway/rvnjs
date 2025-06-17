import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { devLog, devError, devWarn, devInfo } from '../utils/logger';

describe('Logger Utilities', () => {
  const originalEnv = process.env;
  const originalConsole = { ...console };

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
    console.log = vi.fn();
    console.error = vi.fn();
    console.warn = vi.fn();
    console.info = vi.fn();
  });

  afterEach(() => {
    process.env = originalEnv;
    console.log = originalConsole.log;
    console.error = originalConsole.error;
    console.warn = originalConsole.warn;
    console.info = originalConsole.info;
    vi.clearAllMocks();
  });

  describe('devLog', () => {
    it('logs message in development environment', () => {
      process.env.NODE_ENV = 'development';
      devLog({ message: 'Test message' });
      expect(console.log).toHaveBeenCalledWith('🔧 Test message');
    });

    it('logs message with data in development environment', () => {
      process.env.NODE_ENV = 'development';
      const data = { key: 'value' };
      devLog({ message: 'Test message', data });
      expect(console.log).toHaveBeenCalledWith('🔧 Test message', data);
    });

    it('does not log in production environment', () => {
      process.env.NODE_ENV = 'production';
      devLog({ message: 'Test message' });
      expect(console.log).not.toHaveBeenCalled();
    });

    it('logs with custom prefix', () => {
      process.env.NODE_ENV = 'development';
      devLog({ message: 'Test message', prefix: '🚀' });
      expect(console.log).toHaveBeenCalledWith('🚀 Test message');
    });
  });

  describe('devError', () => {
    it('logs error in development environment', () => {
      process.env.NODE_ENV = 'development';
      devError({ message: 'Test error' });
      expect(console.error).toHaveBeenCalledWith('❌ Test error');
    });

    it('logs error with data in development environment', () => {
      process.env.NODE_ENV = 'development';
      const error = new Error('Test error');
      devError({ message: 'Error occurred', data: error });
      expect(console.error).toHaveBeenCalledWith('❌ Error occurred', error);
    });

    it('does not log in production environment', () => {
      process.env.NODE_ENV = 'production';
      devError({ message: 'Test error' });
      expect(console.error).not.toHaveBeenCalled();
    });

    it('logs with custom prefix', () => {
      process.env.NODE_ENV = 'development';
      devError({ message: 'Test error', prefix: '💥' });
      expect(console.error).toHaveBeenCalledWith('💥 Test error');
    });
  });

  describe('devWarn', () => {
    it('logs warning in development environment', () => {
      process.env.NODE_ENV = 'development';
      devWarn({ message: 'Test warning' });
      expect(console.warn).toHaveBeenCalledWith('⚠️ Test warning');
    });

    it('logs warning with data in development environment', () => {
      process.env.NODE_ENV = 'development';
      const data = { issue: 'minor' };
      devWarn({ message: 'Warning occurred', data });
      expect(console.warn).toHaveBeenCalledWith('⚠️ Warning occurred', data);
    });

    it('does not log in production environment', () => {
      process.env.NODE_ENV = 'production';
      devWarn({ message: 'Test warning' });
      expect(console.warn).not.toHaveBeenCalled();
    });

    it('logs with custom prefix', () => {
      process.env.NODE_ENV = 'development';
      devWarn({ message: 'Test warning', prefix: '⚡' });
      expect(console.warn).toHaveBeenCalledWith('⚡ Test warning');
    });
  });

  describe('devInfo', () => {
    it('logs info in development environment', () => {
      process.env.NODE_ENV = 'development';
      devInfo({ message: 'Test info' });
      expect(console.info).toHaveBeenCalledWith('ℹ️ Test info');
    });

    it('logs info with data in development environment', () => {
      process.env.NODE_ENV = 'development';
      const data = { status: 'ok' };
      devInfo({ message: 'Info message', data });
      expect(console.info).toHaveBeenCalledWith('ℹ️ Info message', data);
    });

    it('does not log in production environment', () => {
      process.env.NODE_ENV = 'production';
      devInfo({ message: 'Test info' });
      expect(console.info).not.toHaveBeenCalled();
    });

    it('logs with custom prefix', () => {
      process.env.NODE_ENV = 'development';
      devInfo({ message: 'Test info', prefix: '📌' });
      expect(console.info).toHaveBeenCalledWith('📌 Test info');
    });
  });
});
