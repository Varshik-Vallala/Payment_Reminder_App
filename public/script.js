// const reminderMsg = document.getElementById("reminderMsg").value;
// const remindAt = document.getElementById("remindAt").value;
// const reminderBtn = document.getElementById("reminderBtn");
// const reminderList = document.getElementById("reminderList");

// document.addEventListener("DOMContentLoaded", () => {
//     loadReminders();
//     reminderBtn.addEventListener("click", addReminder);
// })

// function addReminder() {
//     console.log(remindAt);
    
//     // const formattedRemindAt = remindAt.replace("T", " ");

//     // const remindAtDate = new Date(formattedRemindAt);
  
//     // console.log(formattedRemindAt, remindAtDate,remindAtDate.toISOString() );
//     // remindAtDate <= new Date()

//     if(reminderMsg === " " || remindAt === " " ) {
//         alert("Please enter a valid reminder message and future date.");
//         return;
//     }

    

//     const reminderData = {
//         reminderMsg: reminderMsg,
//         // remindAt: remindAtDate.toISOString(),
//     }

//     fetch("/addReminder", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//             },
//             body: JSON.stringify(reminderData),
//     })
//     .then((response) => response.json())
//     .then((data) => {
//         console.log("Reminder added successfully:", data);
//         loadReminders();
//     })
//     .catch((error) => {
//         console.log("Error adding reminder:", error);
//     });
// }

// function loadReminders() {
//     fetch("/getAllReminder")
//     .then((response) => response.json())
//     .then((data) => {
//         console.log(typeof(data), data);
//         reminderList.innerHTML = "<h2>Reminder List</h2>";
//         data.reminders.map((reminder) => {
//             const paragraph = document.createElement("p");
//             paragraph.textContent = `${reminder.reminderMsg} - ${new Date(reminder.remindAt).toLocaleString()}`;
//             reminderList.appendChild(paragraph);
//         });
//     })
//     .catch((error) => {
//         console.log("Error loading reminders:", error)
//     });
// }

document.addEventListener('DOMContentLoaded', function () {
    loadReminders();
    
    document.getElementById('addReminderBtn').addEventListener('click', addReminder);
    });
    
    function addReminder() {
    const reminderMsgInput = document.getElementById('reminderMsg');
    const remindAtInput = document.getElementById('remindAt');
    
    const reminderMsg = reminderMsgInput.value.trim();
    const remindAt = remindAtInput.value.trim().replace('T', ' ');
    
    if (!reminderMsg || !remindAt || new Date(remindAt) <= new Date()) {
    alert('Please enter a valid reminder message and future date/time.');
    return;
    }
    
    const data = {
    reminderMsg,
    remindAt,
    };
    
    fetch('/addReminder', {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    })
    .then((response) => response.json())
    .then((result) => {
    console.log('Reminder added successfully:', result);
    loadReminders();
    })
    .catch((error) => {
    console.error('Error adding reminder:', error);
    alert('Error adding reminder. Please try again.');
    });
    }
    
    function loadReminders() {
    fetch('/getAllReminder')
    .then((response) => response.json())
    .then((data) => {
    const reminderList = document.getElementById('reminderList');
    reminderList.innerHTML = '<h2>Reminder List</h2>';
    console.log(data);
    data.reminders.forEach((reminder) => {
    const paragraph = document.createElement('p');
    paragraph.textContent = `${reminder.reminderMsg} - ${new Date(reminder.remindAt).toLocaleString()}`;
    reminderList.appendChild(paragraph);
    });
    
    console.log('Reminders loaded successfully:', data);
    })
    .catch((error) => {
    console.error('Error loading reminders:', error);
    });
    }