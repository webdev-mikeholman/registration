<?php
require_once '../config/Controller.php';
require_once '../model/UserModel.php';

/**
 * @OA\Info(title="PDO PHP REST", version="1.0")
 * 		@OA\SecurityScheme(
 * 			type="http",
 * 			description="Authorization with JWT authentication",
 * 			name="Authorization",
 * 			in="header",
 * 			scheme="bearer",
 *			bearerFormat="JWT",
 *			securityScheme="bearerToken",
 * 		)
 */

class UserController extends Controller {
	private $pdo;
	private $isValidUser;

	public function __construct() {
		$this->pdo = new PDO('mysql:host=localhost;dbname=registration', 'tester', 'ImaTester!!');
		$this->isValidUser = !$this->tokenExpired() && isset($_SESSION['validUser']) ? true : false;
	}
		
	/**
	 * @OA\Get(
	 * 		path="/allUsers",
	 * 		summary="Gets all users",
	 * 		tags={"Users"},
	 * 		@OA\Response(response="200", description="Get all users"),
	 * 		security={ {"bearerToken": {}}}
	 * )
	 */
		
	public function showUsers() {
		try {
			if ($this->isValidUser) {
			$user = new User($this->pdo);
			$validUserResponse = $user->getAll();		
			die(json_encode($validUserResponse));
			} else {
				session_destroy();
				http_response_code(401);
				die(json_encode(['success'=> 'false', 'message' => 'Invalid user']));
			}
		} catch (Exception $e) {
			die($e->getMessage());
		}
	}
	
	/**
	 * @OA\Post(
	 * 		path="/newUser",
	 * 		summary="Adds new user",
	 * 		tags={"Users"},
	 * 		@OA\RequestBody(
	 * 			@OA\MediaType(
	 * 				mediaType="application/json",
	 * 				@OA\Schema(
	 * 					@OA\Property(
	 * 						property="firstName",
	 * 						type="string",
	 * 					),
	 * 					@OA\Property(
	 * 						property="lastName",
	 * 						type="string",
	 * 					),
	 * 					@OA\Property(
	 * 						property="email",
	 * 						type="string",
	 * 					),
	 * 					@OA\Property(
	 * 						property="password",
	 * 						type="string",
	 * 					),
	 * 				),
	 * 			),
	 * 		),
	 * 		@OA\Response(response="200", description="Success"),
	 * 		@OA\Response(response="403", description="Forbidden"),
	 * 		security={ {"bearerToken": {}}}
	 * )
	 */
	public function addUser() {
		try {
			if ($this->isValidUser) {
				$data = $this->encryptPassword(json_decode(file_get_contents('php://input'), true));
				$user = new User($this->pdo);
				$addUserResponse = $user->add($data);
				if ($addUserResponse) {
					$response = json_encode(['success'=>true, 'message'=>'Success']);
				} else {
					$response = json_encode(['success'=>false, 'message'=>'Unable to add user']);				
				}
				die($response);
			} else {
				session_destroy();
				http_response_code(401);
				die(json_encode(['success'=> 'false', 'message' => 'Invalid user']));
			}
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

}
?>