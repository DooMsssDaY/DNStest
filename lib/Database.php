<?php
    require_once"Config.php";
/**
 * Класс для работы с БД
 */
class Database
{
    /**
     * объект подключения mySQLi
     */    
    private $mysqli;

    /**
     * Подключение к БД
     */    
    public function __construct()
    {
            $this->mysqli = new mysqli(Config::DB_HOST, Config::DB_USER, Config::DB_PASSWORD, Config::DB_NAME);
            $this->mysqli->query("SET NAMES 'utf8'");
    }
    
    /**
     * Совершение запроса
     */ 
    private function query($query)
    {
            return $this->mysqli->query($query);
    }
    
    /**
     * Универсальный метод выборки из БД
     */ 
    public function select($table_name, $fields, $parent_id)
    {
            // проход по всем названиям полей, обварачивание в '`'
            for ($i=0;$i < count($fields);$i++)
                    if((strpos($fields[$i],"(") === false) && ($fields[$i]!= "*")) 
                            $fields[$i] = "`".$fields[$i]."`";

            // преобразование полей в строку
            $fields = implode(",", $fields);
            // получение имени таблицы
            $table_name = Config::DB_TAB_PREFIX.$table_name;
            // выборка данных
            $query = "SELECT $fields FROM $table_name WHERE parent_id = '$parent_id'";
            $result_set = $this->query($query);

            if(!$result_set) 
                    return false;

            // запись полученных данных в массив
            $i = 0;
            while ($row = $result_set->fetch_assoc())
            {
                    $data[$i] = $row;
                    $i++;
            }

            $result_set->close();
            return $data;
    }
    
    /**
     * Универсальный метод обновления записей в БД
     */ 
    public function update($table_name, $upd_fields, $where)
    {   
            // получение имени таблицы
            $table_name = Config::DB_TAB_PREFIX.$table_name;
            // начало запроса
            $query = "UPDATE $table_name SET";
            // добавление имен полей и новых значений
            foreach($upd_fields as $field => $value)         
                    $query .="`$field` ='".addslashes($value)."',";

            $query = substr($query,0,-1);

            // при необходимости - добавление условия
            if($where)
            {
                    $query .= "WHERE ";

                    foreach($where as $field => $value)
                            $query .="`$field` ='".addslashes($value)."'";
             
                     return $this->query($query);
            }
            else
                    return false;
    }
}
?>