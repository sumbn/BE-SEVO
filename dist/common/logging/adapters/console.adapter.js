"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsoleAdapter = void 0;
const common_1 = require("@nestjs/common");
let ConsoleAdapter = class ConsoleAdapter {
    colors = {
        info: '\x1b[36m',
        warn: '\x1b[33m',
        error: '\x1b[31m',
        reset: '\x1b[0m',
        dim: '\x1b[2m',
    };
    write(entry) {
        const color = this.colors[entry.level];
        const reset = this.colors.reset;
        const dim = this.colors.dim;
        const levelTag = this.formatLevel(entry.level);
        const timestamp = this.formatTimestamp(entry.timestamp);
        const requestId = entry.metadata.request_id
            ? `[${entry.metadata.request_id.slice(0, 8)}]`
            : '';
        const prefix = `${color}${levelTag}${reset} ${dim}${timestamp}${reset} ${requestId}`;
        console.log(`${prefix} ${entry.message}`);
        const contextKeys = Object.keys(entry.metadata).filter(key => !['env', 'service', 'request_id'].includes(key));
        if (contextKeys.length > 0) {
            const context = {};
            contextKeys.forEach(key => {
                context[key] = entry.metadata[key];
            });
            console.log(`${dim}  └─ Context:${reset}`, context);
        }
    }
    formatLevel(level) {
        return `[${level.toUpperCase().padEnd(5)}]`;
    }
    formatTimestamp(isoString) {
        const date = new Date(isoString);
        return date.toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    }
};
exports.ConsoleAdapter = ConsoleAdapter;
exports.ConsoleAdapter = ConsoleAdapter = __decorate([
    (0, common_1.Injectable)()
], ConsoleAdapter);
//# sourceMappingURL=console.adapter.js.map