"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const formDataControllers_1 = require("../controllers/formDataControllers");
const router = express_1.default.Router();
router.post('/createFormData/', formDataControllers_1.formData);
router.get('/allComplaints', formDataControllers_1.allComplaints);
router.post('/warningBot', formDataControllers_1.warningBot);
router.post('/suspensionBot', formDataControllers_1.suspensionBot);
exports.default = router;
