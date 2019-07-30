/** Handles dropdown checkboxes **/
function showCheckboxOptions(div) {
  checkBoxContainer = div.parentNode.getElementsByClassName("select-contents")[0]
  if (checkBoxContainer.style.display == "none") {
    checkBoxContainer.style.display = "block";
  } else {
    checkBoxContainer.style.display = "none";
  }
}

/** Fetches users and adds them to the page. */
function loadUsers(){
  var params = ``;

  // get topic params
  var topicParams = checkboxesToList(document.getElementById("topic"));

  // get timezone params
  const startTime = document.getElementById("timezone").getElementsByTagName("input")[0].value;
  const endTime = document.getElementById("timezone").getElementsByTagName("input")[1].value;
  var timezoneParams = [];
  for (var i=startTime; i<=endTime; i++) {
    timezoneParams.push(i);
  }

  // get studypace params
  const startPace = document.getElementById("studypace").getElementsByTagName("input")[0].value;
  const endPace = document.getElementById("studypace").getElementsByTagName("input")[1].value;
  var studypaceParams = [];
  for (var i=startPace; i<=endPace; i++) {
    studypaceParams.push(i);
  }
  params = `topic=${topicParams}&timezone=${timezoneParams}&studypace=${studypaceParams}`;

  // fetch user list based on params
  const url = '/user-list?' + params;
  fetch(url).then((response) => {
    return response.json();
  }).then((users) => {
    const list = document.getElementById('list');
    list.innerHTML = '';

    // build UI
    users.forEach((user) => {
     const userListItem = buildUserListItem(user);
     list.appendChild(userListItem);
   });
  });

}

/** Helper: returns list of checked checkbox items **/
function checkboxesToList(paramDiv){
  var selectedOptions = [];
  const selectDivs = Array.from(paramDiv.getElementsByTagName("input"));

  selectDivs.forEach(function(checkbox) {
    if (checkbox.checked) {
      selectedOptions.push(checkbox.value)
    }
  });
  return(selectedOptions);
}

/**
 * Builds a list element that contains a link to a user page, e.g.
 * <li><a href="/user-page.html?user=test@example.com">test@example.com</a></li>
 */
function buildUserListItem(user){
  // build div
  const userDiv = document.createElement('div');
  const userLink = document.createElement('a');
  userLink.setAttribute('href', '/user-page.html?user=' + user.email);
  userDiv.appendChild(userLink)
  userDiv.className = "user_card";
  const pictureDiv = document.createElement('div');
  pictureDiv.className = "user_card-picture";
  userLink.appendChild(pictureDiv);
  const contentDiv = document.createElement('div');
  contentDiv.className = "user_card-content";
  userLink.appendChild(contentDiv);

  // add profile pic
  const profilePic = document.createElement('img');
  const picUrl = user.imageUrl || "profilepic.png";
  profilePic.setAttribute("id","profilepic");
  profilePic.setAttribute("src", picUrl);
  profilePic.setAttribute("alt","Profile Picture");
  profilePic.setAttribute("class","profilepic");
  pictureDiv.appendChild(profilePic);

  // add profile name
  const nameElem = document.createElement('h3');
  const userName = user.nickName || user.email;
  nameElem.appendChild(document.createTextNode(userName));
  contentDiv.appendChild(nameElem)

  // build chat form
  const chatForm = document.createElement("form");
  chatForm.setAttribute("method","post");
  chatForm.setAttribute("action","/chat");

  // add selectedUser input
  const selectedUser = document.createElement("input"); //input element, Submit button
  selectedUser.setAttribute('name',"selectedUser");
  selectedUser.setAttribute('type',"hidden");
  selectedUser.setAttribute('value',user.email);

  // build chat button
  const chatButton = document.createElement("input");
  chatButton.setAttribute('type',"submit");
  chatButton.setAttribute('value',"Chat with Me!");
  //chatButton.classList.add("submit-button");
  //chatButton.classList.add("chat-with-me");
  chatButton.classList.add("user_card-chat_button");


  chatForm.appendChild(selectedUser);
  chatForm.appendChild(chatButton);
  contentDiv.appendChild(chatForm);

  return userDiv
}

/** Fetches data and populates the UI of the page. */
function buildUI(){
  loadUsers();
}
