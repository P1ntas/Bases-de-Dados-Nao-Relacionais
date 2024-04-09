<?php
require __DIR__ . '/vendor/autoload.php';

use Laudis\Neo4j\Authentication\Authenticate;
use Laudis\Neo4j\ClientBuilder;

$auth = Authenticate::basic('neo4j', '12345678'); // Change 'password' to your Neo4j password
$client = ClientBuilder::create()
    ->withDriver('http', 'http://localhost:7474', $auth)
    ->withDefaultDriver('http')
    ->build();

// Assuming you're receiving a URL and tags from a form submission
$url = $_POST['url'];
$tags = explode(',', $_POST['tags']); // Assuming tags are submitted as a comma-separated string

// Check if the URL already exists and create it if not
$client->run('MERGE (b:Bookmark {url: $url})', ['url' => $url]);

// For each tag, check if it exists and create it if not, then create the relationship
foreach ($tags as $tagName) {
    $tagName = trim($tagName); // Trim whitespace
    $client->run(<<<CYPHER
        MATCH (b:Bookmark {url: \$url})
        MERGE (t:Tag {name: \$tagName})
        MERGE (b)-[:HAS_TAG]->(t)
    CYPHER, ['url' => $url, 'tagName' => $tagName]);

    // Redirect to view_bookmarks.php
    header('Location: view_bookmarks.php');
    exit;
}


    
?>
