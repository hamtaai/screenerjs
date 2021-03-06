"use strict";

import { createLogger , format, LoggerOptions, transports } from "winston";
import { ScreenerLoggerOptions } from "../../compiler/types";

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//

/**
 *
 * @param formatConfig
 */
function configToFormat(formatConfig) {
    if (formatConfig === "json") {
        return format.json();
    }

    throw new Error("Unsupported WinstonJS format.");
}

/**
 *
 * @param transportConfig
 *
 * @return {LoggerOptions.transports}
 */
function configToTransport(transportConfig) {

    return new transports.File();
}

/**
 *
 * @param {ScreenerLoggerOptions} config
 *
 * @return {LoggerOptions}
 */
function screenerToLogger(config) {
    const options: LoggerOptions = {
        level: config.level,
    };

    options.format = configToFormat(config.format);
    options.transports = [];

    config.transports.forEach((transport) => {
        // @ts-ignore
        // options.transports.push(configToTransport(transport));
    });

    return options;
}

const create = function createWinston(config) {
    const logger = createLogger(screenerToLogger(config));
    if (process.env.NODE_ENV !== "production") {
        logger.add(new transports.Console({
            format: format.simple(),
        }));
    }

    return logger;
};

module.exports = create;
