-- phpMyAdmin SQL Dump
-- version 2.6.1
-- http://www.phpmyadmin.net
-- 
-- Хост: localhost
-- Время создания: Ноя 20 2015 г., 18:39
-- Версия сервера: 5.0.45
-- Версия PHP: 5.2.4
-- 
-- БД: `DNStest`
-- 

-- --------------------------------------------------------

-- 
-- Структура таблицы `tree_files`
-- 

CREATE TABLE `tree_files` (
  `id` int(3) unsigned NOT NULL,
  `parent_id` int(3) unsigned NOT NULL,
  `name` varchar(15) character set utf8 NOT NULL,
  `is_folder` tinyint(1) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- 
-- Дамп данных таблицы `tree_files`
-- 

INSERT INTO `tree_files` VALUES (2, 1, 'file 1.1', 0);
INSERT INTO `tree_files` VALUES (3, 1, 'file 1.2', 0);
INSERT INTO `tree_files` VALUES (4, 1, 'file 1.3', 0);
INSERT INTO `tree_files` VALUES (5, 1, 'file 1.4', 0);
INSERT INTO `tree_files` VALUES (6, 1, 'folder 1', 1);
INSERT INTO `tree_files` VALUES (7, 1, 'file 1.5', 0);
INSERT INTO `tree_files` VALUES (8, 6, 'file 2.1', 0);
INSERT INTO `tree_files` VALUES (9, 6, 'folder 2', 1);
INSERT INTO `tree_files` VALUES (10, 6, 'file 2.2', 0);
INSERT INTO `tree_files` VALUES (11, 6, 'file 2.3', 0);
INSERT INTO `tree_files` VALUES (12, 6, 'folder 3', 1);
INSERT INTO `tree_files` VALUES (13, 9, 'file 3.1', 0);
INSERT INTO `tree_files` VALUES (14, 9, 'file 3.2', 0);
INSERT INTO `tree_files` VALUES (15, 9, 'file 3.3', 0);
INSERT INTO `tree_files` VALUES (16, 12, 'file 4.1', 0);
INSERT INTO `tree_files` VALUES (17, 12, 'file 4.2', 0);
INSERT INTO `tree_files` VALUES (18, 12, 'file 4.3', 0);
