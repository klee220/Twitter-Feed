// specify a url, in this case our web server
/*
const url = "http://twitterfeedserverrails-env.eba-xmqy8ybh.us-east-1.elasticbeanstalk.com/feed/random?q=weather"
fetch(url)
    .then(res => res.json()) .then(data => {  
    // do something with data
})
.catch(err => {
    // error catching
console.log(err) }) 
*/

// duplicates
let tweetIDs = new Set();

// Search function
let searchString = "" // here we use a global variable
var clearedSearch = false;
var searched = false;

const handleSearch = event => {
  searchString = event.target.value.trim().toLowerCase();
  if (searchString == ""){  // set bool if an empty string is entered in search bar (clear search)
    clearedSearch = true;
  }
  else{
    clearedSearch = false;
    searched = true;
  }

  // immediately updates feed
  if (clearedSearch == true || searched == true){
    document.getElementById("tweet-container").innerHTML = "";

    const tweetContainer = document.getElementById("tweet-container");
    const tweetList = document.createElement("div");

    tweetContainer.appendChild(tweetList);
    const filteredResult = masterList.filter(tweet => tweet.text.toLowerCase().includes(searchString));  // filter tweets based on search
    var filteredMasterList = new Array();

    for (var i = 0; i < filteredResult.length; i++){
      filteredMasterList.push(filteredResult[i]);  // add to filtered tweets array
    }

    // sort by date
    const filteredSorted = filteredMasterList.sort((a, b) => (a.created_at > b.created_at) ? -1 : ((a.created_at < b.created_at) ? 1 : 0));

    let index = 0;
    
    // prints tweets 
    while (index < filteredSorted.length){
      // create a container for individual tweet
      const tweet = document.createElement("div");

      tweet.className = "item";
      var tweetContent = document.createElement("p");
      var tweetProfilePhoto = document.createElement("img");
      tweetProfilePhoto.src = filteredSorted[index].user.profile_image_url_https;
      var tweetUserName = document.createElement("b");
      tweetUserName.className = "text";
      if (filteredSorted[index].user.name.length > 25) {
        filteredSorted[index].user.name = filteredSorted[index].user.name.slice(0,22) + "...";
      }

      tweetUserName.innerHTML = filteredSorted[index].user.name;
      var tweetTag = document.createElement("span");
      tweetTag.className = "tag";
      tweetTag.innerHTML = " @" + filteredSorted[index].user.screen_name + " " + date(filteredSorted[index].created_at) + "<br>";
      var tweetText = document.createElement("span");
      tweetText.className = "tweetBody";
      tweetText.innerHTML = filteredSorted[index].text;
      // append the text node to the div
      tweetContent.appendChild(tweetProfilePhoto);
      tweetContent.appendChild(tweetUserName);
      tweetContent.appendChild(tweetTag);
      tweetContent.appendChild(tweetText);

      tweet.appendChild(tweetContent);
      // finally append your tweet into the tweet list
      tweetList.appendChild(tweet);

      index++; 
    }
  }
}

// refreshes tweet feed every 5 seconds
var interval;

interval = setInterval(setInt, 5000);

function setInt() {
  var paused = document.getElementById("pauseBox").checked;

  if (paused == false) {
    fetch('http://ec2-54-219-224-129.us-west-1.compute.amazonaws.com:2000/feed/random?q=weather')
    .then(response => response.json())
    .then(data => {
      console.log(data); 
      //document.getElementById("test").innerHTML = data.statuses[0].user.name
      refreshTweets(data.statuses);
    });
  }
}

// format date
function date(tweetDate){
  var monthName = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];  
  cur_date = new Date(tweetDate);
  
  var day = cur_date.getDate();
  var month = monthName[cur_date.getMonth()]; // change number to month name
  //var year = cur_date.getFullYear();
  var hour = cur_date.getHours();
  var mins = cur_date.getMinutes();
  let time = "AM";

  if (hour == 0){
    hour = 12;
  }

  if (hour == 12){
    time = "PM";
  }

  if (hour > 12){
    hour = hour % 12;
    time = "PM";
  }

  var datePosted = month + " " + day + " " /* + year + " " */ + hour + ":" + mins + time;
  return datePosted;
}


/**
* Removes all existing tweets from tweetList and then append all tweets back in
*
* @param {Array<Object>} tweets - A list of tweets
* @returns None, the tweets will be renewed
*/

let unfilteredResult = new Array();
let unfilteredLength = 0;
let masterList = new Array();
let masterListLength = 0;
//let filteredMasterList = new Array();
//let filteredMasterListLength = 0;

