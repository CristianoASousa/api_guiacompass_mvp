const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema(
    {
        corporateName: { type: String, required: true },
        tradeName: { type: String, required: true },
        cnpj: { type: String, required: true },
        logo: { type: String },
        banner: { type: String },
        contact: {
            socialMedia: {
                facebook: { type: String },
                instagram: { type: String }
            },
            whatsapp: { type: String },
            landline: { type: String },
            email: { type: String,  unique: true }
        },
        address: {
            street: { type: String },
            number: { type: String },
            city: { type: String },
            state: { type: String }
        },
        employees: [
            {
                id: { type: mongoose.Types.ObjectId },
                name: { type: String },
                permission: { type: Number }
            }
        ]
    },
    {
        timestamps: true
    }
);

const Company = mongoose.model('company', CompanySchema);

module.exports = Company;