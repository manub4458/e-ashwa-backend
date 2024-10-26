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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLithiumIonChargerStock = exports.getLithiumIonBatteryStock = exports.getLeadAcidChargerStock = exports.getLeadAcidBatteryStock = exports.addProduct = void 0;
const product_1 = __importDefault(require("../model/product"));
const getStockByItem = (itemName, req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const stock = yield product_1.default.findOne({ item: itemName });
        if (!stock)
            return res.status(404).json({ message: `${itemName} not found` });
        res.json({
            currentStock: stock.currentStock,
            soldStock: stock.soldStock,
            remainingStock: stock.currentStock - stock.soldStock
        });
    }
    catch (error) {
        next(error);
    }
});
const addProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const items = req.body.item;
    try {
        const savedStocks = yield Promise.all(items.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            const stock = new product_1.default(item);
            return yield stock.save();
        })));
        res.status(201).json(savedStocks);
    }
    catch (error) {
        res.status(500).json({
            message: "Something went wrong"
        });
    }
});
exports.addProduct = addProduct;
const getLeadAcidBatteryStock = (req, res, next) => {
    getStockByItem('Lead Acid Battery', req, res, next);
};
exports.getLeadAcidBatteryStock = getLeadAcidBatteryStock;
const getLeadAcidChargerStock = (req, res, next) => {
    getStockByItem('Lead Acid Charger', req, res, next);
};
exports.getLeadAcidChargerStock = getLeadAcidChargerStock;
const getLithiumIonBatteryStock = (req, res, next) => {
    getStockByItem('Lithium-ion Battery', req, res, next);
};
exports.getLithiumIonBatteryStock = getLithiumIonBatteryStock;
const getLithiumIonChargerStock = (req, res, next) => {
    getStockByItem('Lithium-ion Charger', req, res, next);
};
exports.getLithiumIonChargerStock = getLithiumIonChargerStock;
