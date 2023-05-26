<?php

require_once '../config/Controller.php';
require_once '../model/UserModel.php';

/**
 * @OA\Info(title="PDO PHP REST", version="1.0")
 */

class AuthController extends Controller {
	private $pdo;
	private $isValidUser;

	public function __construct() {
		$this->pdo = new PDO('mysql:host=localhost;dbname=registration', 'tester', 'ImaTester!!');
		$this->isValidUser = isset($_SESSION['validUser']) ? true : false;
	}

	//email > password validates user, then pass token to access API
		
	/**
	 * @OA\Post(
	 * 		path="/login",
	 * 		summary="Validates user",
	 * 		tags={"Auth"},
	 * 		@OA\RequestBody(
	 * 			@OA\MediaType(
	 * 				mediaType="application/json",
	 * 				@OA\Schema(
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
	 * 		@OA\Response(response="403", description="Forbidden")	
	 * )
	 */
	public function validateUser() {
		$tokenInfo = [];
		$data = json_decode(file_get_contents('php://input'), true);		
		$user = new User($this->pdo);
		$validUserResponse = $user->get($data['email']);
		if (isset($validUserResponse)) {
			$validPassword = $this->validatePassword($data['password'], $validUserResponse->password);
		}

		if (isset($validUserResponse) && $validPassword) {
			$tokenInfo = $this->getToken($data['email']);
			if ($tokenInfo) {
				session_destroy();
				http_response_code(200);
				die(json_encode(['Token' => $tokenInfo['token']]));
			} else {
				session_destroy();
				http_response_code(401);
				die(json_encode(['success'=> 'false']));
			}
		}
		else {
			session_destroy();
			http_response_code(401);
			die(json_encode(['success'=> 'false']));
		}
	}


		
	/**
	 * showUsers - Retrieves all users in the database
	 *
	 * @return array $validUserResponse
	 */
	private function getToken($email) {
		try {
			return $this->auth($email);
		} catch (Exception $e) {
			die($e->getMessage());
		}
	}

	/**
	 * @OA\Post(
	 * 		path="/validate",
	 * 		summary="Validates token",
	 * 		tags={"Auth"},
	 * 		@OA\RequestBody(
	 * 			@OA\MediaType(
	 * 				mediaType="application/json",
	 * 				@OA\Schema(
	 * 					@OA\Property(
	 * 						property="email",
	 * 						type="string",
	 * 					),
	 * 					@OA\Property(
	 * 						property="token",
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
	public function validateToken() {
		try {
			$data = json_decode(file_get_contents('php://input'), true);
			$headers = apache_request_headers();
			$now = strtotime('now');
			if($headers['Authorization']) {
				$token = str_ireplace('Bearer ', '', $headers['Authorization']);
				$decoded = $this->validate($token);
				if ($this->tokenExpired()) {
					session_destroy();
					die(json_encode(['success'=> 'false', 'message' => 'Expired token']));
					http_response_code(401);
				}
				if (isset($decoded->email) && $decoded->email === $data['email']) {
					$_SESSION['validUser'] = true;
					http_response_code(200);
					die(json_encode(['success'=> 'true']));
				} else {
					session_destroy();
					http_response_code(401);
					die(json_encode(['success'=> 'false']));
				}
			} else {
				session_destroy();
				http_response_code(401);
				die(json_encode(['success'=> 'false']));
			}
		} catch (Exception $e) {
			session_destroy();
			die(json_encode(['error'=> $e->getMessage()]));
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