function refreshTweets(tweets) {
  document.getElementById("tweet-container").innerHTML = "";

  const tweetContainer = document.getElementById("tweet-container");
  
  //get IDs, put them in set if they don't already exist in the set
  var it = 0;
  while (it < tweets.length) {
    if (!tweetIDs.has(tweets[it].id)) {
      tweetIDs.add(tweets[it].id);
    }
    else {
      tweets.splice(it,1);
    }
    it++;
  }

  // feel free to use a more complicated heuristics like in-place-patch, for simplicity, we will clear all tweets and append all tweets back
  // {@link https://stackoverflow.com/questions/3955229/remove-all-child-elements-of-a-dom-node-in-javascript}
  //while (tweetContainer.firstChild) {
  //    tweetContainer.removeChild(tweetContainer.firstChild);
  //}

  // create an unordered list to hold the tweets
  // {@link https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement}
  const tweetList = document.createElement("div");
  // append the tweetList to the tweetContainer
  // {@link https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild}
  tweetContainer.appendChild(tweetList);

  // all tweet objects (no duplicates) stored in tweets variable
  // filter on search text
  // {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter}

  //const filteredResult = tweets.filter(tweet => tweet.text.toLowerCase().includes(searchString));  // filter tweets based on search

  masterListLength = masterListLength + tweets.length;

  for (var i = 0; i < tweets.length; i++){
    masterList.push(tweets[i]);  // add to unfiltered tweets array
  }

  //filteredMasterListLength = filteredMasterListLength + filteredResult.length;
  const filteredResult = masterList.filter(tweet => tweet.text.toLowerCase().includes(searchString));  // filter tweets based on search

  var filteredMasterList = new Array();

  for (var i = 0; i < filteredResult.length; i++){
    filteredMasterList.push(filteredResult[i]);  // add to filtered tweets array
  }

  // sort by date
  // {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort}

  const sortedResult = masterList.sort((a, b) => (a.created_at > b.created_at) ? -1 : ((a.created_at < b.created_at) ? 1 : 0));
  const filteredSorted = filteredMasterList.sort((a, b) => (a.created_at > b.created_at) ? -1 : ((a.created_at < b.created_at) ? 1 : 0));

  // execute the arrow function for each tweet
  // {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach}
  let index = 0;
  
  // prints tweets 
  if (clearedSearch == false && searched == true){
    while (index < filteredSorted.length){
      // create a container for individual tweet
      const tweet = document.createElement("div");
      tweet.className = "item";
      var tweetContent = document.createElement("p");
      var tweetProfilePhoto = document.createElement("img");
      tweetProfilePhoto.src = filteredSorted[index].user.profile_image_url_https;
      var tweetUserName = document.createElement("b");
      tweetUserName.className = "text";
      if (filteredSorted[index].user.name.length > 25) {
        filteredSorted[index].user.name = filteredSorted[index].user.name.slice(0,22) + "...";
      }
      tweetUserName.innerHTML = filteredSorted[index].user.name;
      var tweetTag = document.createElement("span");
      tweetTag.className = "tag";
      tweetTag.innerHTML = " @" + filteredSorted[index].user.screen_name + " " + date(filteredSorted[index].created_at) + "<br>";
      var tweetText = document.createElement("span");
      tweetText.className = "tweetBody";
      tweetText.innerHTML = filteredSorted[index].text;
      // create a text node "safely" with HTML characters escaped
      // {@link https://developer.mozilla.org/en-US/docs/Web/API/Document/createTextNode}
      //const tweetText = document.createTextNode(tweets[0].text);
      // append the text node to the div
      tweetContent.appendChild(tweetProfilePhoto);
      tweetContent.appendChild(tweetUserName);
      tweetContent.appendChild(tweetTag);
      tweetContent.appendChild(tweetText);

      // you may want to put more stuff here like time, username...
      tweet.appendChild(tweetContent);
      // finally append your tweet into the tweet list
      tweetList.appendChild(tweet);

      index++; 
    }
  }
  else {
    if (clearedSearch == true){
      clearedSearch = false;
    }
    while (index < sortedResult.length){
      // create a container for individual tweet
      const tweet = document.createElement("div");
      tweet.className = "item";
      var tweetContent = document.createElement("p");
      var tweetProfilePhoto = document.createElement("img");
      tweetProfilePhoto.src = sortedResult[index].user.profile_image_url_https;
      var tweetUserName = document.createElement("b");
      tweetUserName.className = "text";
      if (sortedResult[index].user.name.length > 25) {
        sortedResult[index].user.name = sortedResult[index].user.name.slice(0,22) + "...";
      }
      tweetUserName.innerHTML = sortedResult[index].user.name;
      var tweetTag = document.createElement("span");
      tweetTag.className = "tag";
      tweetTag.innerHTML = " @" + sortedResult[index].user.screen_name + " " + date(sortedResult[index].created_at) + "<br>";
      var tweetText = document.createElement("span");
      tweetText.className = "tweetBody";
      tweetText.innerHTML = sortedResult[index].text;
      // create a text node "safely" with HTML characters escaped
      // {@link https://developer.mozilla.org/en-US/docs/Web/API/Document/createTextNode}
      //const tweetText = document.createTextNode(tweets[0].text);
      // append the text node to the div
      tweetContent.appendChild(tweetProfilePhoto);
      tweetContent.appendChild(tweetUserName);
      tweetContent.appendChild(tweetTag);
      tweetContent.appendChild(tweetText);

      // you may want to put more stuff here like time, username...
      tweet.appendChild(tweetContent);
      // finally append your tweet into the tweet list
      tweetList.appendChild(tweet);

      index++; 
    }
  }
}    