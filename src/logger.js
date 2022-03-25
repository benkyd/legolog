// Better than Log4j2022 for now.

const net = require('net');
const fs = require('fs');
const moment = require('moment');
const clc = require('cli-color');

const LEVEL_VERBOSE = 0;
const LEVEL_DEBUG = 1;
const LEVEL_INFO = 2;
const LEVEL_WARN = 3;
const LEVEL_STICK = 9; // regardless, will log

let DoNetworkLogging = false;

// default values
let Options = {
    logLevel: LEVEL_VERBOSE,
    logToConsole: true,
    logFile: null,
    networkHost: null,
    networkPort: null,
};

let Socket = null;


function getFormatedTimeString() {
    return `[${moment().format('YYYY-MM-DD HH:mm:ss.SSS')}]`;
}

// levelSource is the level that the source will log at ie, if levelSource is
// LEVEL_WARN, it will only log if the current level is at or above LEVEL_WARN.
function internalLog(type, message, cConsoleColour, levelSource) {
    if (Options.logToConsole && (Options.logLevel <= levelSource)) {
        console.log(`${getFormatedTimeString()} [${cConsoleColour(type)}] ${message}`);
    }
    const m = `${getFormatedTimeString()} [${type}] ${message}`;
    if (Options.logFile) {
        fs.appendFileSync(Options.logFile, m + '\n');
    }
    if (Options.networkHost && DoNetworkLogging) {
        Socket.write(m + '\n');
    }
    if (type === 'PANIC') {
        Destroy();
        process.exit(1);
    }
}

const Info = (...messages) => internalLog('INFO', messages.join(' '), clc.greenBright, LEVEL_INFO);
const Warn = (...messages) => internalLog('WARN', messages.join(' '), clc.yellowBright, LEVEL_WARN);
const Error = (...messages) => internalLog('ERROR', messages.join(' '), clc.redBright, LEVEL_STICK);
const Panic = (...messages) => internalLog('PANIC', messages.join(' '), clc.bgRedBright, LEVEL_STICK);
const Debug = (...messages) => internalLog('DEBUG', messages.join(' '), clc.cyanBright, LEVEL_DEBUG);
const Module = (module, ...messages) => internalLog(`MODULE [${module}]`, ` ${messages.join(' ')}`, clc.blue, LEVEL_INFO);
const Database = (...messages) => internalLog('PSQL', `[DB] ${messages.join(' ')}`, clc.blue, LEVEL_INFO);
const ExpressLogger = (req, res, next) => {
    internalLog('HTTP', `[${req.method}] ${req.originalUrl} FROM ${req.headers['x-forwarded-for'] || req.socket.remoteAddress}`, clc.magenta, LEVEL_VERBOSE);
    next();
};


function startReconnection() {
    const x = setInterval(async () => {
        if (Options.networkHost && Options.networkPort && !DoNetworkLogging) {
            const success = await initNetworkLogger(Options.networkHost, Options.networkPort);
            if (success) {
                clearInterval(x);
                Info('Logger Reonnected');
            }
        }
    }, 30000);
}

function initNetworkLogger(host, port) {
    return new Promise((resolve) => {
        Socket = net.connect({
            port,
            host,
            family: 4,
            onread: {
                // Reuses a 4KiB Buffer for every read from the socket.
                buffer: Buffer.alloc(4 * 1024),
                callback: function (nread, buf) {
                    Warn(`LogSocket: ${buf.toString('utf8', 0, nread)}`);
                },
            },
        }, () => {
            Info('Logger Connected to Network');
            DoNetworkLogging = true;
            resolve(true);
        }).on('error', (err) => {
            Error('Logger Disconnected from Network: ', err);
            DoNetworkLogging = false;
            resolve(false);
        });
    });
}

function postInit() {
    Socket.on('close', () => {
        Error('Logger Network Connection Closed');
        DoNetworkLogging = false;
        startReconnection();
    });

    Socket.on('error', (err) => {
        Error('Logger Disconnected from Network: ', err);
        DoNetworkLogging = false;
        startReconnection();
    });
}

/**
 * Initialises the logger
 * Options:
 * - logLevel: The level of logging to be used ONLY APPLIES TO CONSOLE.
 * - logToConsole: Whether to log to the console.
 * - logFile: The file to log to, if provided, will log.
 * - networkHost: The address to log to, including port, if provided, will log.
 * - networkPort: The port to log to, including port, if provided, will log.
 * TODO: SSL
 * @param {Object} options
 */
async function Init(options) {
    Options = options;

    if (Options.logFile) {
        fs.openSync(Options.logFile, 'w');
        fs.appendFileSync(Options.logFile, 'START OF SESSION' + '\n');
    }

    if (!Options.networkHost || !Options.networkPort) {
        return;
    }

    await initNetworkLogger(Options.networkHost, Options.networkPort);
    postInit();
}

function Destroy() {
    if (Options.logFile) {
        fs.appendFileSync(Options.logFile, 'END OF SESSION' + '\n');
        fs.closeSync(Options.logFile);
    }

    if (Options.networkHost) {
        Socket.destroy();
    }
}

module.exports = {
    LEVEL_VERBOSE,
    LEVEL_DEBUG,
    LEVEL_INFO,
    LEVEL_WARN,
    Init,
    Destroy,
    Info,
    Warn,
    Error,
    Panic,
    Debug,
    Module,
    Database,
    ExpressLogger,
};
