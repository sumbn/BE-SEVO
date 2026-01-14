"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var GoogleSheetsAdapter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleSheetsAdapter = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const google_auth_library_1 = require("google-auth-library");
let GoogleSheetsAdapter = GoogleSheetsAdapter_1 = class GoogleSheetsAdapter {
    configService;
    logger = new common_1.Logger(GoogleSheetsAdapter_1.name);
    spreadsheetId;
    serviceAccountEmail;
    privateKey;
    sheetName = 'Logs';
    isEnabled;
    auth = null;
    accessToken = null;
    tokenExpiry = 0;
    logBuffer = [];
    flushInterval = 10000;
    maxBufferSize = 50;
    flushTimer = null;
    constructor(configService) {
        this.configService = configService;
        this.spreadsheetId = this.configService.get('GOOGLE_SHEETS_SPREADSHEET_ID');
        this.serviceAccountEmail = this.configService.get('GOOGLE_SERVICE_ACCOUNT_EMAIL');
        this.privateKey = this.configService.get('GOOGLE_PRIVATE_KEY');
        this.isEnabled = !!(this.spreadsheetId && this.serviceAccountEmail && this.privateKey);
        if (!this.isEnabled) {
            this.logger.warn('GoogleSheetsAdapter: Missing credentials. Required: GOOGLE_SHEETS_SPREADSHEET_ID, GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY. Falling back to console.');
        }
        else {
            this.initAuth();
            this.logger.log('GoogleSheetsAdapter: Initialized successfully');
            this.startFlushTimer();
        }
    }
    initAuth() {
        try {
            const privateKey = this.privateKey.replace(/\\n/g, '\n');
            this.auth = new google_auth_library_1.GoogleAuth({
                credentials: {
                    client_email: this.serviceAccountEmail,
                    private_key: privateKey,
                },
                scopes: ['https://www.googleapis.com/auth/spreadsheets'],
            });
        }
        catch (error) {
            this.logger.error('Failed to initialize Google Auth', error);
        }
    }
    async getAccessToken() {
        if (!this.auth)
            return null;
        if (this.accessToken && Date.now() < this.tokenExpiry - 300000) {
            return this.accessToken;
        }
        try {
            const client = await this.auth.getClient();
            const tokenResponse = await client.getAccessToken();
            if (tokenResponse.token) {
                this.accessToken = tokenResponse.token;
                this.tokenExpiry = Date.now() + 3600000;
                return this.accessToken;
            }
        }
        catch (error) {
            this.logger.error('Failed to get access token', error);
        }
        return null;
    }
    async write(entry) {
        const row = this.formatRow(entry);
        if (!this.isEnabled) {
            this.logToConsole(entry);
            return;
        }
        this.logBuffer.push(row);
        if (this.logBuffer.length >= this.maxBufferSize || entry.level === 'error') {
            await this.flush();
        }
    }
    formatRow(entry) {
        const { env, service, request_id, ...context } = entry.metadata;
        return {
            timestamp: entry.timestamp,
            level: entry.level.toUpperCase(),
            service: service || 'unknown',
            env: env || 'unknown',
            correlation_id: request_id || '',
            message: entry.message,
            context: Object.keys(context).length > 0 ? JSON.stringify(context) : '',
        };
    }
    async flush() {
        if (this.logBuffer.length === 0)
            return;
        const rowsToFlush = [...this.logBuffer];
        this.logBuffer = [];
        try {
            await this.appendRows(rowsToFlush);
            this.logger.debug(`Flushed ${rowsToFlush.length} logs to Google Sheets`);
        }
        catch (error) {
            this.logger.error('Failed to flush logs to Google Sheets', error);
            rowsToFlush.forEach(row => {
                console.log(`[FAILED_FLUSH] ${JSON.stringify(row)}`);
            });
        }
    }
    async appendRows(rows) {
        const token = await this.getAccessToken();
        if (!token) {
            throw new Error('Failed to get access token');
        }
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/${this.sheetName}:append?valueInputOption=USER_ENTERED`;
        const values = rows.map(row => [
            row.timestamp,
            row.level,
            row.service,
            row.env,
            row.correlation_id,
            row.message,
            row.context,
        ]);
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                values,
            }),
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Google Sheets API error: ${response.status} - ${errorText}`);
        }
    }
    startFlushTimer() {
        this.flushTimer = setInterval(() => {
            this.flush().catch(err => {
                this.logger.error('Periodic flush failed', err);
            });
        }, this.flushInterval);
    }
    logToConsole(entry) {
        const colors = {
            info: '\x1b[36m',
            warn: '\x1b[33m',
            error: '\x1b[31m',
            reset: '\x1b[0m',
            dim: '\x1b[2m',
        };
        const color = colors[entry.level];
        const levelTag = `[${entry.level.toUpperCase().padEnd(5)}]`;
        const timestamp = new Date(entry.timestamp).toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
        const requestId = entry.metadata.request_id
            ? `[${entry.metadata.request_id.slice(0, 8)}]`
            : '';
        console.log(`${color}${levelTag}${colors.reset} ${colors.dim}${timestamp}${colors.reset} ${requestId} ${entry.message}`);
    }
    onModuleDestroy() {
        if (this.flushTimer) {
            clearInterval(this.flushTimer);
        }
        this.flush().catch(() => {
        });
    }
};
exports.GoogleSheetsAdapter = GoogleSheetsAdapter;
exports.GoogleSheetsAdapter = GoogleSheetsAdapter = GoogleSheetsAdapter_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], GoogleSheetsAdapter);
//# sourceMappingURL=google-sheets.adapter.js.map