import logger from "electron-log/main";

logger.initialize();
logger.transports.file.format = "[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}]{scope} {text}";

const Logger = {
  info(param: string) {
    logger.info(param);
    console.log(param);
  },
  warn(param: string) {
    logger.warn(param);
    console.log(param);
  },
  error(param: string) {
    logger.error(param);
    console.log(param);
  },
};

export default Logger;
