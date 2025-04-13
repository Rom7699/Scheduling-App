"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var sessionController_1 = require("../controllers/sessionController");
var auth_1 = require("../middleware/auth");
var router = express_1.default.Router();
// Session routes
router.post('/', auth_1.auth, sessionController_1.createSession);
router.get('/', auth_1.auth, sessionController_1.getSessions);
router.get('/:id', auth_1.auth, sessionController_1.getSessionById);
router.put('/:id/status', auth_1.auth, auth_1.adminOnly, sessionController_1.updateSessionStatus);
router.delete('/:id', auth_1.auth, sessionController_1.cancelSession);
// Calendar routes
router.get('/calendar/month/:year/:month', auth_1.auth, sessionController_1.getCalendarMonth);
router.get('/calendar/week/:year/:week', auth_1.auth, sessionController_1.getCalendarWeek);
router.get('/calendar/day/:year/:month/:day', auth_1.auth, sessionController_1.getCalendarDay);
exports.default = router;
