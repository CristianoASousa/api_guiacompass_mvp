const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
    {
        product: { type: String, required: true },
        manufacturer: { type: String, required: true },
        preview: { type: String },
        colors: [
            {
                name: { type: String },
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

ProductSchema.post('save', async function (product) {
    let slug = product.slug + "-" + product._id
    await Product.updateOne({ _id: product._id }, { slug: slug })
})

const Product = mongoose.model('products', ProductSchema);

module.exports = Product;