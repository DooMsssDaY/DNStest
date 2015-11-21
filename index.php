<!DOCTYPE html>
<head>
    <meta charset="utf-8" />
    <title>Ajax дерево файлов</title>
    <script src="js/jquery-1.10.2.min.js" type="text/javascript"></script>
    <script src="js/main.js" type="text/javascript"></script>

    <link type="text/css" href="css/index.css" rel="stylesheet"/>
</head>

<body>
    <div class="page-wrapper">
        <h1>Ajax-дерево папок</h1>
        <div id="content">        
                <ul class="tree" nodrop='true' ondragenter="return dragEnter(event)" ondrop="return dragDrop(event)" ondragover="return dragOver(event)">
                    <div id="fol_1_div">  
                        <li id="fol_1" class="folder">Files</li>
                            <ul nodrop='true' id='ul_1' class="hidden"></ul>
                    </div>
                </ul> 
        </div>
        <div class="page-buffer"></div>
    </div>
    <p>Последнюю версию исходного кода скрипта(21.11.15) можно посмотреть в <a href='https://github.com/DooMsssDaY/DNStest' target='_blink'>репозитории на githab.com<a/></p>
        <div class="page-footer">
            Тестовое задание для DNS. 2015г.
            <span class='right'>Турушев Николай(Tur.Nik.8@mail.ru)</span>
        </div>

</body>
</html>
