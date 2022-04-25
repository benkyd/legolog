# Query

In order to quickly and accurately query my database for hand-written
searches, I need a way to perform a "fuzzy" search on the data at 
hand.

I had previously created a simple algorithm to search a database with
a basic posix regex filter and then rank them on the distance to the
input query, which was ordered based on Levenshtein Distance.

Keeping to the theme of querying a large, static data set for 
multiple known attributes (name, tags, id). I decided to stick with
the distance function for result relavency but lean into automatic
spell correction with an n-gram model, proposing to the controller,
"the most probable few alternate queries" that the user might have
meant, which can then be queried in the database to go through the
same relavancy distance sorting.

## What I diddn't have time for

My end goal was to create a gradient boosted decision tree which would
correct spelling based on a trained data set of word frequency, n-gram
modeling, distance between words and also a static dictionary. However
this proved out of scope.
