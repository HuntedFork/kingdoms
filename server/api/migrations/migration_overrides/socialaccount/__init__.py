# Social auth modifies a textfield into a json field, the process of which makes
# Cockroachdb throw a fit because it doesnt know how to convert a string to json
# Fair, but also bs we have to do this to fix it.

# To recreate the squashed migration:
# 1. go to the migrations directory /usr/local/lib/python3.11/site-packages/allauth/socialaccount/migrations
# 2. run python manage.py squashmigrations socialaccount <first> <last>
# 3. manually copy it over.
# 4. Mine is from 1-6. feel free to just copy in a seventh if they make one.