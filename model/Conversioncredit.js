import mongoose from 'mongoose';
import { Schema } from 'mongoose';

const ConversioncreditSchema = new Schema({
    credit: Number,
    prix: Number,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Méthode statique pour calculer le crédit
ConversioncreditSchema.statics.calculateCredit = function(price) {
    const conversionRate = 50; 
    return (price / conversionRate) * 2; 
};

const Conversioncredit = mongoose.model('Conversioncredit', ConversioncreditSchema);

export default Conversioncredit;
