var express = require('express');
var router = express.Router();

/* GET Customer page. */

router.get('/', function(req, res, next) {
	req.getConnection(function(err,connection){
		var query = connection.query('SELECT * FROM barang',function(err,rows)
		{
			if(err)
				var errornya  = ("Error Selecting : %s ",err );   
			req.flash('msg_error', errornya);   
			res.render('barang/list',{title:"Barang",data:rows});
		});
     });
});
router.post('/add', function(req, res, next) {
	req.assert('nama', 'Please fill the name').notEmpty();
	var errors = req.validationErrors();
	if (!errors) {

		v_kode = req.sanitize( 'kode' ).escape().trim(); 
		v_nama = req.sanitize( 'nama' ).escape().trim();
		v_merek = req.sanitize( 'merek' ).escape().trim();
		v_satuan = req.sanitize( 'satuan' ).escape();
        v_jumlah = req.sanitize( 'jumlah' ).escape();
        v_harga = req.sanitize( 'harga' ).escape();

		var barang = {
            kode: v_kode,
			nama: v_nama,
			merek: v_merek,
			satuan: v_satuan,
            jumlah : v_jumlah,
            harga : v_harga
		}

		var insert_sql = 'INSERT INTO barang SET ?';
		req.getConnection(function(err,connection){
			var query = connection.query(insert_sql, barang, function(err, result){
				if(err)
				{
					var errors_detail  = ("Error Insert : %s ",err );   
					req.flash('msg_error', errors_detail); 
					res.render('barang/add-customer', 
					{ 
                        kode: req.param('kode'),
						nama: req.param('nama'), 
						merek: req.param('merek'),
						satuan: req.param('satuan'),
                        jumlah: req.param('jumlah'),
                        harga: req.param('harga')
					});
				}else{
					req.flash('msg_info', 'Create barang success'); 
					res.redirect('/barang');
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
		res.render('barang/add-customer', 
		{ 
			nama: req.param('nama'), 
			satuan: req.param('satuan')
		});
	}

});

router.get('/add', function(req, res, next) {
	res.render(	'barang/add-customer', 
	{ 
        title: 'Add New Barang',
        kode: '',
        nama: '',
        merek: '',
		satuan: '',
		jumlah:'',
		harga:''
	});
});
router.get('/edit/(:kode)', function(req,res,next){
	req.getConnection(function(err,connection){
		var query = connection.query('SELECT * FROM barang where kode='+req.params.kode,function(err,rows)
		{
			if(err)
			{
				var errornya  = ("Error Selecting : %s ",err );  
				req.flash('msg_error', errors_detail); 
				res.redirect('/barang'); 
			}else
			{
				if(rows.length <=0)
				{
					req.flash('msg_error', "Barang can't be find!"); 
					res.redirect('/barang');
				}
				else
				{	
					console.log(rows);
					res.render('barang/edit',{title:"Edit ",data:rows[0]});

				}
			}

		});
	});
});
router.put('/edit/(:kode)', function(req,res,next){
	req.assert('nama', 'Please fill the nama').notEmpty();
	var errors = req.validationErrors();
	if (!errors) {
		v_kode = req.sanitize( 'kode' ).escape().trim(); 
		v_nama = req.sanitize( 'nama' ).escape().trim();
		v_merek = req.sanitize( 'merek' ).escape().trim();
		v_satuan = req.sanitize( 'satuan' ).escape();
        v_jumlah = req.sanitize( 'jumlah' ).escape();
        v_harga = req.sanitize( 'harga' ).escape();

		var barang = {
            kode: v_kode,
			nama: v_nama,
			merek: v_merek,
            satuan: v_satuan,
            harga: v_harga,
			jumlah : v_jumlah
		}

		var update_sql = 'update barang SET ? where kode = '+req.params.kode;
		req.getConnection(function(err,connection){
			var query = connection.query(update_sql, barang, function(err, result){
				if(err)
				{
					var errors_detail  = ("Error Update : %s ",err );   
					req.flash('msg_error', errors_detail); 
					res.render('barang/edit', 
					{ 
                        kode: req.params('kode'),
						nama: req.param('nama'), 
						merek: req.param('merek'),
						satuan: req.param('satuan'),
                        harga: req.param('harga'),
                        jumlah: req.param('jumlah'),
					});
				}else{
					req.flash('msg_info', 'Update barang success'); 
					res.redirect('/barang/edit/'+req.params.kode);
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
		res.render('barang/add-customer', 
		{ 
			nama: req.param('nama'), 
			address: req.param('address')
		});
	}
});
router.delete('/delete/(:kode)', function(req, res, next) {
	req.getConnection(function(err,connection){
		var barang = {
			kode: req.params.kode,
		}
		
		var delete_sql = 'delete from barang where ?';
		req.getConnection(function(err,connection){
			var query = connection.query(delete_sql, barang, function(err, result){
				if(err)
				{
					var errors_detail  = ("Error Delete : %s ",err);
					req.flash('msg_error', errors_detail); 
					res.redirect('/barang');
				}
				else{
					req.flash('msg_info', 'Delete Barang Success'); 
					res.redirect('/barang');
				}
			});
		});
	});
});
module.exports = router;