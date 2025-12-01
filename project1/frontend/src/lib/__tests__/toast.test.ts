import { toast } from '../toast';

describe('toast', () => {
  let consoleLogSpy: jest.SpyInstance;
  let alertSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    alertSpy = jest.spyOn(window, 'alert').mockImplementation();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    alertSpy.mockRestore();
  });

  describe('success', () => {
    it('should log success message to console', () => {
      toast.success('Operation successful');

      expect(consoleLogSpy).toHaveBeenCalledWith('[SUCCESS]:', 'Operation successful');
      expect(consoleLogSpy).toHaveBeenCalledWith('✅', 'Operation successful');
      expect(alertSpy).not.toHaveBeenCalled();
    });
  });

  describe('error', () => {
    it('should show alert for error messages', () => {
      toast.error('Something went wrong');

      expect(consoleLogSpy).toHaveBeenCalledWith('[ERROR]:', 'Something went wrong');
      expect(alertSpy).toHaveBeenCalledWith('خطا: Something went wrong');
    });
  });

  describe('info', () => {
    it('should log info message to console', () => {
      toast.info('Information message');

      expect(consoleLogSpy).toHaveBeenCalledWith('[INFO]:', 'Information message');
      expect(alertSpy).not.toHaveBeenCalled();
    });
  });

  describe('warning', () => {
    it('should log warning message to console', () => {
      toast.warning('Warning message');

      expect(consoleLogSpy).toHaveBeenCalledWith('[WARNING]:', 'Warning message');
      expect(alertSpy).not.toHaveBeenCalled();
    });
  });
});
