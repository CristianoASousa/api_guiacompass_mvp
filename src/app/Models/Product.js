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
// padronizando as tags, todas em maiúsculo 
function generateTags(text){
    const separators = /[s,.;:()'+]/g;
    text = text.toUpperCase().normalize("NFD").replace(separators, "");
    //separando e removendo repetidos
    const arr = text.split(' ').filter((item, pos, self) => self.indexOf(item) == pos);
    //removendo nulls, undefineds e strings vazias
    return arr.filter(item => (item));
}

ProductSchema.pre('save', function(next) {
    this.tags = this.tags.map(tag => tag.toUpperCase())
    this.tags = [...this.tags, ...generateTags(this.product)]
    next()
})

ProductSchema.post('save', async function (product) {
    let slug = product.slug + "-" + product._id
    await Product.updateOne({ _id: product._id }, { slug: slug })
})

ProductSchema.post('insertMany', function (product) {
    product.forEach( async prod => {
        let slug = prod.slug + "-" + prod._id
        let tags = prod.tags.map(tag => tag.toUpperCase())
        tags = [...tags, ...generateTags(prod.product)]
        await Product.updateOne({ _id: prod._id }, { slug , tags})
    });
})

const Product = mongoose.model('products', ProductSchema);

module.exports = Product;