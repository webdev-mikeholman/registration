<?php
	require_once 'Router.php';
	Router::get('/','HomeController', 'index');
	Router::post('/login', 'AuthController', 'validateUser');
	Router::post('/validate', 'AuthController', 'validateToken');
	Router::post('/newUser', 'UserController', 'addUser');
	Router::get('/allUsers', 'UserController', 'showUsers');
	Router::post('/users', 'UserController', 'addUser');
	Router::get('/api', 'Documents', 'index');
?>