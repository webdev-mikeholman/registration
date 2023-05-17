<?php
	require_once 'Router.php';
	Router::get('/','HomeController', 'index');
	Router::get('/login', 'UserController', 'validateUser');
	Router::get('/allUsers', 'UserController', 'showUsers');
	Router::post('/users', 'UserController', 'addUser');
?>