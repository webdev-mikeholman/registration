<?php
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}
$_SESSION['validUser'] = false;

require($_SERVER['DOCUMENT_ROOT'].'/../vendor/autoload.php');

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class Controller
{
	protected function view($filename = '', $data = []) {
		require_once '../view/'.$filename.'.php';
	}
	
	protected $key = '^kPi3EBXf!QKD7$gGTnkgq!';
	protected $expiredToken = true;
	protected $now;

	public function __construct() {
		$this->now = strtotime('now');
	}

	protected function auth($email) {
		try {
			$issueDate = $this->now;
			$expirationDate = strtotime('+1 hour');

			$payload = [
				'iss' => 'http://localhost:8000',
				'aud' => 'http://localhost',
				'iat' => $issueDate,
				'exp' => $expirationDate,
				'email' => $email
			];

			$jwtGeneratedToken = JWT::encode($payload, $this->key, 'HS256');
			
			return [
				'token' => $jwtGeneratedToken,
				'expires' => $expirationDate
			];

		} catch(Exception $e) {
			die($e->getMessage());
		}
	}

	protected function validate($token) {
		try {
			$decoded = JWT::decode($token, new Key($this->key, 'HS256'));
			return $decoded;
		} catch(Exception $e) {
			http_response_code(401);
			die(json_encode(['Error' => $e->getMessage()]));
		}
	}

	protected function tokenExpired() {
		$headers = apache_request_headers();
		if($headers['Authorization']) {
			$token = str_ireplace('Bearer ', '', $headers['Authorization']);
			$tokenInfo = $this->validate($token);
			if ($tokenInfo->exp >= $this->now) {
				$this->expiredToken = false;
			}
		}
		
		return $this->expiredToken;
	}
}

?>