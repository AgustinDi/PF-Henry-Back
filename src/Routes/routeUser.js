const { Router } = require('express')
const { userLogin, userRegister, user, logout} = require('../Controllers/controllerUser')
//  Importar todos los routers;
// /Ejemplo: const authRouter = require('./auth.js');

const router = Router()

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
// router.get('/:userId', userId)
router.get('/', user)
router.post('/register', userRegister)
router.post('/login', userLogin)
// router.get('/logout', logout)

module.exports = router
