<?php
require 'vendor/autoload.php';

$redis = new Predis\Client();

function getRecentBookmarks($redis, $count = 15) {
    $ids = $redis->zrevrange('bookmarks:sorted_by_time', 0, $count - 1);
    $bookmarks = [];
    foreach ($ids as $id) {
        $bookmark = $redis->hgetall('bookmark:'.$id);
        $tags = $redis->smembers('bookmark:'.$id.':tags');
        $bookmark['tags'] = $tags;
        $bookmarks[] = $bookmark;
    }
    return $bookmarks;
}

function getBookmarksByTags($redis, $tags) {
    $tagKeys = [];
    foreach ($tags as $tag) {
        $tagKeys[] = 'tag:'.$tag;
    }
    $ids = $redis->sinter($tagKeys);
    $bookmarks = [];
    foreach ($ids as $id) {
        $bookmark = $redis->hgetall('bookmark:'.$id);
        $tags = $redis->smembers('bookmark:'.$id.':tags');
        $bookmark['tags'] = $tags;
        $bookmarks[] = $bookmark;
    }
    return $bookmarks;
}

$tags = isset($_GET['tags']) ? explode(',', $_GET['tags']) : [];

if (count($tags) > 0) {
    $bookmarks = getBookmarksByTags($redis, $tags);
} else {
    $bookmarks = getRecentBookmarks($redis);
}

foreach ($bookmarks as $bookmark) {
    echo 'URL: ' . $bookmark['url'] . '<br>';
    echo 'Tags: ' . implode(', ', $bookmark['tags']) . '<br><br>';
}
?>

