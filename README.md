
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
4. fin


How to do new migrations:
idk, but this is how I did it this time.

1. Make idle
2. make shell
3. python manage.py makemigrations
4. Manually copy the migration into the migrations directory
5. Rebuild

