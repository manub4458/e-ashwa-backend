"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const productSchema = new mongoose_1.Schema({
    item: {
        type: String,
        required: true,
        enum: [
            'Lead Acid Battery',
            'Lead Acid Charger',
            'Lithium-ion Battery',
            'Lithium-ion Charger',
        ],
    },
    currentStock: {
        type: Number,
        required: true,
        default: 0,
    },
    soldStock: {
        type: Number,
        required: true,
        default: 0,
    },
});
const Product = (0, mongoose_1.model)('Product', productSchema);
exports.default = Product;
