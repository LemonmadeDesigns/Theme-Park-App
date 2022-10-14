

let newRide = { ride: null, id: null, park: null, rating: null };

// INPUT THAT DISPLAYS ON PAGE
let rides = [
  { park: "Final", id: 1, rating: 93, ride: "Check Point Project" },
  { park: "Final", id: 2, rating: 758, ride: "Exit Tickets" },
  { park: "Final", id: 3, rating: 89, ride: "Capstone Project" },
];

// // LOOP THROUGH EACH ROW USING ( for/in ) AND DISPLAYING RESULTS
// for (let i in rides) {
//   addRow(rides[i]);
// }

// |||||||||| EVENT LISTENERS STARTS |||||||||| //

// ONCE "ADD RIDE" BUTTON IS "clicked", FORM APPEARS
$("#add-ride").on("click", function () {
  console.log("Ride CLICKED")
  $(".form-wrapper").removeClass("hidden");
});

// CONSOLE LOGS THEME PARK NAME ON "change"
$("#park-name").on("change", function () {
  newRide.park = $(this).val();
    console.log("full testId is ", $(this).data("testid"));
  console.log(newRide);
});

// CONSOLE LOGS TYPE OF RIDE ON "keydown"
$("#ride-name").on("keyup", function () {
  newRide.ride = $(this).val();
  console.log(newRide);
});

// CONSOLE LOGS GRADE RESULTS ON "keyup"
$("#ride-rating").on("keyup", function () {
  newRide.rating = Number($(this).val());
  console.log(newRide);
});

// ON "click", IF NO NAME IS SELECTED, ALERT MODAL APPEARS
$("#create-ride").on("click", async function () {
  if (newRide.ride == null) {
    alert("No Ride Selected!");
  }

  // ELSE ADD THE ROW AND THE SET THE INPUT TO EMPTY VALUES
  else {
    const itemToAdd = { ...newRide, id: rides[rides.length - 1].id + 1 };
    // console.log("new ride");
    // console.table(newRide);

    // COMMENT OUT IF CODE DON'T WORK
    rides.push( itemToAdd );

    await fetch("/ride", {
      method: "POST",
      headers: new Headers({ "Content-type": "application/json" }),
      body: JSON.stringify(itemToAdd),
    });

    // ADD ROW AND LEAVE INPUT EMPTY
    addRow(itemToAdd);
    $("#park-name").val("");
    $("#ride-name").val("");
    $("#ride-rating").val("");

    // HIDE FORM AGAIN
    $(".form-wrapper").addClass("hidden");
  }
});

// |||||||||| EVENT LISTENERS ENDS |||||||||| //

// AND DISPLAY RESULTS
function addRow(obj) {
  let row = `<tr scope="row" id="${obj.id}-container">
                <td> ${obj.park} </td>  
                <td> ${obj.ride} </td>
                
                <td class="rating flexCenter" id="rating-${obj.id}" data-testid="edit-${obj.id}"> ${obj.rating} </td>
                <td>
                <button class="btn btn-sm btn-danger delete-button" 
                  data-testid="${obj.id}"
                  onclick={deleteTest}
                  id="delete-${obj.id}"> Delete 
                </button>

                <button class="btn btn-sm btn-info save-button" 
                  disabled
                  data-testid="${obj.id}" 
                  onclick={saveUpdate}
                  id="save-${obj.id}"> Save 
                </button>
                
                <button class="btn btn-sm btn-danger hidden cancel-button" 
                  data-testid="${obj.id}" 
                  onclick={cancelDeletion}
                  id="cancel-${obj.id}"> Cancel 
                </button>

                <button class="btn btn-sm btn-primary hidden confirm-button" 
                  data-testid="${obj.id}" 
                  onclick={confirmDeletion}
                  id="confirm-${obj.id}"> Confirm 
                </button>
              </td>
            </tr>`;

  // APPEND ROW TO TABLE
  $("#ride-table").append(row);

  // BINDING THE EVENT HANDLERS
  $(document).on("click", `button.delete-button`, deleteTest);
  $(document).on("click", `button.save-button`, saveUpdate);
  $(document).on("click", `button.confirm-button`, confirmDeletion);
  $(document).on("click", `button.cancel-button`, cancelDeletion);
  $(document).on("click", `td.rating`, editResult);

  // CALLING THE EVENT HANDLERS
  // $(`#delete-${obj.id}`).on("click", deleteTest);
  // $(`#save-${obj.id}`).on("click", saveUpdate);
  // $(`#confirm-${obj.id}`).on("click", confirmDeletion);
  // $(`#cancel-${obj.id}`).on("click", cancelDeletion);
  // $(`#result-${obj.id}`).on("click", editResult);
}

