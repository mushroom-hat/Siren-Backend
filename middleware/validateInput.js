// 3 to 20 characters, including letters (both uppercase and lowercase), numbers, and underscores
const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;

// at least 8 characters, including at least one symbol, one uppercase and lowercase letter and one number (@$!%*?&)
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// valid email format
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateUsername = (username) => {
    return usernameRegex.test(username);
}
const validatePassword = (password) => {
    return passwordRegex.test(password);
}

const validateEmail = (email) => {
    return emailRegex.test(email);
}

module.exports = {
    validateUsername,
    validatePassword,
    validateEmail
}
