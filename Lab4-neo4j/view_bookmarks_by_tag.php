<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Bookmarks by Tags</title>
</head>
<body>
    <h1>Bookmarks by Tags</h1>
    <?php
    require __DIR__ . '/vendor/autoload.php';

    use Laudis\Neo4j\Authentication\Authenticate;
    use Laudis\Neo4j\ClientBuilder;

    $auth = Authenticate::basic('neo4j', '12345678'); // Replace with your password
    $client = ClientBuilder::create()
        ->withDriver('http', 'http://localhost:7474', $auth)
        ->withDefaultDriver('http')
        ->build();

    // Get tags from query parameter and split into array
    $tags = explode(',', $_GET['tag']);

    // Cypher query to match bookmarks with all specified tags
    $query = "MATCH (b:Bookmark)-[:HAS_TAG]->(t:Tag) 
WHERE t.name IN \$tags 
WITH b, count(t) AS tagCount 
WHERE tagCount = size(\$tags) 
RETURN b.url AS url 
ORDER BY b.url";

    $results = $client->run($query, ['tags' => $tags]);

    foreach ($results as $result) {
        $url = $result->get('url');
        echo "<div><a href=\"" . htmlspecialchars($url) . "\" target=\"_blank\">" . htmlspecialchars($url) . "</a></div>";
    }
    ?>
    <a href="view_bookmarks.php">Back to all bookmarks</a>
</body>
</html>
