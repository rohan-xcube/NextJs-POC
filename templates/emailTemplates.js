export const sendToAdminEmail = (firstName, lastName, fromDate, toDate) => `<p>${firstName} ${lastName} requested leave(s) from ${fromDate} to ${toDate}</p>`

export const sendToUserEmail = (firstName, lastName, fromDate, toDate, leaveStatus) => `<p>Hello ${firstName} ${lastName}, your leave(s) from ${fromDate} to ${toDate} has been ${leaveStatus}</p>`
