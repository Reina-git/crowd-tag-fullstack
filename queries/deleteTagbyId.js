const deleteTagById = `
DELETE FROM
tags
WHERE
id = ?;
`;

module.exports = deleteTagById;
