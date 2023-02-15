export const sendToAdminEmailLeave = (firstName, lastName, fromDate, toDate) => `<p>${firstName} ${lastName} requested leave(s) from ${fromDate} to ${toDate}</p>`

export const sendToUserEmailLeave = (firstName, lastName, fromDate, toDate, leaveStatus) => `<p>Hello ${firstName} ${lastName}, your leave(s) request from ${fromDate} to ${toDate} has been ${leaveStatus}</p>`

export const sendToAdminEmailAttendance = (firstName, lastName, fromDate, toDate) => `<p>${firstName} ${lastName} requested attendance(s) from ${fromDate} to ${toDate}</p>`

export const sendToUserEmailAttendance = (firstName, lastName, fromDate, toDate, attendanceStatus) => `<p>Hello ${firstName} ${lastName}, your attendance(s) request from ${fromDate} to ${toDate} has been ${attendanceStatus}</p>`