function editResult() {
  // USING DATA WITH OBJECT ID

  let fullTestid = $(this).attr("id");
  const testid = fullTestid.replace("rating-", "");
  console.log('testid ', testid)
  // set span to hidden
  $(this).children('span').css({"visibility": "hidden"})

  // set field to display none
  $(`#edit-${testid}`).css({ "visibility": "visible", color: "red" });

  // console.log(" el ", $(`#${testid}`));

  // UPDATE VALUE OF INPUT

  // UNBIND BAD BEHAVIOR BY EDIT FEATURE
  $(this).unbind();

  // UPDATED INPUT
  // $(this).html(`<input
  //                 type="number"
  //                 id="rating-${testid}"
  //                 class="rating form-control"
  //                 data-testid="edit-${testid}"
  //                 value="${inputValue}">`);
  
  // $(`#rating-${testid}`).on("keyup", function (e) {
  //   css({
  //     "display": "none"
  //   })    

  // });

  // ON "keyup" EVENT UNDISABLED
  $(`#edit-${testid}`).on("keyup", function () {

    let fullTestid = $(this).attr("id");
    const testid = fullTestid.replace("edit-", "");

    let saveBtn = $(`#save-${testid}`);
    saveBtn.prop("disabled", false);

    // $(this).css({ display: "block" });
  });
}

async function saveUpdate() {
  // USING DATA WITH OBJECT ID
  let fullTestid = $(this).data("testid");
  const testid = fullTestid.replace("save-", "");

  // let testid = $(this).data("testid");

  let saveBtn = $(`#save-${testid}`);
  let row = $(`.class-row-${testid}`);
  console.table(row);

  // WHICH RIDE ID IS SAVED
  console.log(`Ride ID#: ${testid}  Saved!`);
  console.log($(`#rating-${testid}`).html());

  // GRABBING VALUES AND UPDATES THE VALUE OF THE INPUT
  const newValue = $(`input#edit-${testid}`).val();

  // make input invisible
  $(`input#edit-${testid}`).css({"visibility": "hidden"});
  // make td visible again with new value
  // REMOVE .text(newValue) AND HAVE FRONTEND REFETCH DATA OR GET UPDATED DATA FROM BACKEN
  $(`#rating-${testid}`).children("span").text(newValue).css({ visibility: "visible" });

  // $(`#rating-${testid}`).html(
  //   `<td class="flexCenter" id="rating-${testid}" data-testid="${testid}"> ${newValue} </td>`
  // );
 
  await fetch(`/ride/${testid}`, {
    method: "PUT",
    headers: new Headers({ "Content-type": "application/json" }),
    body: JSON.stringify({rating: newValue}),
  });

  // DISABLES SAVE BUTTON
  saveBtn.prop("disabled", true);
  row.css("opacity", "0.5");

  // DISABLES THE INPUT AND SAVE BUTTON FOR 2 SECONDS
  setTimeout(function () {
    row.css("opacity", "1");
  }, 2000);
}

function deleteTest() {
  // USING DATA WITH OBJECT ID
  let fullTestid = $(this).data("testid");
  const testid = fullTestid.replace("delete-", "");

  // let testid = $(this).data("testid");


  // CREATING VARIABLE TO USE THE OBJECT BY IS ID
  let deleteBtn = $(`#delete-${testid}`);
  let saveBtn = $(`#save-${testid}`);
  let cancelBtn = $(`#cancel-${testid}`);
  let confirmBtn = $(`#confirm-${testid}`);

  // ADDING A CLASS SO THAT I CAN USE THE ATTRIBUTE
  deleteBtn.addClass("hidden");
  saveBtn.addClass("hidden");

  // REMOVING A CLASS SO THAT I CAN USE THE ATTRIBUTE
  cancelBtn.removeClass("hidden");
  confirmBtn.removeClass("hidden");
}

function cancelDeletion() {
  // USING DATA WITH OBJECT ID
  let fullTestid = $(this).data("testid");
  const testid = fullTestid.replace("cancel-", "");

  // let testid = $(this).data("testid");

  // CREATING VARIABLE TO USE THE OBJECT BY IS ID
  let deleteBtn = $(`#delete-${testid}`);
  let saveBtn = $(`#save-${testid}`);
  let cancelBtn = $(`#cancel-${testid}`);
  let confirmBtn = $(`#confirm-${testid}`);

  // REMOVING A CLASS SO THAT I CAN USE THE ATTRIBUTE
  deleteBtn.removeClass("hidden");
  saveBtn.removeClass("hidden");

  // ADDING A CLASS SO THAT I CAN USE THE ATTRIBUTE
  confirmBtn.addClass("hidden");
  cancelBtn.addClass("hidden");
}

function confirmDeletion() {
  // USING DATA WITH OBJECT ID
  let fullTestid = $(this).data("testid");
  const testid = fullTestid.replace("confirm-", "");

  // let testid = $(this).data("testid");

  console.log("confirm ", testid);

  // CONFIRMS DELETION
  let row = $(` #${testid}-container`);
  console.log(row);

  // REMOVE ROWS USING REMOVE METHOD
  fetch(`/ride/${testid}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  row.remove();
}

$(document).ready(() => {
  $(document).on("click", `button.delete-button`, deleteTest);
  $(document).on("click", `button.save-button`, saveUpdate);
  $(document).on("click", `button.confirm-button`, confirmDeletion);
  $(document).on("click", `button.cancel-button`, cancelDeletion);
  $(document).on("click", `td.rating`, editResult);
  console.log("Event Listeners attached");
});
