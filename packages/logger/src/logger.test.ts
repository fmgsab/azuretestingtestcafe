import logger from './logger';

describe('logger', () => {
  it('should log a message with info', async () => {
    const spy = vi.spyOn(logger, 'info').mockImplementation((msg) => msg);
    logger.info('message');
    expect(spy).toHaveBeenCalledTimes(1);
    spy.mockRestore();
  });
});
