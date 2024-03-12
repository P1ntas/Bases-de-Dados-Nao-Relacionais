cd /data/db/
ls
cd ..
cd db/
cat dblp-nosql-1000.json | jq '.' | head
cat dblp-nosql-1000.json | jq '.result.hits.hit' > dblp-nosql-1000-results.json
mongoimport --collection='dblp_nosql' --file='dblp-nosql-1000-results.json' --jsonArray
.quit
cd ..
cd ..
cd ..
exit
