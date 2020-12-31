const selectUserById = `
    SELECT
        id, email, created_at, institution_name
    FROM
        users
    WHERE
        id = ?
    LIMIT 1;
    `;
module.exports = selectUserById;
