"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}


function navSubmitClick(evt) {
  console.debug('navSubmitClick', evt);
  hidePageComponents();
  $allStoriesList.show();
  $submitForm.show();
}

$submitStory.on('click', navSubmitClick);

function myFavoritesClick(evt) {
  console.debug('myFavoritesClick', evt);
  hidePageComponents();
  putFavoritesOnPage();
}
$body.on('click', '#my-favorites', myFavoritesClick);

function myStories(evt) {
  console.debug('myStories',evt);
  hidePageComponents();
  putUserStoriesOnPage();
  $ownStories.show();
}
$body.on('click', '#my-stories', myStories);


function navProfileClick(evt) {
  console.debug("navProfileClick", evt);
  hidePageComponents();
  $userProfile.show();
}

$navUserProfile.on("click", navProfileClick);