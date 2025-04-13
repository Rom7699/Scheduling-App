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
exports.useAuth = exports.AuthProvider = void 0;
// client/src/context/AuthContext.tsx
var react_1 = require("react");
var axios_1 = require("axios");
// Initial state
var initialState = {
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: false,
    loading: true,
    error: null
};
// Create context
var AuthContext = (0, react_1.createContext)(__assign(__assign({}, initialState), { login: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/];
    }); }); }, register: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/];
    }); }); }, logout: function () { }, clearErrors: function () { } }));
// Reducer
var authReducer = function (state, action) {
    switch (action.type) {
        case 'USER_LOADED':
            return __assign(__assign({}, state), { isAuthenticated: true, loading: false, user: action.payload });
        case 'REGISTER_SUCCESS':
        case 'LOGIN_SUCCESS':
            localStorage.setItem('token', action.payload.token);
            return __assign(__assign(__assign({}, state), action.payload), { isAuthenticated: true, loading: false });
        case 'AUTH_ERROR':
        case 'LOGIN_FAIL':
        case 'REGISTER_FAIL':
        case 'LOGOUT':
            localStorage.removeItem('token');
            return __assign(__assign({}, state), { token: null, isAuthenticated: false, loading: false, user: null, error: action.payload || null });
        case 'CLEAR_ERRORS':
            return __assign(__assign({}, state), { error: null });
        default:
            return state;
    }
};
// Provider component
var AuthProvider = function (_a) {
    var children = _a.children;
    var _b = (0, react_1.useReducer)(authReducer, initialState), state = _b[0], dispatch = _b[1];
    // Load user - using useCallback to avoid infinite loops
    var loadUser = (0, react_1.useCallback)(function () { return __awaiter(void 0, void 0, void 0, function () {
        var res, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (localStorage.token) {
                        axios_1.default.defaults.headers.common['Authorization'] = "Bearer ".concat(localStorage.token);
                    }
                    else {
                        delete axios_1.default.defaults.headers.common['Authorization'];
                        dispatch({ type: 'AUTH_ERROR' });
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios_1.default.get('/api/auth/me')];
                case 2:
                    res = _a.sent();
                    dispatch({
                        type: 'USER_LOADED',
                        payload: res.data.user
                    });
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    dispatch({ type: 'AUTH_ERROR' });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); }, []);
    (0, react_1.useEffect)(function () {
        var loadUser = function () { return __awaiter(void 0, void 0, void 0, function () {
            var res, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!localStorage.token) return [3 /*break*/, 5];
                        axios_1.default.defaults.headers.common['Authorization'] = "Bearer ".concat(localStorage.token);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, axios_1.default.get('/api/auth/me')];
                    case 2:
                        res = _a.sent();
                        dispatch({
                            type: 'USER_LOADED',
                            payload: res.data.user
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        err_2 = _a.sent();
                        dispatch({ type: 'AUTH_ERROR' });
                        return [3 /*break*/, 4];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        delete axios_1.default.defaults.headers.common['Authorization'];
                        dispatch({ type: 'AUTH_ERROR' });
                        _a.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        }); };
        loadUser();
    }, []); // Empty dependency array is correct here
    // Register user
    var register = function (name, email, password) { return __awaiter(void 0, void 0, void 0, function () {
        var res, err_3;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios_1.default.post('/api/auth/register', { name: name, email: email, password: password })];
                case 1:
                    res = _c.sent();
                    dispatch({
                        type: 'REGISTER_SUCCESS',
                        payload: res.data
                    });
                    return [3 /*break*/, 3];
                case 2:
                    err_3 = _c.sent();
                    dispatch({
                        type: 'REGISTER_FAIL',
                        payload: ((_b = (_a = err_3.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || 'Registration failed'
                    });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    // Login user
    var login = function (email, password) { return __awaiter(void 0, void 0, void 0, function () {
        var res, err_4;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios_1.default.post('/api/auth/login', { email: email, password: password })];
                case 1:
                    res = _c.sent();
                    dispatch({
                        type: 'LOGIN_SUCCESS',
                        payload: res.data
                    });
                    return [3 /*break*/, 3];
                case 2:
                    err_4 = _c.sent();
                    dispatch({
                        type: 'LOGIN_FAIL',
                        payload: ((_b = (_a = err_4.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || 'Login failed'
                    });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    // Logout
    var logout = function () {
        dispatch({ type: 'LOGOUT' });
    };
    // Clear errors
    var clearErrors = function () {
        dispatch({ type: 'CLEAR_ERRORS' });
    };
    return (<AuthContext.Provider value={{
            user: state.user,
            token: state.token,
            isAuthenticated: state.isAuthenticated,
            loading: state.loading,
            error: state.error,
            register: register,
            login: login,
            logout: logout,
            clearErrors: clearErrors
        }}>
      {children}
    </AuthContext.Provider>);
};
exports.AuthProvider = AuthProvider;
// Custom hook
var useAuth = function () { return (0, react_1.useContext)(AuthContext); };
exports.useAuth = useAuth;
