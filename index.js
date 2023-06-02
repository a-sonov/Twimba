import { tweetsData as initialTweetsData } from './data.js'
let tweetsData = initialTweetsData;
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

const storedTweetsData = localStorage.getItem('tweetsData');
if (storedTweetsData) {
    tweetsData = JSON.parse(storedTweetsData);
}

document.addEventListener('click', function(e){
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    }
    else if (e.target.dataset.delete) {
        handleDeleteClick(e.target.dataset.delete)
    }
})
 
function handleLikeClick(tweetId){ 
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    render()
}

function handleRetweetClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    render() 
}


// not working yet
function handleReplyClick(replyId) {
  const repliesContainer = document.getElementById(`replies-${replyId}`);
  const replyForm = document.createElement('form');
  replyForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const replyInput = e.target.elements.replyInput;
    const replyText = replyInput.value.trim();
    if (replyText !== '') {
      const targetTweetObj = tweetsData.find(function(tweet) {
        return tweet.uuid === replyId;
      });

      if (targetTweetObj) {
        const newReply = {
          handle: '@YourHandle',
          profilePic: 'images/default-profile-pic.png',
          tweetText: replyText,
          uuid: uuidv4()
        };

        targetTweetObj.replies.push(newReply);
        render();
      }
    }
    replyForm.remove();
  });

  const replyInput = document.createElement('input');
  replyInput.type = 'text';
  replyInput.name = 'replyInput';
  replyInput.placeholder = 'Your reply...';
  replyForm.appendChild(replyInput);

  const replyButton = document.createElement('button');
  replyButton.textContent = 'Reply';
  replyForm.appendChild(replyButton);

  repliesContainer.appendChild(replyForm);
  replyInput.focus();
}



function handleDeleteClick(tweetId) {
  const tweetIndex = tweetsData.findIndex(function(tweet) {
    return tweet.uuid === tweetId;
  });

  if (tweetIndex !== -1) {
    tweetsData.splice(tweetIndex, 1);
    render();
    localStorage.setItem('tweetsData', JSON.stringify(tweetsData)); 
  }
}

function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')

    if(tweetInput.value){
        tweetsData.unshift({
            handle: `@MyUser`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })
    render()
    tweetInput.value = ''
    }
    localStorage.setItem('tweetsData', JSON.stringify(tweetsData));

}

function getFeedHtml(){
    let feedHtml = ``
    
    tweetsData.forEach(function(tweet){
        
        let likeIconClass = ''
        
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        
        let retweetIconClass = ''
        
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }
        
        let repliesHtml = ''
        
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                repliesHtml+=`
<div class="tweet-reply">
    <div class="tweet-inner">
        <img src="${reply.profilePic}" class="profile-pic">
            <div>
                <p class="handle">${reply.handle}</p>
                <p class="tweet-text">${reply.tweetText}</p>
            </div>
        </div>
</div>
`
            })
        }
        
          
        feedHtml += `
<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                    ${tweet.retweets}
                </span>
                    <span class="tweet-detail">
                <i class="fa-solid fa-trash" data-delete="${tweet.uuid}"></i>
            </span>
            </div>   
        </div>            
    </div>
    <div class="hidden" id="replies-${tweet.uuid}">
        ${repliesHtml}
    </div>   
</div>
`
   })
   return feedHtml 
}

function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()
}

render()

