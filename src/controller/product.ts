import { Request, Response, NextFunction, RequestHandler } from "express";
import Product from "../model/product";

interface ProductItems {
    item: string;
    currentStock: number;
    soldStock: number;
}

const getStockByItem = async (itemName: string, req: Request, res: Response, next: NextFunction) => {
    try {
        const stock = await Product.findOne({ item: itemName });
        if (!stock) return res.status(404).json({ message: `${itemName} not found` });
        
        res.json({
            currentStock: stock.currentStock,
            soldStock: stock.soldStock,
            remainingStock: stock.currentStock - stock.soldStock
        });
    } catch (error) {
        next(error); 
    }
};

export const addProduct = async (req: Request<{}, {}, { item: ProductItems[] }>, res: Response, next: NextFunction) => {
    const items = req.body.item; 

    try {
        const savedStocks = await Promise.all(items.map(async (item) => {
            const stock = new Product(item);
            return await stock.save();
        }));
        
        res.status(201).json(savedStocks);
    } catch (error) { 
        res.status(500).json({
            message: "Something went wrong"
          })
    }
};

export const getLeadAcidBatteryStock = (req: Request, res: Response, next: NextFunction) => {
    getStockByItem('Lead Acid Battery', req, res, next);
};

export const getLeadAcidChargerStock = (req: Request, res: Response, next: NextFunction) => {
    getStockByItem('Lead Acid Charger', req, res, next);
};

export const getLithiumIonBatteryStock = (req: Request, res: Response, next: NextFunction) => {
    getStockByItem('Lithium-ion Battery', req, res, next);
};

export const getLithiumIonChargerStock = (req: Request, res: Response, next: NextFunction) => {
    getStockByItem('Lithium-ion Charger', req, res, next);
};