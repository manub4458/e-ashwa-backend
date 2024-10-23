import {Schema, model } from "mongoose";

const productSchema = new Schema({
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

const Product = model('Product', productSchema);

export default Product;
