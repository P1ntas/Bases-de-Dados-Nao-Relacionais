# Mongo Lab questions

- What is the total number of articles in the collection?

> db.dblp_nosql.countDocuments()

842

- How many articles are open (“info.access” property)?

> db.dblp_nosql.countDocuments({"info.access": "open"})

191

- What is the number of articles per year?

> db.dblp_nosql.aggregate( { $group: { _id: "$info.year", count: { $sum: 1 } } } )

[
  { _id: '2018', count: 96 },
  { _id: '2022', count: 14 },
  { _id: '2021', count: 61 },
  { _id: '2020', count: 80 },
  { _id: '2014', count: 76 },
  { _id: '2012', count: 21 },
  { _id: '2015', count: 116 },
  { _id: '2013', count: 48 },
  { _id: '2011', count: 17 },
  { _id: '2016', count: 129 },
  { _id: '2017', count: 105 },
  { _id: '2010', count: 3 },
  { _id: '2019', count: 76 }
]
- How many articles were published in journals?

> db.dblp_nosql.countDocuments({"info.type": "Journal Articles"})

228

- How many articles are single authored (one author only)?

  - Note that when the number of authors is one, the `info.authors.author` is an object. But when the number of authors is > 1, the `info.authors.author` is an array.
  - Note that the `$type` of operator considers both objects and arrays as objects. Thus, it is better to count when the `info.authors.author` is array and then subtract from the total number of articles.

> db.dblp_nosql.countDocuments() - db.dblp_nosql.countDocuments({ "info.authors.author": { $type: "array" } })

98

- What is the distribution of articles per number of authors?
Only consider articles with 2 or more authors.

> db.dblp_nosql.aggregate([
    { $match: { "info.authors.author": { $type: "array" } } },
    { $group: { _id:  { $size: "$info.authors.author" }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } }
])

[
  { _id: 2, count: 175 },
  { _id: 3, count: 246 },
  { _id: 4, count: 159 },
  { _id: 5, count: 93 },
  { _id: 6, count: 38 },
  { _id: 7, count: 21 },
  { _id: 8, count: 5 },
  { _id: 9, count: 3 },
  { _id: 10, count: 3 },
  { _id: 11, count: 1 }
]

- Who are the authors with the most papers published?
Use the $unwind operator.

> db.dblp_nosql.aggregate( [ { $unwind : "$info.authors.author" }, { $group: {_id: "$info.authors.author.text"}, {count: {$sum: 1}}} ] )

[
  { _id: 'Daniel Müller 0004', count: 1 },
  { _id: 'Asma Hassani', count: 1 },
  { _id: 'Antonino Galletta', count: 4 },
  { _id: 'Li-Yung Ho', count: 2 },
  { _id: 'Dennis Kundisch', count: 1 },
  { _id: 'Michael W. Hicks', count: 2 },
  { _id: 'William J. Knottenbelt', count: 2 },
  { _id: 'Prashant Chettri', count: 1 },
  { _id: 'Rui Chang', count: 1 },
  { _id: 'Armin Moebius', count: 1 },
  { _id: 'Wilhelm Zugaj', count: 1 },
  { _id: 'Chuanlei Ni', count: 1 },
  { _id: 'Stelios Sotiriadis', count: 1 },
  { _id: 'Tore Risch', count: 5 },
  { _id: 'Brian N. Wylie', count: 1 },
  { _id: 'Clodoveu A. Davis Jr.', count: 2 },
  { _id: 'Franc Volavc', count: 1 },
  { _id: 'Jongseong Yoon', count: 1 },
  { _id: 'Folker Meyer', count: 3 },
  { _id: 'Matt Bruzek', count: 1 }
]

