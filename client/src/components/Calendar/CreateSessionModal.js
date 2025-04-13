"use strict";
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
// client/src/components/Calendar/CreateSessionModal.tsx
var react_1 = require("react");
var moment_1 = require("moment");
var SessionContext_1 = require("../../context/SessionContext");
var CreateSessionModal = function (_a) {
    var show = _a.show, onClose = _a.onClose, startTime = _a.startTime, endTime = _a.endTime;
    var _b = (0, SessionContext_1.useSession)(), createSession = _b.createSession, error = _b.error, clearSessionErrors = _b.clearSessionErrors;
    var _c = (0, react_1.useState)(''), title = _c[0], setTitle = _c[1];
    var _d = (0, react_1.useState)(''), description = _d[0], setDescription = _d[1];
    var _e = (0, react_1.useState)((0, moment_1.default)(startTime).format('YYYY-MM-DDTHH:mm')), start = _e[0], setStart = _e[1];
    var _f = (0, react_1.useState)((0, moment_1.default)(endTime).format('YYYY-MM-DDTHH:mm')), end = _f[0], setEnd = _f[1];
    var _g = (0, react_1.useState)(false), isSubmitting = _g[0], setIsSubmitting = _g[1];
    var _h = (0, react_1.useState)(''), validationError = _h[0], setValidationError = _h[1];
    // Clear errors when modal closes
    (0, react_1.useEffect)(function () {
        if (!show) {
            clearSessionErrors();
            setValidationError('');
        }
    }, [show, clearSessionErrors]);
    // Reset form when modal opens
    (0, react_1.useEffect)(function () {
        if (show) {
            setTitle('');
            setDescription('');
            setStart((0, moment_1.default)(startTime).format('YYYY-MM-DDTHH:mm'));
            setEnd((0, moment_1.default)(endTime).format('YYYY-MM-DDTHH:mm'));
            setIsSubmitting(false);
            setValidationError('');
        }
    }, [show, startTime, endTime]);
    if (!show) {
        return null;
    }
    var validateForm = function () {
        if (!title.trim()) {
            setValidationError('Title is required');
            return false;
        }
        var startDate = new Date(start);
        var endDate = new Date(end);
        if (endDate <= startDate) {
            setValidationError('End time must be after start time');
            return false;
        }
        // Validate current/next month restriction
        var now = new Date();
        var startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        var endOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 2, 0, 23, 59, 59);
        if (startDate < startOfCurrentMonth || startDate > endOfNextMonth) {
            setValidationError('Sessions can only be scheduled for the current or next month');
            return false;
        }
        setValidationError('');
        return true;
    };
    var handleSubmit = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    if (!validateForm()) {
                        return [2 /*return*/];
                    }
                    setIsSubmitting(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, createSession({
                            title: title,
                            description: description,
                            startTime: new Date(start),
                            endTime: new Date(end)
                        })];
                case 2:
                    _a.sent();
                    onClose();
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    setIsSubmitting(false);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    return (<div className="modal show d-block">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="fas fa-calendar-plus me-2 text-primary"></i>
              Schedule New Session
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {(error || validationError) && (<div className="alert alert-danger">
                {validationError || error}
              </div>)}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="title" className="form-label">Title<span className="text-danger">*</span></label>
                <input type="text" className="form-control" id="title" value={title} onChange={function (e) { return setTitle(e.target.value); }} placeholder="e.g., Team Meeting" required/>
              </div>
              
              <div className="mb-3">
                <label htmlFor="description" className="form-label">Description</label>
                <textarea className="form-control" id="description" value={description} onChange={function (e) { return setDescription(e.target.value); }} rows={3} placeholder="Add details about this session"></textarea>
              </div>
              
              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="startTime" className="form-label">Start Time<span className="text-danger">*</span></label>
                  <input type="datetime-local" className="form-control" id="startTime" value={start} onChange={function (e) { return setStart(e.target.value); }} required/>
                </div>
                <div className="col-md-6">
                  <label htmlFor="endTime" className="form-label">End Time<span className="text-danger">*</span></label>
                  <input type="datetime-local" className="form-control" id="endTime" value={end} onChange={function (e) { return setEnd(e.target.value); }} required/>
                </div>
              </div>
              
              <div className="alert alert-info d-flex align-items-center">
                <i className="fas fa-info-circle me-2"></i>
                <div>
                  Sessions require admin approval before they are confirmed.
                </div>
              </div>
              
              <div className="modal-footer px-0 pb-0">
                <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? (<>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Submitting...
                    </>) : (<>Request Session</>)}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>);
};
exports.default = CreateSessionModal;
