var express = require('express');
var pool = require('./pool')

var router = express.Router();

var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');

router.get("/logout",function(req,res){
  localStorage.clear()
  res.render('login', { message: '' });

})

router.get("/loginpage",function(req,res){
  try{
    var admin=localStorage.getItem('ADMIN')
    console.log("ADDDMMMMIN",ADMIN)
    if(admin)
    {
    res.render('dashbord',{admin:JSON.parse(admin)}) }
    else{ 
       res.render('login', { message: '' }); }
    
    }
    catch(e)
    {
    res.render('login',{message:''})
    }

})
router.post("/chk_admin_login",function(req,res){
    console.log(req.body)
    pool.query("select * from food.admin where (emailid=? or mobileno=?) and password=?",
    [req.body.emailid,req.body.emailid,req.body.password],function(error,result){
      if(error)
      {
        console.log(error)
        res.render('login',{message:'server error...'})
      }
      else
      {
        if(result.length==0)
        {
            res.render('login',{message:'Invalid Emailid/Mobile Number/Password'})
        }
        else{
          console.log(result[0])
             localStorage.setItem('ADMIN',JSON.stringify(result[0]))
            res.render('dashbord',{admin:result[0]})
        }
      }
    })
   
})

module.exports=router;