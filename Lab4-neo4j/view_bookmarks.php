<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>View Bookmarks</title>
</head>
<body>
    <h1>Bookmarks</h1>
    <?php
    require __DIR__ . '/vendor/autoload.php';

    use Laudis\Neo4j\Authentication\Authenticate;
    use Laudis\Neo4j\ClientBuilder;

    $auth = Authenticate::basic('neo4j', '12345678'); // Ensure correct password
    $client = ClientBuilder::create()
        ->withDriver('http', 'http://localhost:7474', $auth)
        ->withDefaultDriver('http')
        ->build();

    $query = <<<CYPHER
MATCH (b:Bookmark)-[:HAS_TAG]->(t:Tag)
RETURN b.url AS url, collect(DISTINCT t.name) AS tags
ORDER BY b.url
CYPHER;

    $results = $client->run($query);

    foreach ($results as $result) {
        $url = $result->get('url');
        $tagsCollection = $result->get('tags');

        $tags = [];
        foreach ($tagsCollection as $tag) {
            $tags[] = $tag;
        }

        // Make URL clickable
        echo "<div>";
        echo "<strong>URL:</strong> <a href=\"" . htmlspecialchars($url) . "\" target=\"_blank\">" . htmlspecialchars($url) . "</a><br>";
        echo "<strong>Tags:</strong> ";
        foreach ($tags as $tag) {
            // Make each tag a clickable link
            echo "<a href=\"/view_bookmarks_by_tag.php?tag=" . urlencode($tag) . "\">" . htmlspecialchars($tag) . "</a>, ";
        }
        echo "</div><br>";
    }
    ?>
    <a href="index.html">Add another bookmark</a>
</body>
</html>
