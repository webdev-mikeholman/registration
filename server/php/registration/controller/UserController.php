<?php
require_once '../config/Controller.php';
require_once '../model/UserModel.php';

class UserController extends Controller {
	private $pdo;

	public function __construct() {
		$this->pdo = new PDO('mysql:host=localhost;dbname=registration', 'tester', 'ImaTester!!');
	}

	public function validateUser() {
		$user = new User($this->pdo);
		$validUserResponse = $user->validateUser($data);
		$this->view($validUserResponse);
	}

	public function showUsers() {
		$user = new User($this->pdo);
		$validUserResponse = $user->getAll();		
		$this->view($validUserResponse);
	}

	public function addUser() {
		$data = $this->encryptPassword(json_decode(file_get_contents('php://input'), true));
		$user = new User($this->pdo);
		$addUserResponse = $user->add($data);
		$this->view('User',$addUserResponse);
		return json_encode(['success'=>true, 'message'=>'Success']);
	}

	private function encryptPassword($data) {
		$newData = [];
		foreach($data as $key => $val) {
			if ($key == 'password') {
				$newData[$key] = password_hash($val, PASSWORD_BCRYPT);
			}
			else {
				$newData[$key] = $val;
			}
		}
		return $newData;
	}

}
?>