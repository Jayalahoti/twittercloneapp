const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username:{
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profileimg: {
        type: String,
        default: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHkAAAB5CAMAAAAqJH57AAAAIVBMVEX////d3d3c3Nzm5ubr6+v39/fh4eH7+/vy8vLv7+/Z2dnv+464AAAElElEQVRogcWbWXbkIAxFY8y8/wU34NkG60mGLp185CRVXKMJCfDfH1+c8UHPm+jgjROMwhTjtVU1sdqbYVTn52lSaqpL/sfsB0w+Y2OLutNjd7gBsAe8n9q9BbEb3Po+3CkysIvE6TvbT5zp9mMbK+NmUfaDvXUzhiC00j+Y8Kdp66/cwuZP232e8Iq2zMxihC5dQU8sjQd+CLclBhyse4ITGjZ2F986C+pnc29wQs8/AmPo7qpe0aTCB4FpdNdwusp7cJlx4IR+SSluIDdLO5F2ytUtUbZp5LHghG6Y2owGJ3Td1IN1XchVfQ+L5Au6EtWODVaSKk09/Zuja6WistbOs7Wp92Dxn/rG3Sv1LzbsfatLDZflwB9Ohk459avPns1oXGP3SXssbSrVatcCXLjFa/OBPfNr/RxAnV8nja0URCnnLKa4y8qB1CGqEhA3wSrHc32CxHI73Z/EY0Y7pgCkLwgMok+JzPYCg+h9MDqLMLojZKndswntX43VrSqAt+4+Riqb0xlBuWFVN6ls2MjgeLsOSc+OzBYYsN7i3ZSysaboJEB6KFokS106d90FyA95TEOBeVYuk6GzaDY0FYBKsKVGunepf0l/4IPpdFJ8h3Awtn9loX0sm5BSNiuLbEKBJ0U/HidxHkKaMAUMmXFEe/S0oQ25rPFjKgu5WKaIoZ5ORqbXgkCRBXkkC50YA5XpREHVhzxqzprM7kI7/4xM+zZNlqTtTmRRJiFHTeQRiyS2TJJk0dEPXYkF2iISFwN6Bw+0IwJD04VYIiMZli0Ud1l86TqRDQbaulQZAM7A9m6ktfqD2iAmGNj7KMsB7Q28hg5px5dYRYzCcm+og84WJJcV5iINjDctPQYQAqzIwrbWykehLSnYv6GDtlWJ2FYSWHZjJ3zrRLATG6zin8Fjp9VlgSiYHjulH2Z8rELgmQ15jAzfENgdFj1IIK5K4BvNR37At9V1M6cw7oCcKmlwXz1/aaqzDedE4ewx8JfKtv7d1ZzmXaY6r0CssyqlotXLGYozXsNXx/bvnz0V2My501UsIji0um7sDblcUJfb8sOetFzue5lIAYMIPcp9xX3NJnnAfBgIiLUvNzPLWI+IbLp3Gmfm3GJN/j6/XAutpOAWV3SJ0swtduXDtWVafqGucZWvXmE8nSzKNkn2AR8B0yrobus0805ZRR7321rd4bXFEu4KXeWqx3Zdcy4RPlj4LOeQeatgj0eUbfFW5JjNuxK3j3Ebmjf05mfPHHKWNZV1BO9oqkUqXtbJxpsUW9NVc0ooXbz6LMl9kCbFqwFkrDvqjkbBBS3b7ayLhcHZw5Vs07E2FnI14vrxPoEV2JOY+xhbMkx+2K8vGHiZ6nLDMn+xtksTFr4lkKsKubXDl4omT1v4Pom34gkvEpToXZb8vszn4NBRRabOQ+rx8Hvqb+zcvj1a15b4OXd5vRa7kJU3AfBS40fbc3UvL1gleGg2G86Egu35etU68jIflfqrhHfHA6TfE9SW1+vGvM+W4dpOCZ5+UoO3y/4nPQa70U2ovD247V78B3HGeB9C8N5Ikf8AI24tCtvQTwMAAAAASUVORK5CYII="
    },
    location : {
        type: String,
    },
    dob: {
        type: Date
    },
    followers: [
        {
            type: ObjectId,
            ref: "UserModel",
        }
    ],
    following: [
        {
            type: ObjectId,
            ref: "UserModel",
        }
    ],
}, {
    timestamps: true
}
);

mongoose.model("UserModel", userSchema);