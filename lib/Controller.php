<?php
	require_once"Database.php";
/**
 * Класс для осуществления операций с каталогом
 */
Class Controller
{
	/**
	 * экземпляр класса Database()
	 */
	private $db;

	public function __construct()
	{
			$this->db = new Database();
	}

	/**
	 * получение содержимого директории по id
	 */
	public function getFiles($parent_id)
	{	
			// подготовка данных для получения(имя таблицы, необходимые поля)
		    $table = 'files';
		    $fields = array('id',
						    'parent_id',
						    'name',
						    'is_folder');

		    // получение содержимого директории
		    if($rez = $this->db->select($table, $fields, $parent_id))
					return $rez;
			else
					die("не верный запрос");
	}

	/**
	 * изменение родительского каталога элемента
	 */
	public function setParent($parent_id, $id)
	{		
			// подготовка данных для обновления(имя таблицы, новые данные, условие)
			$table = 'files';
			$p_id['parent_id'] = $parent_id;
			$where['id'] = $id;
			// обновление 
			$this->db->update($table, $p_id, $where);
	}
}

?>