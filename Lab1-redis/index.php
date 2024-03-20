<?php
require 'vendor/autoload.php';

$redis = new Predis\Client();

echo '<h1>Bookit!</h1>';

function getRecentBookmarks($redis, $count = 15) {
    echo '<h3>Latest Bookmarks</h3>';
    
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
    echo 'URL: ';
    echo "<a href={$bookmark['url']}>{$bookmark['url']}</a><br>";

    echo 'Tags: ';
    foreach ($bookmark['tags'] as $tag) {
        echo "<a href=\"index.php?tags=$tag\">$tag</a>";
        
        // Add a comma and space after each tag except the last one
        if ($tag !== end($bookmark['tags'])) {
            echo ", ";
        }
        
    }
    echo "<br><br>";

}

echo '<a href="add.html">Add another bookmark</a>';

?>

