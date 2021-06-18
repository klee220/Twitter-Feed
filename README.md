# CS110Lab3

**Search:**
This was implemented using an onsearch event, which means that it calls handleSearch when an input is put into the search bar and "enter" is pressed. handleSearch makes the searchString all lowercase. Then, we use the filter function to filter out the tweets in the master list whose text match the search criteria. We do this by taking converting each tweet's text to lowercase to compare it to the searchString. We then get those tweets, and sort and display it. When polling is on, only new tweets that match the search criteria appear every 5 seconds. We do this through the refresh function. The refresh function implements the search function the same way as in the handlSearch function. 

When the search is cleared, such as when the user erases their input and presses "enter", all the tweets that did not match the search criteria show up. This is done by displaying the master list, which stores each tweet, minus duplicates, in an array across all refreshes. 

**Sorting:**
The tweets have the dates shown in a readable format through the date function in which a date constructor is used for each tweet's date. Then, the month, day, and time are obtained and put into a string, which is then shown in the tweet. The sorting is done with the sort() method using the created_at element of the tweet, so that the newer tweets are put before the older ones. 

**Displaying the Tweets:**
We display the tweets using a tweet container. We then append a tweet list to the tweet container. For each tweet, we create a container to which we append elements such as profile picture, username, tag, and text. Then, we append the tweet to the tweet list to display it. If there is a string that is searched, then we display the sorted filtered tweets. If there is no string searched, or the search is cleared, then we display the sorted master list of tweets. 

**Removing Duplicates:**
If a new tweet is found to have the same unique tweet ID as a previous post, then it will not be included in the new set of tweets being published to the feed. To determine whether there is a duplicate, we have a created a set of tweet IDs. Sets do not allow duplicates and we use the ".has()" operation on the tweetIDs set to check if a tweet ID already exists. if it returns true, then we splice the incoming tweets array to not include that tweet.

**Pausing and Unpausing the Feed:**
In order to pause and unpause the feed, we use a boolean variable called "paused". If paused is true, then we do not want the feed to continue updating. However, once SetInterval is already running, there is no way to stop it. To get around this, we encapsulate the fetch and refreshTweets function call within a funciton called setInt(). setInterval calls the setInt() funciton every 5 seconds, but the function will only run the fetch and refreshTweets functions if paused is false. A checkbox is used to manipulate the paused variable via user input.
