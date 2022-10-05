let newClass = {name: null, id: null, exam: null, result: null}

// |||||||||| EVENT LISTENERS STARTS |||||||||| //

// ONCE "ADD CLASS" BUTTON IS "clicked", FORM APPEARS
$('#add-class').on('click', function () {
    $('.form-wrapper').removeClass('hidden')
})

// CONSOLE LOGS NAME ON "change"
$("#class-name").on("change", function () {
    newClass.name = $(this).val();
    console.log(newClass);
});

// CONSOLE LOGS TYPE OF EXAM ON "keydown"
$("#class-exam").on("keyup", function () {
    newClass.exam = $(this).val();
    console.log(newClass);
});

// CONSOLE LOGS GRADE RESULTS ON "keyup"
$('#class-result').on('keyup', function () {
    newClass.result = Number($(this).val());
    console.log(newClass);
});

// ON "click", IF NO NAME IS SELECTED, ALERT MODAL APPEARS
$('#create-class').on('click', async function () {
    if (newClass.name == null) {
        alert('No Class Selected!')
    }

    // ELSE ADD THE ROW AND THE SET THE INPUT TO EMPTY VALUES
    else {
        const itemToAdd = {...newClass};
        console.log('new class')
        console.table(newClass)
        // classes.push( itemToAdd );

        await fetch('/class', {
            method: 'POST',
            headers: new Headers({'Content-type': 'application/json'}),
            body: JSON.stringify(itemToAdd)
        })

        // ADD ROW AND LEAVE INPUT EMPTY
        addRow(itemToAdd)
        $('#class-name').val('')
        $('#class-exam').val('')
        $('#class-result').val('')

        // HIDE FORM AGAIN
        $('.form-wrapper').addClass('hidden')
    }
});

// |||||||||| EVENT LISTENERS ENDS |||||||||| //

// AND DISPLAY RESULTS
function addRow(obj) {
    let row = `<tr scope="row" id="${obj.id}-container">
              <td> ${obj.name} </td>
              <td> ${obj.exam} </td>
              <td class="result flexCenter" id="result-${obj.id}" data-testid="edit-${obj.id}"> ${obj.result} </td>
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
    $('#class-table').append(row)

    // BINDING THE EVENT HANDLERS
    $(document).on('click', `button.delete-button`, deleteTest)
    $(document).on('click', `button.save-button`, saveUpdate)
    $(document).on('click', `button.confirm-button`, confirmDeletion)
    $(document).on('click', `button.cancel-button`, cancelDeletion)
    $(document).on('click', `td.result`, editResult)
}


function editResult() {
    // USING DATA WITH OBJECT ID
    let fullTestid = $(this).data("testid");
    const testid = $(this).id.replace('result-', '')
    const value = $(`#result-${testid}`).val();
    console.log('val ', value)
    console.log('editing result')
    // UPDATE VALUE OF INPUT

    // UNBIND BAD BEHAVIOR BY EDIT FEATURE
    $(this).unbind()

    // UPDATED INPUT
    $(this).html(`<input 
                  type="number"
                  id="result-${testid}"
                  class="result form-control"
                  data-testid="edit-${testid}"
                  value="${value}">`);

    // ON "keyup" EVENT UNDISABLED
    $(`.result`).on('keyup', function () {
        let testid = $(this).data('testid')

        let saveBtn = $(`#save-${testid}`)
        saveBtn.prop('disabled', false)
    });

}

function saveUpdate() {

    // USING DATA WITH OBJECT ID
    let fullTestid = $(this).data("testid");
    const testid = fullTestid.replace('save-', '')

    let saveBtn = $(`#save-${testid}`);
    let row = $(`.class-row-${testid}`);
    console.table(row)

    // WHICH CLASS ID IS SAVED
    console.log(`Class ID#: ${testid}  Saved!`);
    console.log($(`#result-${testid}`).html())

    // GRABBING VALUES AND UPDATES THE VALUE OF THE INPUT
    const newValue = $(`input#result-${testid}`).val();
    $(`#result-${testid}`).html(
        `<td class="flexCenter" id="result-${testid}" data-testid="${testid}"> ${newValue} </td>`
    );

    // DISABLES SAVE BUTTON
    saveBtn.prop('disabled', true)
    row.css('opacity', '0.5')

    // DISABLES THE INPUT AND SAVE BUTTON FOR 2 SECONDS
    setTimeout(function () {
        row.css('opacity', '1')
    }, 2000)
}

function deleteTest() {
    // USING DATA WITH OBJECT ID
    let fullTestid = $(this).data("testid");
    const testid = fullTestid.replace('delete-', '')

    // CREATING VARIABLE TO USE THE OBJECT BY IS ID
    let saveBtn = $(`#save-${testid}`);
    let cancelBtn = $(`#cancel-${testid}`);
    let confirmBtn = $(`#confirm-${testid}`);

    // ADDING A CLASS SO THAT I CAN USE THE ATTRIBUTE
    $(this).addClass('hidden');
    saveBtn.addClass('hidden');

    // REMOVING A CLASS SO THAT I CAN USE THE ATTRIBUTE
    cancelBtn.removeClass('hidden');
    confirmBtn.removeClass('hidden');
}

function cancelDeletion() {
    // USING DATA WITH OBJECT ID
    let fullTestid = $(this).data("testid");
    const testid = fullTestid.replace('cancel-', '')

    // CREATING VARIABLE TO USE THE OBJECT BY IS ID
    let deleteBtn = $(`#delete-${testid}`);
    let saveBtn = $(`#save-${testid}`);
    let cancelBtn = $(`#cancel-${testid}`);
    let confirmBtn = $(`#confirm-${testid}`);

    // REMOVING A CLASS SO THAT I CAN USE THE ATTRIBUTE
    deleteBtn.removeClass('hidden');
    saveBtn.removeClass('hidden');

    // ADDING A CLASS SO THAT I CAN USE THE ATTRIBUTE
    confirmBtn.addClass('hidden');
    cancelBtn.addClass('hidden');
}

function confirmDeletion() {
    // USING DATA WITH OBJECT ID
    let fullTestid = $(this).data("testid");
    const testid = fullTestid.replace('confirm-', '')
    console.log('confirm ', testid)

    // CONFIRMS DELETION
    let row = $(`#${testid}-container`)
    console.log(row)

    // REMOVE ROWS USING REMOVE METHOD
    fetch(`/class/${testid}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    row.remove()
}


$(document).ready(() => {
    $(document).on('click', `.delete-button`, deleteTest)
    $(document).on('click', `button.save-button`, saveUpdate)
    $(document).on('click', `button.confirm-button`, confirmDeletion)
    $(document).on('click', `button.cancel-button`, cancelDeletion)
    $(document).on('click', `td.result`, editResult)
    console.log('Event Listeners attahced')
})
