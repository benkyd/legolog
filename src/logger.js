// Better than Log4J 2021TM

const clc = require('cli-color');
const moment = require('moment');
const fs = require('fs');

let LogLevel = 0;
let logPath = 'logs.log';
let dateFormat = 'DD-MM-YY HH:mm:ss'

// must be ran after the config is initalised
// TODO: network logs
module.exports.Init = function (path) {
    if (path) logPath = path;

    // ALWAYS logs to console, others are aditionals
    switch (process.env.LOG_TARGET) {
    case 'console':
    case 'file':
    case 'network':
    default:
    }

    if (!fs.existsSync(logPath)) {
        fs.writeFileSync(logPath, '');
    }
    fs.appendFileSync(logPath, '[SYSTEM STARTING UP] \n');
}

module.exports.SetLevel = function(level) {
    LogLevel = level;
}

module.exports.SetDateFormat = function(format) {
    dateFormat = format;
}

module.exports.VERBOSE_LOGS = 0;
module.exports.DEBUG_LOGS   = 1;
module.exports.INFO_LOGS    = 2;
module.exports.WARN_LOGS    = 3;

module.exports.Middleware = function(origin, ...message) {
    let d = moment().format(dateFormat);
    fs.appendFileSync(logPath, `[${d.toLocaleString()}] [MIDDLEWARE: ${origin}] ${message} \n`);
    if (LogLevel > 0) return; 
    console.log('[' + d.toLocaleString() + '] [' 
        + clc.yellow(`MIDDLEWARE: ${origin}`) + '] ' + message);
}

module.exports.Database = function(...message) {
    let d = moment().format(dateFormat);
    fs.appendFileSync(logPath, `[${d.toLocaleString()}] [POSTGRES: SQL] ${message} \n`);
    if (LogLevel > 0) return; 
    console.log('[' + d.toLocaleString() + '] [' 
        + clc.magentaBright(`POSTGRES: SQL`) + '] ' + message);
}

module.exports.Debug = function(...message) {
    let d = moment().format(dateFormat);
    fs.appendFileSync(logPath, `[${d.toLocaleString()}] [DEBUG] ${message} \n`);
    if (LogLevel > 1) return; 
    console.log('[' + d.toLocaleString() + '] [' 
        + clc.cyan('DEBUG') + '] ' + message);
}

module.exports.Ready = function() {
    let d = moment().format(dateFormat);
    fs.appendFileSync(logPath, `[${d.toLocaleString()}] [READY] \n`);
    console.log('[' + d.toLocaleString() + '] ['
        + clc.rainbow('READY') + ']');
}
    
module.exports.Info = function(...message) {
    let d = moment().format(dateFormat);
    fs.appendFileSync(logPath, `[${d.toLocaleString()}] [INFO] ${message} \n`);
    if (LogLevel > 2) return; 
    console.log('[' + d.toLocaleString() + '] [' 
        + clc.green('INFO') + '] ' + message);
}

module.exports.Warn = function(...message) {
    let d = moment().format(dateFormat);
    fs.appendFileSync(logPath, `[${d.toLocaleString()}] [WARN] ${message} \n`);
    if (LogLevel > 3) return; 
    console.warn('[' + d.toLocaleString() + '] [' 
        + clc.yellow('WARN') + '] ' + message);
}

module.exports.Error = function(...message) {
    let d = moment().format(dateFormat);
    fs.appendFileSync(logPath, `[${d.toLocaleString()}] [ERROR] ${message} \n`);
    console.error('[' + d.toLocaleString() + '] [' 
        + clc.red('ERROR') + '] ' + message);
}

module.exports.Panic = function(...message) {
    let d = moment().format(dateFormat);
    fs.appendFileSync(logPath, `[${d.toLocaleString()}] [PANIC] ${message} \n`);
    console.error('[' + d.toLocaleString() + '] [' 
        + clc.red('PANIC') + '] ' + message);
    console.error('[' + d.toLocaleString() + '] [' 
        + clc.red('PANIC') + '] ABORTING...');
    process.exit();
}