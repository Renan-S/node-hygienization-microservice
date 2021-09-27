# Node hygienization microservice
Simple NodeJs hygienization service that gets an specific input, then clean, validate and save it on a Postgres DB

## What this project does?
   Send a specific txt/csv (organized by spaces) file through HTTP request and see it being cleaned and saved on a postgreSQL data base! All of this running on Docker containers

## Important observations:

1. The data base relational structure is handled by TypeORM. On ormconfig.json all the entities are created based on the path you provide at "entities" property

## Dependencies:

1. NPM
2. Docker
3. Docker-compose

## Steps to run this project:

1. Run `npm i && docker-compose up -d` command to install dependencies and run the project on backgroud
2. Wait for Docker to create the containers, then open http://localhost:3000/ on your browser
3. Choose your txt/csv file (I've left the example base_text.txt file on the root of this project) and click on Submit button
4. Wait a little until the file is processed and saved. Alternatively, if you run `docker-compose up` instead of the detached mode, there should be a log telling when saving has ended, and how much time it took.
5. Run `docker exec -it postgreSQL-base-db psql -U admin base-db` command to connect to PostgreSQL
6. Run `SELECT * FROM "user_buy_profile" LIMIT 100;` to list the user_buy_profile table and change the LIMIT if you want to see more/less values, or `TABLE "user_buy_profile";` if you are feeling courageous.
7. To quit using PostgreSQL CLI, use \q. This should take you out from the entire container
8. If you are navigation through the 3 separate functionalities, remeber to clean Docker project images and containers. Sometimes there is conflict beetween builds
