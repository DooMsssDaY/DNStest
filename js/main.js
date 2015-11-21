$(document).ready(function () {

        var openedFolders = []; //массив id уже прогруженных директорий

        // назначение события 'click' на директории
        $('body').on('click', '.folder', function(){

                var idFolder = getIdFolder(this); // id открываемой директории
                var flagLoad = 'false'; // флаг, устанавливаемый в случае, если директория уже прогружена

                // поиск в цикле id открываемой директории в уже прогруженных id директориях
                for(var i=0; i<openedFolders.length; i++)
                        if(openedFolders[i] == idFolder)
                                flagLoad = 'true';

                //если директория ещё не открывалась - производим ajax-подгрузку содержимого
                if(flagLoad != 'true')
                {
                        openedFolders.push(idFolder);
                        getFiles(this);
                } 
                else{
                        // визуальное открытие и закрытие директорий
                        var isHidden = $(this).next().attr("class");

                        if (isHidden == 'hidden')
                        {
                                $(this).next().fadeIn(300);
                                $(this).next().removeClass('hidden').addClass('shown');
                                $(this).css({ 'backgroundImage' : 'url(img/arrow-green-down.png)' });
                        }
                        else
                        {
                                $(this).next().fadeOut(300);
                                $(this).next().removeClass('shown').addClass('hidden');
                                $(this).css({ 'backgroundImage': 'url(img/arrow-green-right.png)' });
                        }
                }      
        });
});


// асинхронная подгрузка содержимого директории
function getFiles(folder){

    var folderId = getIdFolder(folder); // id открываемой директории
    // изображение прогресс-бар
    $(folder).css({ 'backgroundImage' : 'url(img/16x16_loading.gif)' });

    // отправка запроса и получение содержимого директории в json-массиве
    $.ajax({
        dataType: 'json',
        url: 'lib/Requests.php',
        method: 'POST',
        data: {get:folderId},
        success: function (result) {

                $(folder).next().fadeIn(300);
                $(folder).next().removeClass('hidden').addClass('shown');
                $(folder).css({ 'backgroundImage' : 'url(img/arrow-green-down.png)' });

                // проход по всем елементам директории
                for(var i=0; i < result.length; i++)
                {
                        //выводим директорию
                        if(result[i]['is_folder'] == 1)
                        {       
                                // div для директории
                                var divFolder = "fol_"+result[i]['id']+"_div";
                                $(folder).next().append('<div id="'+divFolder+'">');
                                // li директории
                                var liFolder = $("<li/>", {id : "fol_"+result[i]['id'],
                                                           text : result[i]['name'],
                                                           "class" : "folder",
                                                           "draggable" : "true",
                                                           "ondragstart" : "return dragStart(event)"}
                                                );
                                $('#'+divFolder).append(liFolder);
                                // список ul для файлов дериктории
                                var ulFolder = $("<ul/>", {id : "ul_"+result[i]['id'],
                                                           nodrop : 'true',
                                                           "class" : "hidden"}
                                                );
                                $('#'+divFolder).append(ulFolder);
                        }
                        // выводим файл
                        else
                        {
                                var file = $("<li/>", {id : "fil_"+result[i]['id'],
                                                       text : result[i]['name'],
                                                       "draggable" : "true",
                                                       "ondragstart" : "return dragStart(event)"}
                                            );
                                $(folder).next().append(file);
                        }
                }
        }
    });
}


// функция получения id открываемой директории
function getIdFolder(folder)
{
    var id = $(folder).attr('id');        
    var arr=id.split("_");

    return arr[1];
}

// изменение id родителя
function changeParentId(parentId, id, oldParent)
{   
    // извлечение id родителя
    var arr1=parentId.split("_");
    p_id = arr1[1];
    // извлечение id
    var arr2=id.split("_");
    id = arr2[1];
    // если id родителя отличается от старого, делаем изменения в БД
    if(oldParent != parentId)
            $.ajax({
                dataType: 'json',
                url: 'lib/requests.php',
                method: 'POST',
                data: {set_p_id:p_id, id:id}
            });  
}

