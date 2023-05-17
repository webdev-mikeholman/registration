<?php
class Model {
	protected $table = '';
	protected $pdo = '';
	
	public function __construct(PDO $pdo) {
		$this->pdo = $pdo;
		
	}

	// Add to database
	public function add($data) {
		
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
	}

	// Get one record
	public function get($id) {
		$query = $this->pdo->prepare("Select * from $this->table where email = ?");
		$query->bindValue(1,$id);
		$query->execute();
		$model = $query->fetch(PDO::FETCH_OBJ);
		return $models;
	}

	// Get all records
	public function getAll() {
		$query = $this->pdo->query("Select * from $this->table");
		$models = $query->fetchAll(PDO::FETCH_OBJ);
		return $models;
	}

}

?>