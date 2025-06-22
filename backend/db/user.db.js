import db from "../config/db.js";
const { query, closeConnection } = db;
class UserDB {
  getAllUsers = async () => {
    const { rows } = await query("SELECT * FROM users");
    return rows;
  };

  createUser = async (username, email, password_hash) => {
    const { rows } = await query(
      `INSERT INTO users(username , email , password_hash) 
                    VALUES ($1 , $2 , $3)
                    RETURNING 
                    *`,
      [username, email, password_hash]
    );
    //create role for user...(by default regular)
    console.log(rows)
    await query(`INSERT INTO player_stats(user_id) VALUES ($1)`, [rows[0].user_id])
    return rows;
  };

  getUserByID = async (user_id) => {
    const { rows } = await query("SELECT * FROM users WHERE user_id = $1", [
      user_id,
    ]);
    return rows;
  };

  getUserByUserName = async (username) => {
    const { rows } = await query(`SELECT * FROM users WHERE username = $1`, [
      username
    ]);
    return rows;
  };

  getUserByEmail = async (email) => {
    const { rows } = await query(`SELECT * FROM users WHERE email = $1`, [
      email,
    ]);
    return rows;
  };

  deleteUserByID = async (user_id) => {
    const { rows } = await query(
      `DELETE FROM users WHERE user_id=$1 RETURNING *`,
      [user_id]
    );
    return rows;
  };

  checkUserExists = async (email, username) => {
    const { rows } = await query(
      `SELECT * FROM users 
                                    WHERE username = $1 AND email = $2`,
      [username, email]
    );
    return rows.length != 0;
  };

  blockUser = async (user_id) => {
    const { rows } = await query(
      `UPDATE users SET is_blocked = TRUE 
                                    WHERE user_id = $1 
                                    RETURNING *`,
      [user_id]
    );
    return rows;
  };

  unblockUser = async (user_id) => {
    const { rows } = await query(
      `UPDATE users SET is_blocked = FALSE 
                                    WHERE user_id = $1 
                                    RETURNING *`,
      [user_id]
    );
    return rows;
  };

  assignRole = async (user_id, role_id) => {
    console.log(user_id + role_id);
    console.log("userDB")
    const { rows } = await query(
      `INSERT INTO user_roles(user_id , role_id) 
                                    VALUES ($1 , $2) RETURNING *`,
      [user_id, role_id]
    );

    return rows;
  };

  deleteRole = async (user_id, role_id) => {
    const { rows } = await query(
      `DELETE FROM user_roles WHERE user_id = $1 and role_id = $2`,
      [user_id, role_id]
    );
    return rows;
  };

  getUserRoles = async (user_id) => {
    const { rows } = await query(
      `SELECT * FROM users U 
                                    JOIN user_roles UR ON U.user_id = UR.user_id 
                                    JOIN roles R ON UR.role_id = R.role_id
                                    WHERE U.user_id = $1`,
      [user_id]
    );
    return rows;
  };

  updateUser = async (user_id, { username, email, password_hash }) => {
    const { rows } = await query(
      `UPDATE users SET username = $1 , email = $2 , password_hash = $3 
                                    WHERE user_id = $4
                                    RETURNING *`,
      [username, email, password_hash, user_id]
    );
    return rows;
  };

  getPlayerStats = async (user_id) => {
    const { rows } = await query(`SELECT * FROM player_stats p 
                                JOIN users u ON u.user_id = p.user_id 
                                WHERE u.user_id = $1`, [user_id])

    return rows
  }

  getLeaderboard = async (period) => {
    switch (period) {
      case 'weekly':
        await query(`INSERT INTO leaderboard_history (
          user_id, period_type, start_time, end_time, rank, score
        )
        SELECT 
        u.user_id,
        'WEEKLY',  
        CURRENT_DATE - INTERVAL '7 days',  
        CURRENT_DATE,
        RANK() OVER (ORDER BY ps.games_won DESC, u.xp_level DESC),
        ps.games_won
        FROM player_stats ps
        JOIN users u ON u.user_id = ps.user_id;
        `)

        const { rows: weekly_leaderboard } = await query(`SELECT * FROM leaderboard_history l
                          JOIN users u ON u.user_id = l.user_id 
                          WHERE l.period_type = 'WEEKLY'
                          AND l.end_time = (SELECT MAX(end_time) 
                          FROM leaderboard_history WHERE period_type = 'WEEKLY')
                          ORDER BY rank ASC
                          LIMIT 5;`)
        return weekly_leaderboard;


      case 'monthly':
        await query(`INSERT INTO leaderboard_history (
          user_id, period_type, start_time, end_time, rank, score
        )
        SELECT 
        u.user_id,
        'MONTHLY',  
        CURRENT_DATE - INTERVAL '30 days',  
        CURRENT_DATE,
        RANK() OVER (ORDER BY ps.games_won DESC, u.xp_level DESC),
        ps.games_won
        FROM player_stats ps
        JOIN users u ON u.user_id = ps.user_id;
        `)

        const { rows: monthly_leaderboard } = await query(`SELECT * FROM leaderboard_history l
                          JOIN users u ON u.user_id = l.user_id 
                          WHERE l.period_type = 'MONTHLY'
                          AND l.end_time = (SELECT MAX(end_time) 
                          FROM leaderboard_history WHERE period_type = 'MONTHLY')
                          ORDER BY rank ASC
                          LIMIT 5;`)

        return monthly_leaderboard

    }
  }
}

export default new UserDB();
