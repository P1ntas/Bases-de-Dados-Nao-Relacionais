<?php
require __DIR__ . '/vendor/autoload.php';

use Laudis\Neo4j\Authentication\Authenticate;
use Laudis\Neo4j\ClientBuilder;

$auth = Authenticate::basic('neo4j', '12345678'); // Change 'password' to your Neo4j password
$client = ClientBuilder::create()
    ->withDriver('http', 'http://localhost:7474', $auth)
    ->withDefaultDriver('http')
    ->build();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $url = $_POST['url'];
    $tags = explode(' ', $_POST['tags']); // Split tags into an array

    // Create a bookmark node
    $client->run('CREATE (b:Bookmark {url: $url}) RETURN b', ['url' => $url]);

    // Create tags and associate with the bookmark
    foreach ($tags as $tag) {
        $client->run(<<<'CYPHER'
            MATCH (b:Bookmark {url: $url})
            MERGE (t:Tag {name: $tagName})
            MERGE (b)-[:HAS_TAG]->(t)
        CYPHER, ['url' => $url, 'tagName' => $tag]);
    }

    // Redirect to view_bookmarks.php
    header('Location: view_bookmarks.php');
    exit;
}
?>
