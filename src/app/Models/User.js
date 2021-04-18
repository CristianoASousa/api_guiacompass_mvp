const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        lastname: { type: String },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
            select: false
        },
        permission: {
            type: Number,
            required: true
        },
        company: {
            id: {
                type: mongoose.Types.ObjectId,
                required: true
            },
            name: {
                type: String,
                required: true
            }
        },
        attendance: [
            {
                month: {
                    type: Number
                },
                totalAttendance: {
                    type: Number
                }
            }
        ]

    },
    {
        timestamps: true
    }
);

UserSchema.pre('save', async function (next) {
    const password = await bcrypt.hash(this.password, 8)
    this.password = password
    next()
});

const User = mongoose.model('users', UserSchema);

module.exports = User