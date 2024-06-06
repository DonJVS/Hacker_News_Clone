"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, showDeleteButton = true) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  const showStar = Boolean(currentUser);

  return $(`
      <li id="${story.storyId}">
        ${showStar ? addStarHTML(story, currentUser) : ''}
        ${showDeleteButton ? addDeleteButtonHTML() : ""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}


function putUserStoriesOnPage() {
  console.debug('putUserStoriesOnPage');

  $ownStories.empty();

  if (currentUser.ownStories.length === 0) {
    $mySubmittedStories.append("<h5>No stories added by user yet!</h5>");
  } else {
    // loop through all of users stories and generate HTML for them
    for (let story of currentUser.ownStories) {
      let $story = generateStoryMarkup(story, true);
      $mySubmittedStories.append($story);
    }
  }

  $mySubmittedStories.show();
}


async function submitNewStory(e) {
  console.debug("submitNewStory");
  e.preventDefault();
  const title = $('#create-title').val();
  const author = $('#create-author').val();
  const url = $('#create-url').val();
  const username = currentUser.username;
  const storyData = {title, url, author, username};

  const story = await storyList.addStory(username, storyData);

  const $storyAdd = generateStoryMarkup(story);

  $allStoriesList.prepend($storyAdd);

  $submitForm.slideUp("slow");
  $submitForm.trigger("reset");
}
$submitForm.on('submit', submitNewStory);


async function deleteStory(evt) {
  console.debug('deleteStory');
  const $closestLi = $(evt.target).closest('li');
  const storyId = $closestLi.attr('id');

  await storyList.removeStory(currentUser, storyId);
  await putStoriesOnPage();
}

$allStoriesList.on('click', '.remove', deleteStory);


function addDeleteButtonHTML() {
  return `
    <span class="remove">
      <i class="fas fa-trash-alt"></i>
    </span>`;
}


function addStarHTML(story, user) {
  const isFavorite = user.isFavorite(story);
  const starType = isFavorite ? "fas" : "far";
  return `
    <span class="star">
      <i class="${starType} fa-star"></i>
    </span>`;
}


function putFavoritesOnPage() {
  console.debug('putFavoritesOnPage');

  $favoriteStories.empty();

  if(currentUser.favorites.length === 0) {
    $favoriteStories.append('<h5>No favorites added yet</h5>');
  } else {
    for (let story of currentUser.favorites) {
      const $story = generateStoryMarkup(story);
      $favoriteStories.append($story);
    }
  }
  $favoriteStories.show();
}


async function toggleStoryFavorite(evt) {
  console.debug('toggleStoryFavorite');

  const $tgt = $(evt.target);
  const $closestLi = $tgt.closest('li');
  const storyId = $closestLi.attr('id');
  const story = storyList.stories.find(fav => fav.storyId === storyId);

  if ($tgt.hasClass('fas')) {
    await currentUser.removeFavorite(story);
    $tgt.closest('i').toggleClass('fas far');
  } else {
    await currentUser.addFavorite(story);
    $tgt.closest('i').toggleClass('fas far');
  }
}
$storiesList.on('click', '.star', toggleStoryFavorite);