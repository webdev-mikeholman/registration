<?php
class Model {
	protected $table = '';
	protected $pdo = '';
	
	public function __construct(PDO $pdo) {
		$this->pdo = $pdo;
		
	}

	// Add to database
	public function add($data) {
		try {
			$query = $this->pdo->prepare(
				"Insert into $this->table ("
					.implode(',', array_keys($data)).
					") values ("
					.implode(',',array_fill(0, count($data), '?')).
				")");
			
			$x = 1;
			foreach ($data as $key => $value) {
				$query->bindValue($x,$value);
				$x++;
			}
			
			$query->execute();
			
			return true;
		} catch (PDOException $e) {
			echo '<pre>'; print_r($e); echo '</pre>'; die;
		}
	}

	// Get one record
	public function get($email) {
		try {
			$query = $this->pdo->prepare("Select * from $this->table where email = ?");
			$query->bindValue(1,$email);
			$query->execute();
			$model = $query->fetch(PDO::FETCH_OBJ);
			return $model;
		} catch (PDOException $e) {
			echo '<pre>'; print_r($e); echo '</pre>'; die;
		}
	}

	// Get all records
	public function getAll() {
		try {
			$query = $this->pdo->query("Select * from $this->table");
			$model = $query->fetchAll(PDO::FETCH_OBJ);
			return $model;
		} catch (PDOException $e) {
			echo '<pre>'; print_r($e); echo '</pre>'; die;
		}
	}
}

?>