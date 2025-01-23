const patientsRouter = require('./patients.route')
const adminRouter = require('./admin.route')
const doctorsRouter = require('./doctors.route')
const userRouter = require('./user.route')
const express = require('express')

const router = express()

router.use('/patient', patientsRouter)
router.use('/admin', adminRouter)
router.use('/doctor', doctorsRouter)
router.use("/user", userRouter)

module.exports= router;