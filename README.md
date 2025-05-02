# What is this?
The repository for the public dominionkingdoms.net. A place to build, store, and discover new kingdoms to play in dominion.

## What is dominion? What is a kingdom?
Dominion is a board game by Donald X. Vaccarino. Inside a box of dominion is many different piles of cards. You play the game by choosing ten different piles and putting them in the center of the table, then taking turns purchasing cards until enough piles run out. 

Which piles of 10 cards you use is very impactful on how the game plays, and a 'kingdom' is a complete set of 10 cards.

You can try the game out for free at [dominion.games](dominion.games)

## What technology is this using?

* Nginx webserver
* Application Server is written in Django
* Authentication is managed by Django-allauth
* I use a mailjet integration for password resets/email confirmations.
* Postgres database backend hosted by Cockroach db
* Deployed as a GCP cloud run container. Scales to 0 when not in use. (If the website takes a few seconds to load at first that's whats happening.)
* New Relic monitoring of server/page/db error rates. Also usage rates.
* Single Page Web Application written in React
* Uses redux for small amounts of global state management
* Token based authentication
* Django admin page allows gui method of managing users

Please keep in mind that this is a solo developer project. Here are some problems I decided not to fix in order to ship more features:
* Test Coverage. (If I was more familiar with the tech I could have done some TDD to make my life easier, but I was learning a lot)
* Style Guide enforcement
* Typescript and python type hints were added later in development and their usage is not universal. 
* Deploys are currently a 2 button process. Would love continuous integration instead.
* I switched to functional react components midway through development. Class vs function components is inconsistent.


### Tips for Myself 

How to run migrations:
I never got the gcp container working so here's what I do:
1. Copy all the env variables from the gcp container
2. Write a new docker run command to stand up the container
3. Docker exec in and run make migrate.


Updating for new sets:
1. Run the card_scraping script (works as long as dominionwiki is updated and you dealt with any new wierdness)
2. Copy the new json file contents into cards.js
3. Delete the json file
4. Add your set to SETS in sets.js
4. Update the SetSymbol component
4. Deploy
5. Run the load cards script by going to /utility/loadcards and hit the button
6. test it worked by making a kingdom with the new card


How to do new migrations:
idk, but this is how I did it this time.

1. Make idle
2. make shell
3. python manage.py makemigrations
4. Manually copy the migration into the migrations directory
5. Rebuild

