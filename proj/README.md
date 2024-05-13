# CineSync

Our prototype is a web application akin to IMDB. It allows users to search for movies, actors, and directors, as well as interact with the content by leaving comments and ratings. Users can express their preferences by liking or disliking movies, providing valuable insights that help tailor recommendations. Additionally, the prototype features a social aspect, enabling users to follow other users and view their interests through a timeline. This social component fosters community engagement and facilitates the discovery of new content based on the preferences of like-minded users.

## How to run

In order to run the project, one must have <b>Docker</b> and <b>Python</b> installed. If these requirements are met, the user just needs to make sure it has a terminal window in the directory of the Makefile and input ``make run``.
This will build and start the database container, create the database, load all data and create views.

It takes a long time but it works.

Then, from the backend folder run:
- npm install
- npm start

Then the same for the frontend folder:
- npm install
- npm start

## Ports

- Database (ArangoDB): http://localhost:8529
- Backend (Node.js): http://localhost:3000
- Frontend (React): http://localhost:3001

## Credentials

username: ana_silva 

password: 123