// начало перетаскивания элемента
function dragStart(ev)
{   
    var id = ev.target.getAttribute('id'); // id перетаскиваемого элемента
    // если директория, то получаем id divа элемента
    if (ev.target.getAttribute('class') == 'folder')
            var id = $("#" + id).parent().attr('id');

    // id родителя элемента
    parentId = $("#" + id).parents('div').attr('id');

    // определение метода переноса, установка передаваемых данных, получение изображения при переносе
    ev.dataTransfer.effectAllowed = 'move';
    ev.dataTransfer.setData("id", id);
    ev.dataTransfer.setData("parentId", parentId);
    ev.dataTransfer.setDragImage(ev.target, 0, 0);

    return true;
}


// перетаскиваемый элемент достигает конечного элемента
function dragEnter(ev)
{
    ev.preventDefault();
    return true;
}


// курсор мыши наведен на элемент при перетаскивании
function dragOver(ev)
{
    var classTarget = ev.target.getAttribute('nodrop'); // идентификатор, запрещающий перетаскивать элемент

    if (classTarget != 'true') {
        ev.preventDefault();
    }
    return true;
}


// отпускание элемента
function dragDrop(ev)
{
    var target = ev.target; // элемент, на котором производится отпускание
    var id = ev.dataTransfer.getData("id"); // id перетаскиваемого элемента
    var oldParent = ev.dataTransfer.getData("parentId"); // id родителя перетаскиваемого элемента
    var idTarget = target.getAttribute('id'); // id конечного элемента
    var idTargetParent = $("#" + idTarget).parents('div').attr('id'); // id родителя конечного элемента
    
    // проверка на попытку вложить папку саму в себя
    var internal = $('#'+id).find('#'+idTarget).length;

    if (id == idTargetParent || internal != 0)
    {
            alert('Нельзя вложить папку саму в себя!');
            return false;
    }

    // перенос элемента на новое место
    if (target.getAttribute('class') == 'folder')
                target.nextElementSibling.appendChild(document.getElementById(id));
    else
    {
            $(target).after('<li></li>');
            target.nextElementSibling.appendChild(document.getElementById(id));
            $('#'+id).unwrap();
    }
    // изменение родителя
    changeParentId(idTargetParent, id, oldParent);
    ev.stopPropagation();

    return false;
}






































// $(document).ready(function () {

//     ajax_req(0);

//     var mass_id = [];
//     mass_id.push(0);

//         $('body').on('click', '.folder', function(){

//             var id = $(this).attr('id');        
//             var arr=id.split("_");
//             id = arr[1];

//             var x = 'false';

//             for(var i=0; i<mass_id.length; i++){

//                 if(mass_id[i] == id){

//                     x = 'true';
//                 }
//             }

//             if(x != 'true'){

//                 mass_id.push(id);
//                 ajax_req(id,this);
                
//             }         

//             var isHidden = $(this).next().attr("class");

//             if (isHidden == 'hidden') {
//                 $(this).next().fadeIn(300);
//                 $(this).next().removeClass('hidden').addClass('shown');
//                 $(this).css({ 'backgroundImage' : 'url(img/arrow-green-down.png)' });
//             }
//             else {
//                 $(this).next().fadeOut(300);
//                 $(this).next().removeClass('shown').addClass('hidden');
//                 $(this).css({ 'backgroundImage': 'url(img/arrow-green-right.png)' });
//             }
//         });
// });

// function ajax_req(id,fold){

//     $.ajax({
//         dataType: 'json',
//         url: 'lib/requests.php',
//         method: 'POST',
//         data: {get:id},
//         success: function (result) {

//            if(id == 0){

//                 $("#content").append('<ul class="tree" ondragenter="return dragEnter(event)" ondrop="return dragDrop(event)" ondragover="return dragOver(event)"></ul>');
//                 $(".tree").append('<div id="fol_0_div">');

//                 for(var i=0; i < result.length; i++){


