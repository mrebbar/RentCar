const bcrypt = require('bcryptjs');

async function hashing(password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);
    return hashedPassword;
}

hashing('12345678');