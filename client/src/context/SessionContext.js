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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSession = exports.SessionProvider = void 0;
// client/src/context/SessionContext.tsx
var react_1 = require("react");
var axios_1 = require("axios");
var AuthContext_1 = require("./AuthContext");
// Initial state
var initialState = {
    sessions: [],
    currentSession: null,
    loading: false,
    error: null
};
// Create context
var SessionContext = (0, react_1.createContext)(__assign(__assign({}, initialState), { getSessions: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/];
    }); }); }, getSessionById: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/];
    }); }); }, createSession: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/];
    }); }); }, updateSessionStatus: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/];
    }); }); }, cancelSession: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/];
    }); }); }, getCalendarMonth: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/];
    }); }); }, getCalendarWeek: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/];
    }); }); }, getCalendarDay: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/];
    }); }); }, clearSessionErrors: function () { } }));
// Reducer
var sessionReducer = function (state, action) {
    var _a;
    switch (action.type) {
        case 'GET_SESSIONS':
            return __assign(__assign({}, state), { sessions: action.payload, loading: false });
        case 'GET_SESSION':
            return __assign(__assign({}, state), { currentSession: action.payload, loading: false });
        case 'CREATE_SESSION':
            return __assign(__assign({}, state), { sessions: __spreadArray(__spreadArray([], state.sessions, true), [action.payload], false), loading: false });
        case 'UPDATE_SESSION':
        case 'CANCEL_SESSION':
            return __assign(__assign({}, state), { sessions: state.sessions.map(function (session) {
                    return session._id === action.payload._id ? action.payload : session;
                }), currentSession: ((_a = state.currentSession) === null || _a === void 0 ? void 0 : _a._id) === action.payload._id
                    ? action.payload
                    : state.currentSession, loading: false });
        case 'SESSION_ERROR':
            return __assign(__assign({}, state), { error: action.payload, loading: false });
        case 'SET_LOADING':
            return __assign(__assign({}, state), { loading: true });
        case 'CLEAR_ERRORS':
            return __assign(__assign({}, state), { error: null });
        default:
            return state;
    }
};
// Provider component
var SessionProvider = function (_a) {
    var children = _a.children;
    var _b = (0, react_1.useReducer)(sessionReducer, initialState), state = _b[0], dispatch = _b[1];
    var token = (0, AuthContext_1.useAuth)().token;
    // Set auth token for requests - memoize to prevent unnecessary re-renders
    var setAuthToken = (0, react_1.useCallback)(function () {
        if (token) {
            axios_1.default.defaults.headers.common['Authorization'] = "Bearer ".concat(token);
        }
        else {
            delete axios_1.default.defaults.headers.common['Authorization'];
        }
    }, [token]);
    // Get all sessions
    var getSessions = function () { return __awaiter(void 0, void 0, void 0, function () {
        var res, sessions, err_1;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    setAuthToken();
                    dispatch({ type: 'SET_LOADING' });
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios_1.default.get('/api/sessions')];
                case 2:
                    res = _c.sent();
                    sessions = res.data.sessions.map(function (session) { return (__assign(__assign({}, session), { startTime: new Date(session.startTime), endTime: new Date(session.endTime), createdAt: new Date(session.createdAt) })); });
                    dispatch({
                        type: 'GET_SESSIONS',
                        payload: sessions
                    });
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _c.sent();
                    dispatch({
                        type: 'SESSION_ERROR',
                        payload: ((_b = (_a = err_1.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || 'Error fetching sessions'
                    });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    // Other methods remain the same...
    var getSessionById = function (id) { return __awaiter(void 0, void 0, void 0, function () {
        var res, session, err_2;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    setAuthToken();
                    dispatch({ type: 'SET_LOADING' });
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios_1.default.get("/api/sessions/".concat(id))];
                case 2:
                    res = _c.sent();
                    session = __assign(__assign({}, res.data.session), { startTime: new Date(res.data.session.startTime), endTime: new Date(res.data.session.endTime), createdAt: new Date(res.data.session.createdAt) });
                    dispatch({
                        type: 'GET_SESSION',
                        payload: session
                    });
                    return [3 /*break*/, 4];
                case 3:
                    err_2 = _c.sent();
                    dispatch({
                        type: 'SESSION_ERROR',
                        payload: ((_b = (_a = err_2.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || 'Error fetching session'
                    });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    // Create new session
    var createSession = function (sessionData) { return __awaiter(void 0, void 0, void 0, function () {
        var res, session, err_3;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    setAuthToken();
                    dispatch({ type: 'SET_LOADING' });
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios_1.default.post('/api/sessions', sessionData)];
                case 2:
                    res = _c.sent();
                    session = __assign(__assign({}, res.data.session), { startTime: new Date(res.data.session.startTime), endTime: new Date(res.data.session.endTime), createdAt: new Date(res.data.session.createdAt) });
                    dispatch({
                        type: 'CREATE_SESSION',
                        payload: session
                    });
                    return [3 /*break*/, 4];
                case 3:
                    err_3 = _c.sent();
                    dispatch({
                        type: 'SESSION_ERROR',
                        payload: ((_b = (_a = err_3.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || 'Error creating session'
                    });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    // Update session status (admin only)
    var updateSessionStatus = function (id, status) { return __awaiter(void 0, void 0, void 0, function () {
        var res, session, err_4;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    setAuthToken();
                    dispatch({ type: 'SET_LOADING' });
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios_1.default.put("/api/sessions/".concat(id, "/status"), { status: status })];
                case 2:
                    res = _c.sent();
                    session = __assign(__assign({}, res.data.session), { startTime: new Date(res.data.session.startTime), endTime: new Date(res.data.session.endTime), createdAt: new Date(res.data.session.createdAt) });
                    dispatch({
                        type: 'UPDATE_SESSION',
                        payload: session
                    });
                    return [3 /*break*/, 4];
                case 3:
                    err_4 = _c.sent();
                    dispatch({
                        type: 'SESSION_ERROR',
                        payload: ((_b = (_a = err_4.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || 'Error updating session status'
                    });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    // Cancel session
    var cancelSession = function (id) { return __awaiter(void 0, void 0, void 0, function () {
        var res, session, err_5;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    setAuthToken();
                    dispatch({ type: 'SET_LOADING' });
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios_1.default.delete("/api/sessions/".concat(id))];
                case 2:
                    res = _c.sent();
                    session = __assign(__assign({}, res.data.session), { startTime: new Date(res.data.session.startTime), endTime: new Date(res.data.session.endTime), createdAt: new Date(res.data.session.createdAt) });
                    dispatch({
                        type: 'CANCEL_SESSION',
                        payload: session
                    });
                    return [3 /*break*/, 4];
                case 3:
                    err_5 = _c.sent();
                    dispatch({
                        type: 'SESSION_ERROR',
                        payload: ((_b = (_a = err_5.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || 'Error cancelling session'
                    });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    // Get sessions for a specific month
    var getCalendarMonth = function (year, month) { return __awaiter(void 0, void 0, void 0, function () {
        var res, sessions, err_6;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    setAuthToken();
                    dispatch({ type: 'SET_LOADING' });
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios_1.default.get("/api/sessions/calendar/month/".concat(year, "/").concat(month))];
                case 2:
                    res = _c.sent();
                    sessions = res.data.sessions.map(function (session) { return (__assign(__assign({}, session), { startTime: new Date(session.startTime), endTime: new Date(session.endTime), createdAt: new Date(session.createdAt) })); });
                    dispatch({
                        type: 'GET_SESSIONS',
                        payload: sessions
                    });
                    return [3 /*break*/, 4];
                case 3:
                    err_6 = _c.sent();
                    dispatch({
                        type: 'SESSION_ERROR',
                        payload: ((_b = (_a = err_6.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || 'Error fetching calendar data'
                    });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    // Get sessions for a specific week
    var getCalendarWeek = function (year, week) { return __awaiter(void 0, void 0, void 0, function () {
        var res, sessions, err_7;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    setAuthToken();
                    dispatch({ type: 'SET_LOADING' });
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios_1.default.get("/api/sessions/calendar/week/".concat(year, "/").concat(week))];
                case 2:
                    res = _c.sent();
                    sessions = res.data.sessions.map(function (session) { return (__assign(__assign({}, session), { startTime: new Date(session.startTime), endTime: new Date(session.endTime), createdAt: new Date(session.createdAt) })); });
                    dispatch({
                        type: 'GET_SESSIONS',
                        payload: sessions
                    });
                    return [3 /*break*/, 4];
                case 3:
                    err_7 = _c.sent();
                    dispatch({
                        type: 'SESSION_ERROR',
                        payload: ((_b = (_a = err_7.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || 'Error fetching calendar data'
                    });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    // Get sessions for a specific day
    var getCalendarDay = function (year, month, day) { return __awaiter(void 0, void 0, void 0, function () {
        var res, sessions, err_8;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    setAuthToken();
                    dispatch({ type: 'SET_LOADING' });
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios_1.default.get("/api/sessions/calendar/day/".concat(year, "/").concat(month, "/").concat(day))];
                case 2:
                    res = _c.sent();
                    sessions = res.data.sessions.map(function (session) { return (__assign(__assign({}, session), { startTime: new Date(session.startTime), endTime: new Date(session.endTime), createdAt: new Date(session.createdAt) })); });
                    dispatch({
                        type: 'GET_SESSIONS',
                        payload: sessions
                    });
                    return [3 /*break*/, 4];
                case 3:
                    err_8 = _c.sent();
                    dispatch({
                        type: 'SESSION_ERROR',
                        payload: ((_b = (_a = err_8.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || 'Error fetching calendar data'
                    });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    // Clear errors
    var clearSessionErrors = function () {
        dispatch({ type: 'CLEAR_ERRORS' });
    };
    return (<SessionContext.Provider value={{
            sessions: state.sessions,
            currentSession: state.currentSession,
            loading: state.loading,
            error: state.error,
            getSessions: getSessions,
            getSessionById: getSessionById,
            createSession: createSession,
            updateSessionStatus: updateSessionStatus,
            cancelSession: cancelSession,
            getCalendarMonth: getCalendarMonth,
            getCalendarWeek: getCalendarWeek,
            getCalendarDay: getCalendarDay,
            clearSessionErrors: clearSessionErrors
        }}>
      {children}
    </SessionContext.Provider>);
};
exports.SessionProvider = SessionProvider;
// Custom hook
var useSession = function () { return (0, react_1.useContext)(SessionContext); };
exports.useSession = useSession;
