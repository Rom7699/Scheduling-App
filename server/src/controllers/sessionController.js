"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCalendarDay = exports.getCalendarWeek = exports.getCalendarMonth = exports.cancelSession = exports.updateSessionStatus = exports.getSessionById = exports.getSessions = exports.createSession = void 0;
var Session_1 = require("../models/Session");
var createSession = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, title, description, startTime, endTime, session, error_1;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                _a = req.body, title = _a.title, description = _a.description, startTime = _a.startTime, endTime = _a.endTime;
                return [4 /*yield*/, Session_1.default.create({
                        title: title,
                        description: description,
                        startTime: new Date(startTime),
                        endTime: new Date(endTime),
                        user: (_b = req.user) === null || _b === void 0 ? void 0 : _b._id,
                        status: 'pending'
                    })];
            case 1:
                session = _c.sent();
                res.status(201).json({
                    success: true,
                    session: session
                });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _c.sent();
                res.status(400).json({ message: error_1.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.createSession = createSession;
var getSessions = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var query, sessions, error_2;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                query = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.isAdmin) ? {} : { user: (_b = req.user) === null || _b === void 0 ? void 0 : _b._id };
                return [4 /*yield*/, Session_1.default.find(query).populate('user', 'name email')];
            case 1:
                sessions = _c.sent();
                res.status(200).json({
                    success: true,
                    count: sessions.length,
                    sessions: sessions
                });
                return [3 /*break*/, 3];
            case 2:
                error_2 = _c.sent();
                res.status(400).json({ message: error_2.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getSessions = getSessions;
var getSessionById = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var session, error_3;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Session_1.default.findById(req.params.id).populate('user', 'name email')];
            case 1:
                session = _c.sent();
                if (!session) {
                    return [2 /*return*/, res.status(404).json({ message: 'Session not found' })];
                }
                // Check if user is authorized to view this session
                if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.isAdmin) && session.user.toString() !== ((_b = req.user) === null || _b === void 0 ? void 0 : _b._id.toString())) {
                    return [2 /*return*/, res.status(403).json({ message: 'Not authorized to access this session' })];
                }
                res.status(200).json({
                    success: true,
                    session: session
                });
                return [3 /*break*/, 3];
            case 2:
                error_3 = _c.sent();
                res.status(400).json({ message: error_3.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getSessionById = getSessionById;
var updateSessionStatus = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var status_1, session, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                status_1 = req.body.status;
                if (!['pending', 'approved', 'rejected', 'cancelled'].includes(status_1)) {
                    return [2 /*return*/, res.status(400).json({ message: 'Invalid status' })];
                }
                return [4 /*yield*/, Session_1.default.findById(req.params.id)];
            case 1:
                session = _a.sent();
                if (!session) {
                    return [2 /*return*/, res.status(404).json({ message: 'Session not found' })];
                }
                session.status = status_1;
                return [4 /*yield*/, session.save()];
            case 2:
                _a.sent();
                res.status(200).json({
                    success: true,
                    session: session
                });
                return [3 /*break*/, 4];
            case 3:
                error_4 = _a.sent();
                res.status(400).json({ message: error_4.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.updateSessionStatus = updateSessionStatus;
var cancelSession = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var session, error_5;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 3, , 4]);
                return [4 /*yield*/, Session_1.default.findById(req.params.id)];
            case 1:
                session = _c.sent();
                if (!session) {
                    return [2 /*return*/, res.status(404).json({ message: 'Session not found' })];
                }
                // Check if user is authorized to cancel this session
                if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.isAdmin) && session.user.toString() !== ((_b = req.user) === null || _b === void 0 ? void 0 : _b._id.toString())) {
                    return [2 /*return*/, res.status(403).json({ message: 'Not authorized to cancel this session' })];
                }
                session.status = 'cancelled';
                return [4 /*yield*/, session.save()];
            case 2:
                _c.sent();
                res.status(200).json({
                    success: true,
                    session: session
                });
                return [3 /*break*/, 4];
            case 3:
                error_5 = _c.sent();
                res.status(400).json({ message: error_5.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.cancelSession = cancelSession;
var getCalendarMonth = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, year, month, startDate, endDate, query, sessions, error_6;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                _a = req.params, year = _a.year, month = _a.month;
                startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
                endDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59);
                query = __assign({ startTime: { $gte: startDate, $lte: endDate } }, (((_b = req.user) === null || _b === void 0 ? void 0 : _b.isAdmin) ? {} : { status: 'approved' }));
                return [4 /*yield*/, Session_1.default.find(query).populate('user', 'name email')];
            case 1:
                sessions = _c.sent();
                res.status(200).json({
                    success: true,
                    count: sessions.length,
                    sessions: sessions
                });
                return [3 /*break*/, 3];
            case 2:
                error_6 = _c.sent();
                res.status(400).json({ message: error_6.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getCalendarMonth = getCalendarMonth;
var getCalendarWeek = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, year, week, firstDayOfYear, dayOffset, startDate, endDate, query, sessions, error_7;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                _a = req.params, year = _a.year, week = _a.week;
                firstDayOfYear = new Date(parseInt(year), 0, 1);
                dayOffset = firstDayOfYear.getDay();
                startDate = new Date(parseInt(year), 0, 1 + (parseInt(week) - 1) * 7 - dayOffset);
                endDate = new Date(startDate);
                endDate.setDate(startDate.getDate() + 6);
                endDate.setHours(23, 59, 59, 999);
                query = __assign({ startTime: { $gte: startDate, $lte: endDate } }, (((_b = req.user) === null || _b === void 0 ? void 0 : _b.isAdmin) ? {} : { status: 'approved' }));
                return [4 /*yield*/, Session_1.default.find(query).populate('user', 'name email')];
            case 1:
                sessions = _c.sent();
                res.status(200).json({
                    success: true,
                    count: sessions.length,
                    sessions: sessions
                });
                return [3 /*break*/, 3];
            case 2:
                error_7 = _c.sent();
                res.status(400).json({ message: error_7.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getCalendarWeek = getCalendarWeek;
var getCalendarDay = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, year, month, day, startDate, endDate, query, sessions, error_8;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                _a = req.params, year = _a.year, month = _a.month, day = _a.day;
                startDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                endDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), 23, 59, 59);
                query = __assign({ startTime: { $gte: startDate, $lte: endDate } }, (((_b = req.user) === null || _b === void 0 ? void 0 : _b.isAdmin) ? {} : { status: 'approved' }));
                return [4 /*yield*/, Session_1.default.find(query).populate('user', 'name email')];
            case 1:
                sessions = _c.sent();
                res.status(200).json({
                    success: true,
                    count: sessions.length,
                    sessions: sessions
                });
                return [3 /*break*/, 3];
            case 2:
                error_8 = _c.sent();
                res.status(400).json({ message: error_8.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getCalendarDay = getCalendarDay;