//                     if(result[i]['is_folder'] == 1){

                        
//                         var div_folder = "fol_0_div";
//                         $('#'+div_folder).append('<li id="fol_'+result[i]['id']+'" class="folder">'+result[i]['name']+'</li>');
//                         $('#'+div_folder).append('<ul class="hidden" id="ul_'+result[i]['id']+'_hid">');

//                     }
//                     else{

//                         $('#'+div_folder).append('<li id="fil_'+result[i]['id']+'">');
//                         var file = 'fil_'+result[i]['id'];
//                         $('#'+file).text(result[i]['name']);
//                     }
//                 }
//            }
//            else{

//                 for(var i=0; i < result.length; i++){

//                     if(result[i]['is_folder'] == 1){
                    
//                         $(fold).next().append('<div id="fol_'+result[i]['id']+'_div">');
//                         var div_folder = "fol_"+result[i]['id']+"_div";
//                         $('#'+div_folder).append('<li id="fol_'+result[i]['id']+'" class="folder">'+result[i]['name']+'</li>');
//                         $('#'+div_folder).append('<ul class="hidden" id="ul_'+result[i]['id']+'_hid">');
//                     }
//                     else{
//                         $(fold).next().append('<li id="fil_'+result[i]['id']+'">');
//                         var file = 'fil_'+result[i]['id'];
//                         $('#'+file).text(result[i]['name']);
//                     }
//                 }
//            }

//             $('li').attr("draggable", "true").attr("ondragstart", "return dragStart(event)");
//         }
//     });
// }

// function change_parent_id(parent_id, id, old_parent){
        
//     var arr1=parent_id.split("_");
//     p_id = arr1[1];

//     var arr2=id.split("_");
//     id = arr2[1];

//     if(old_parent != parent_id){

//         $.ajax({
//             dataType: 'json',
//             url: 'lib/requests.php',
//             method: 'POST',
//             data: {set_p_id:p_id, id:id},
//             success: function (result) {
//             }
//         });  
//     }
//     else{
            
//     }
// }


// function dragStart(ev) {

//     var class_of_target = ev.target.getAttribute('class');
//     var ID = ev.target.getAttribute('id');

//     if (class_of_target == 'folder') {
        

//         var x = $("#" + ID).parent().attr('id');

//         ev.dataTransfer.effectAllowed = 'move';
//         ev.dataTransfer.setData("Text", x);
//         ev.dataTransfer.setDragImage(ev.target, 0, 0);
//     }
//     else {
//         ev.dataTransfer.effectAllowed = 'move';
//         ev.dataTransfer.setData("Text", ev.target.getAttribute('id'));
//         ev.dataTransfer.setDragImage(ev.target, 0, 0);
//     }
//     return true;
// }

// function dragEnter(ev) {
//     ev.preventDefault();
//     return true;
// }

// function dragOver(ev) {
//     ev.preventDefault();
//     return true;
// }

// function dragDrop(ev) {

//     var target = ev.target;
//     var ID = ev.dataTransfer.getData("Text");
//     var old_parent = $("#" + ID).parent().attr('id');
//     var class_of_target = ev.target.getAttribute('class');
//     var ID_of_target = ev.target.getAttribute('id');
//     var ID_of_target_parent = $('#' + ID_of_target).parent().attr('id');

//     alert(ID);

//     var intern = $('#'+ID).find('#'+ID_of_target).length;

//     if (ID == ID_of_target_parent || intern != 0) {
//         alert('Нельзя вложить папку саму в себя!');
//         return false;
//     }

//     if (class_of_target == 'folder') {
//         ev.target.nextElementSibling.appendChild(document.getElementById(ID));
//     }
//     else {
//         $(target).after('<li></li>');
//         ev.target.nextElementSibling.appendChild(document.getElementById(ID));
//         $('#'+ID).unwrap();
//     }

//     //change_parent_id(ID_of_target_parent, ID, old_parent);
//     ev.stopPropagation();
//     return false;
// }