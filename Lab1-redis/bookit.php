<?php
require 'vendor/autoload.php';

$redis = new Predis\Client();

$url = $_POST['url'];
$tagsInput = $_POST['tags'];
$tags = explode(' ', $tagsInput);

$id = sha1($url);

$timestamp = time();

$redis->zadd('bookmarks:sorted_by_time', [$id => $timestamp]);
$redis->hset('bookmark:'.$id, 'url', $url);

foreach ($tags as $tag) {
    $redis->sadd('bookmark:'.$id.':tags', $tag);
    $redis->sadd('tag:'.$tag, $id);
}

header('Location: index.php');
exit();
?>
