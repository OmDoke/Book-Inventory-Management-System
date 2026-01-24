import mongoose from 'mongoose';

const BookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a title for this book.'],
        trim: true,
    },
    authorName: {
        type: String,
        required: [true, 'Please provide the author name.'],
        trim: true,
    },
    publishedDate: {
        type: Date,
    },
    publisher: {
        type: String,
        trim: true,
    },
    posterUrl: {
        type: String,
        validate: {
            validator: function (v) {
                // Simple URL validation
                return /^(http|https):\/\/[^ "]+$/.test(v);
            },
            message: props => `${props.value} is not a valid URL!`
        }
    },
    overview: {
        type: String,
        trim: true,
    },
    genre: {
        type: String,
        trim: true,
    },
    price: {
        type: Number,
        min: [0, 'Price must be positive'],
    },
    stockCount: {
        type: Number,
        min: [0, 'Stock count must be positive'],
        validate: {
            validator: Number.isInteger,
            message: '{VALUE} is not an integer value'
        },
        default: 0
    },
}, {
    timestamps: true,
});

export default mongoose.models.Book || mongoose.model('Book', BookSchema);
