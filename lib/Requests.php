<?php
    require_once"Controller.php";
/**
 * Обработчики ajax-запросов
 */

// получение содержимого директории по id
if(isset($_POST['get']))
{
	    $req = $_POST['get'];

	    $control = new Controller();
	    $resp = $control->getFiles($req);
	    unset($_POST['get']);

	    echo json_encode($resp);
        die();
}

//изменение родительского каталога элемента
if(isset($_POST['set_p_id']) && isset($_POST['id']))
{
    	$p_id = $_POST['set_p_id'];
    	$id = $_POST['id'];

    	$control = new Controller();
    	$control->setParent($p_id, $id);

    	unset($_POST['set_p_id']);
    	unset($_POST['id']);
        die();
}
