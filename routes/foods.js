var express = require('express');
var pool = require('./pool')
var upload = require('./multer')
var router = express.Router();


var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');

///////this is ur actionName..\\\\\\\

/* GET use to show Indian food . */ 
router.get('/indianfoods', function (req, res, next) {
  try{
  var admin=localStorage.getItem('ADMIN')

  console.log(admin)
  if(admin)
  { res.render('indianfoods', { status: -1, message: '' }); }
  else{ 
    res.render('login',{message:''}) }
  
  }
  catch(e)
  {
    res.render('login', { message: '' });
  }
});
router.get('/displaypicture', function (req, res, next) {
  res.render('displaypicture', { data:req.query });
});

router.get('/fetch_all_foods', function (req, res) {
  pool.query("SELECT * FROM foods", function (error, result) {
    if (error) {
      console.log(error)
      res.status(500).json([])
    }
    else {
      res.status(200).json(result)
    }
  })


})
/* this api fetch all foods */
router.get('/fetch_all_fooditem', function (req, res) {
  pool.query("select * from fooditem where foodid=?", [req.query.foodid], function (error, result) {
    console.log(req.body)
    if (error) {
      console.log(error)
      res.status(500).json([])
    }
    else {
      res.status(200).json(result)
    }

  })


})
/* this api submit all data */
router.post('/submit_food_details', upload.single('picture'), function (req, res) {
  console.log("BODY:", req.body)
  console.log("FILE:", req.file)

  pool.query("insert into fooddetails (foodname, fooditemid,qty ,price, offer, status, statusv, picture) values(?,?,?,?,?,?,?,?)",
    [req.body.type, req.body.fooditem, req.body.qty, req.body.price, req.body.offer, req.body.status, req.body.statusv, req.file.originalname], function (error, result) {
      if (error) {
        console.log(error)
        res.render('indianfoods', { status: 0, message: 'server Error...' })
      }
      else {
        res.render('indianfoods', { status: 1, message: 'Record Submitted Succesfully...' })
      }

    })
})
/* this api display all foodData */
router.get('/display_all_foods', function (req, res) {
  pool.query("select FD.*, (select F.foodname from foods F where F.foodid=FD.foodname) as foodname, (select FI.fooditemname from fooditem FI where FI.fooditemid=FD.fooditemid) as fooditem from fooddetails FD ", function (error, result) {

    if (error) {
      //console.log(error)
      res.render('displayallfoods', { data: [] })
    }
    else {
      // console.log(result)
      res.render('displayallfoods', { data: result })
    }
  })
})

router.get('/displaybyid', function (req, res) {
  console.log(req.query)
  pool.query("select FD.*, (select F.foodname from foods F where F.foodid=FD.foodname) as foodname, (select FT.fooditemname from fooditem FT where FT.fooditemid=FD.fooditemid) as foodtype from fooddetails FD where FD.foodid=?",
   [req.query.foodid], function (error, result) {
    if (error) {
      console.log(error)
      res.render('displaybyid', { data: [] })
    }
    else {
      // console.log(result)
      res.render('displaybyid', { data: result[0] })
    }

  })
})


router.post('/edit_food_details', function (req, res) {
  console.log(req.body)
  if (req.body.btn == 'edit') {
    pool.query("update fooddetails set foodname=?, fooditemid=?, price=?, offer=?, status=?, statusv=? where foodid=?",
    [req.body.type,req.body.fooditem,req.body.price,req.body.offer,req.body.status,req.body.statusv,req.body.foodid],function(error, result){
      if (error){
        console.log(error)
        res.redirect('/foods/display_all_foods')
      }
      else {
        res.redirect('/foods/display_all_foods')
      }
    })
  }
  else {
    pool.query("delete from fooddetails where foodid=?",[req.body.foodid],function (error, result) {
      console.log(req.body)
      if (error) {
        console.log(error)
        res.redirect('/foods/display_all_foods')
      }
      else {
        res.redirect('/foods/display_all_foods')
      }
    })
  }
})

   /* This api use to edit picture*/
   router.post('/edit_picture', upload.single('picture'), function (req, res) {
   
    pool.query("update fooddetails set picture=? where foodid=?",
      [req.file.originalname,req.body.foodid], function (error, result) {
        if (error) {
          console.log(error)
          res.redirect('/foods/display_all_foods')
        }
        else {
          res.redirect('/foods/display_all_foods')
           
        }
  
      })
  })


module.exports = router;
