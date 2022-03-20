const { AuthenticationError } = require('apollo-server-express')
const isLoggedIn = (parent, args, { user }, info) => {
    if (!user){
        throw new AuthenticationError('يجب تسجيل دخولك!')
    }
}
module.exports = { isLoggedIn }