import { ProblemError } from '@snyk/error-catalog-nodejs';
import chalk from 'chalk';
import { InvalidRequestError } from '@snyk/error-catalog-nodejs/src/catalogs/OpenSourceProjectIssues-error-catalog';

function isErrorOfTypeProblemError(
  error: Error | ProblemError,
): error is ProblemError {
  return (error as ProblemError)?.isErrorCatalogError === true;
}
function loggerFactory(logLevel: 'info' | 'warn' | 'error') {
  const createLogger = (color: string) => (
    error: ProblemError | Error,
    callback?: (err: Error) => void,
  ) => {
    if (isErrorOfTypeProblemError(error)) {
      const jsonResponse = error.toJsonApiErrorObject();
      //TODO: output using chalk
      console.log(
        chalk[color](` ${logLevel.toUpperCase()}  `) +
          ' ' +
          chalk[color](` ${jsonResponse.title}        `) +
          `  (${jsonResponse.code})`,
      );
      console.log('Info:    ' + jsonResponse.detail);
      jsonResponse.status && console.log('HTTP:    ' + jsonResponse.status);
      jsonResponse.links && console.log('Help:    ' + jsonResponse.links.about);
    }
    if (callback) {
      return callback(error);
    }
  };
const loglevelColorMap = {
  info:'bgBlue',
  warn:'bgYellow',
  error:'bgRed',
}
  return createLogger(loglevelColorMap[logLevel]);
}
export const cliOutputFormatter = {
  error: loggerFactory('error'),
  warn: loggerFactory('warn'),
  info: loggerFactory('info'),
};
const testError = new InvalidRequestError('Invalid thins that does thing');
cliOutputFormatter.info(testError);
