<?php
require_once '../config/Controller.php';
require_once '../model/UserModel.php';

class UserController extends Controller {
	private $pdo;

	public function __construct() {
		$this->pdo = new PDO('mysql:host=localhost;dbname=registration', 'tester', 'ImaTester!!');
	}

		
	/**
	 * validateUser - Checks to see if the user's email and password are correct
	 *
	 * @return array $validUserResponse
	 */
	public function validateUser() {
		$validPassword = false;
		$data = json_decode(file_get_contents('php://input'), true);
		$user = new User($this->pdo);
		$validUserResponse = $user->get($data['email']);
		if (isset($validUserResponse)) {
			$validPassword = $this->validatePassword($data['password'], $validUserResponse->password);
		}
		die(json_encode(['success'=> $validPassword]));
	}

		
	/**
	 * showUsers - Retrieves all users in the database
	 *
	 * @return array $validUserResponse
	 */
	public function showUsers() {
		$user = new User($this->pdo);
		$validUserResponse = $user->getAll();		
		return $this->view($validUserResponse);
	}
	
	/**
	 * addUser - Adds a user to the database if the email does not already exist
	 *
	 * @return array $response
	 */
	public function addUser() {
		try {
			$data = $this->encryptPassword(json_decode(file_get_contents('php://input'), true));
			$user = new User($this->pdo);
			$addUserResponse = $user->add($data);
			if ($addUserResponse) {
				$response = json_encode(['success'=>true, 'message'=>'Success']);
			} else {
				$response = json_encode(['success'=>false, 'message'=>'Unable to add user']);				
			}
			die($response);
		} catch (Exception $e) {
			header('Content-Type: application/json');
			http_response_code(403);
			echo json_encode(['error'=>$e->getMessage()]);
			exit;
		}
	}
	
	/**
	 * encryptPassword - Encrypts a password
	 *
	 * @param $data
	 *
	 * @return array $newData
	 */
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

	/**
	 * validatePassword - Checks to see if a password is valid
	 *
	 * @param $attemptedPassword, $savedPassword
	 *
	 * @return boolean
	 */
	private function validatePassword($attemptedPassword, $savedPassword) {
		return password_verify($attemptedPassword, $savedPassword);
	}

}
?>