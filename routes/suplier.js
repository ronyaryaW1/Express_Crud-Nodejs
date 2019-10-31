var express = require('express');
var router = express.Router();

/* GET Customer page. */

router.get('/', function(req, res, next) {
	req.getConnection(function(err,connection){
		var query = connection.query('SELECT * FROM suplier',function(err,rows)
		{
			if(err)
				var errornya  = ("Error Selecting : %s ",err );   
			req.flash('msg_error', errornya);   
			res.render('suplier/list',{title:"Suplier",data:rows});
		});
     });
});
router.post('/add', function(req, res, next) {
	req.assert('nama', 'Please fill the nama').notEmpty();
	var errors = req.validationErrors();
	if (!errors) {
		v_kode = req.sanitize( 'kode' ).escape().trim(); 
		v_nama = req.sanitize( 'nama' ).escape().trim(); 
		v_alamat = req.sanitize( 'alamat' ).escape().trim();
		v_email = req.sanitize( 'email' ).escape().trim();
		v_phone = req.sanitize( 'phone' ).escape();

		var suplier = {
			kode: v_kode,
			nama: v_nama,
			alamat: v_alamat,
			email: v_email,
			phone : v_phone
		}

		var insert_sql = 'INSERT INTO suplier SET ?';
		req.getConnection(function(err,connection){
			var query = connection.query(insert_sql, suplier, function(err, result){
				if(err)
				{
					var errors_detail  = ("Error Insert : %s ",err );   
					req.flash('msg_error', errors_detail); 
					res.render('suplier/add-customer', 
					{ 
						kode: req.param('kode'), 
						nama: req.param('nama'), 
						alamat: req.param('alamat'),
						email: req.param('email'),
						phone: req.param('phone'),
					});
				}else{
					req.flash('msg_info', 'Create suplier success'); 
					res.redirect('/suplier');
				}		
			});
		});
	}else{
		console.log(errors);
		errors_detail = "Sory there are error<ul>";
		for (i in errors) 
		{ 
			error = errors[i]; 
			errors_detail += '<li>'+error.msg+'</li>'; 
		} 
		errors_detail += "</ul>"; 
		req.flash('msg_error', errors_detail); 
		res.render('suplier/add-customer', 
		{ 
			nama: req.param('nama'), 
			alamat: req.param('alamat')
		});
	}

});

router.get('/add', function(req, res, next) {
	res.render(	'suplier/add-customer', 
	{ 
		title: 'Add New Suplier',
		kode: '',
		nama: '',
		alamat: '',
		email: '',
		phone:''
	});
});
router.get('/edit/(:id)', function(req,res,next){
	req.getConnection(function(err,connection){
		var query = connection.query('SELECT * FROM suplier where id='+req.params.id,function(err,rows)
		{
			if(err)
			{
				var errornya  = ("Error Selecting : %s ",err );  
				req.flash('msg_error', errors_detail); 
				res.redirect('/suplier'); 
			}else
			{
				if(rows.length <=0)
				{
					req.flash('msg_error', "Suplier can't be find!"); 
					res.redirect('/suplier');
				}
				else
				{	
					console.log(rows);
					res.render('suplier/edit',{title:"Edit ",data:rows[0]});

				}
			}

		});
	});
});
router.put('/edit/(:id)', function(req,res,next){
	req.assert('nama', 'Please fill the nama').notEmpty();
	var errors = req.validationErrors();
	if (!errors) {
		v_kode = req.sanitize( 'kode' ).escape().trim(); 
		v_nama = req.sanitize( 'nama' ).escape().trim(); 
		v_alamat = req.sanitize( 'alamat' ).escape().trim();
		v_email = req.sanitize( 'email' ).escape().trim();
		v_phone = req.sanitize( 'phone' ).escape();

		var suplier = {
			kode: v_kode,
			nama: v_nama,
			alamat: v_alamat,
			email: v_email,
			phone : v_phone
		}


		var update_sql = 'update suplier SET ? where id = '+req.params.id;
		req.getConnection(function(err,connection){
			var query = connection.query(update_sql, suplier, function(err, result){
				if(err)
				{
					var errors_detail  = ("Error Update : %s ",err );   
					req.flash('msg_error', errors_detail); 
					res.render('suplier/edit', 
					{ 
						kode: req.param('kode'), 
						nama: req.param('nama'), 
						alamat: req.param('alamat'),
						email: req.param('email'),
						phone: req.param('phone'),
					});
				}else{
					req.flash('msg_info', 'Update suplier success'); 
					res.redirect('/suplier/edit/'+req.params.id);
				}		
			});
		});
	}else{

		console.log(errors);
		errors_detail = "Sory there are error<ul>";
		for (i in errors) 
		{ 
			error = errors[i]; 
			errors_detail += '<li>'+error.msg+'</li>'; 
		} 
		errors_detail += "</ul>"; 
		req.flash('msg_error', errors_detail); 
		res.render('suplier/add-customer', 
		{ 
			nama: req.param('nama'), 
			alamat: req.param('alamat')
		});
	}
});
router.delete('/delete/(:id)', function(req, res, next) {
	req.getConnection(function(err,connection){
		var suplier = {
			id: req.params.id,
		}
		
		var delete_sql = 'delete from suplier where ?';
		req.getConnection(function(err,connection){
			var query = connection.query(delete_sql, suplier, function(err, result){
				if(err)
				{
					var errors_detail  = ("Error Delete : %s ",err);
					req.flash('msg_error', errors_detail); 
					res.redirect('/suplier');
				}
				else{
					req.flash('msg_info', 'Delete suplier Success'); 
					res.redirect('/suplier');
				}
			});
		});
	});
});
module.exports = router;