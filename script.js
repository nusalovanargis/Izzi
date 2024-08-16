function getSelectedFilters() {
  const supervisorsCheckbox = document.getElementById("supervisorsCheckbox");
  const eliteTaskerCheckbox = document.getElementById("eliteTaskerCheckbox");

  const filters = [];

  if (supervisorsCheckbox && supervisorsCheckbox.checked) {
    filters.push("supervisor");
  }
  if (eliteTaskerCheckbox && eliteTaskerCheckbox.checked) {
    filters.push("elite");
  }

  return filters;
}

function getStars(rating) {
  let stars = "";
  for (let i = 1; i <= 5; i++) {
    stars +=
      i <= rating
        ? '<span class="fa fa-star checked"></span>'
        : '<span class="fa fa-star"></span>';
  }
  return stars;
}

async function getTaskers() {
  try {
    const response = await fetch("./data/allProsData.json");
    const data = await response.json();
    const taskers = data.data.taskers;
    const sectionTwoUser = document.querySelector(".section-two-user");

    sectionTwoUser.innerHTML = "";

    const filters = getSelectedFilters();

    let filteredTaskers = taskers.filter((tasker) => {
      if (filters.length === 0) return true;

      if (filters.includes("supervisor") && filters.includes("elite")) {
        return tasker.supervisor && tasker.eliteTasker;
      }

      return (
        (filters.includes("supervisor") && tasker.supervisor) ||
        (filters.includes("elite") && tasker.eliteTasker)
      );
    });

    const ratingSortOrder = document.getElementById("ratingSort").value;
    const tasksSortOrder = document.getElementById("tasksSort").value;

    filteredTaskers = filteredTaskers.sort((a, b) => {
      if (ratingSortOrder === "ascending") {
        if (a.averageRating !== b.averageRating) {
          return a.averageRating - b.averageRating;
        }
      } else {
        if (a.averageRating !== b.averageRating) {
          return b.averageRating - a.averageRating;
        }
      }

      if (tasksSortOrder === "ascending") {
        return a.completedTasks - b.completedTasks;
      } else {
        return b.completedTasks - a.completedTasks;
      }
    });

    filteredTaskers.forEach((tasker) => {
      const taskerCard = `
        <div class="card">
          <div class="card-profile">
            <div class="card-profile-img">
              <img src="${tasker.user.profile_picture.publicUrl}" alt="${
        tasker.user.name
      }" />
            </div>
            <div>
              <span><span class="card-profile-name">${tasker.user.name} ${
        tasker.user.surname
      }</span> (${tasker.user.name.toLowerCase()})</span>
              <div>
                ${getStars(tasker.averageRating)}
              </div>
            </div>
          </div>
          <div class="card-sec">
            <div class="sec">
              <img src="./assets/check.png" alt="check" />
              <span>${tasker.completedTasks} Tasks</span>
            </div>
            <div class="sec">
              <img src="./assets/hashtag.svg" alt="check" />
              <span>${tasker.completedTasks} Tasks</span>
            </div>
            <div class="sec">
              <img src="./assets/heart.svg" alt="check" />
              <span>${tasker.completedTasks} Tasks</span>
            </div>
          </div>
          <div class="sec-title">
            <p>${tasker.bio}</p>
          </div>
          <div class="sec-bottom">
            <a href="#">view profile</a>
            <div class="sec-bottom-amount">
              <div class="sec-bottom-amount-value">$35</div>
              <button class="sec-bottom-amount-btn">Book Now</button>
            </div>
          </div>
        </div>
      `;

      sectionTwoUser.innerHTML += taskerCard;
    });
  } catch (error) {
    console.error("Error loading the JSON:", error);
  }
}

document.getElementById("ratingSort").addEventListener("change", getTaskers);
document.getElementById("tasksSort").addEventListener("change", getTaskers);
document
  .getElementById("supervisorsCheckbox")
  .addEventListener("change", getTaskers);
document
  .getElementById("eliteTaskerCheckbox")
  .addEventListener("change", getTaskers);

getTaskers();
