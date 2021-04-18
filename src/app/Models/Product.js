const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
    {
        product: { type: String, required: true },
        manufacturer: { type: String, required: true },
        preview: { type: String },
        colors: [
            {
                name:{ type: String },
                preview: { type: String },
            }
        ],
        dimensions: [
            {
                height: { type: String },
                width: { type: String },
                depth: { type: String },
            }
        ],
        category: [String],
        tags: [String],
        description: { type: String },
        images: [String],
        video: { type: String },
        likes: { type: String },
        slug: { type: String },
        views: { type: Number },
    },
    {
        timestamps: true
    }
);

const Product = mongoose.model('product', ProductSchema);

module.exports = Product;