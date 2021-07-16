const express = require('express')
const Account = require('../../models/account')
const router = express.Router()

router.get('/', (req,res) => {
  const { email, password } = req.signedCookies
  
  if(email ==="" || password === "") {
    res.render('login')
  }
  Account.find({ email,password })
  .lean()
  .then((user) => {
    if(user.length ===1) {
      res.redirect(`show/${user._id}`)
    }else {
      res.render('login')
    }
  })
  .catch(error => console.error(error))  
})

router.get('/login', (req,res) => {
  return res.render('login')
})

router.post('/login', (req,res) => {
  const { email, password } = req.body
  return Account.findOne({email: req.body.email})
  .lean()
  .then(user =>{
    if(!user) {
      const alert = '該 E-mail尚未註冊'
      return res.render('login', {alert})
    }
    if (user.password !== req.body.password) {
      const alert ='您輸入的密碼有誤'
      return res.render('login', {alert})
    }
    res.cookie('email',email, {path:'/',signed: true, maxAge: 600000})
    res.cookie('password', password, {path:'/', signed: true, maxAge: 600000})
    return res.redirect(`/show/${user._id}`)
  })
})

router.get('/show/:id', (req, res) => {
  const id = req.params.id
  return Account.findById(id)
  .lean()
  .then(user => {
    res.render('show', {user})
  })
})


module.exports = router