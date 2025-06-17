CREATE TABLE users (
  user_id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash CHAR(64) NOT NULL, -- SHA-256
  registration_date DATETIME NOT NULL,
  is_blocked BOOLEAN DEFAULT FALSE,
  xp_level INT DEFAULT 1
);

CREATE TABLE categories (
  category_id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL
);
CREATE TYPE CORRECT_ANSWER AS ENUM('A', 'B', 'C', 'D'); 
CREATE TYPE DIFFICULTY AS ENUM('HARD' , 'MEDIUM' , 'EASY');
CREATE TYPE APPROVAL_STATUS AS ENUM('ACCEPTED' , 'PENDING' , 'REJECTED');
CREATE TABLE questions (
  question_id SERIAL PRIMARY KEY,
  question_text TEXT NOT NULL,
  option_a VARCHAR(255) NOT NULL,
  option_b VARCHAR(255) NOT NULL,
  option_c VARCHAR(255) NOT NULL,
  option_d VARCHAR(255) NOT NULL,
  correct_answer CORRECT_ANSWER NOT NULL,
  category_id INT NOT NULL REFERENCES categories(category_id),
  difficulty DIFFICULTY NOT NULL,
  author_id INT NOT NULL REFERENCES users(user_id),
  approval_status APPROVAL_STATUS  DEFAULT 'PENDING',
  moderator_id INT REFERENCES users(user_id)
);

CREATE TYPE SESSION_STATUS AS ENUM('ACTIVE' , 'COMPLETED');
CREATE TABLE sessions (
  session_id SERIAL PRIMARY KEY,
  player1_id INT NOT NULL REFERENCES users(user_id),
  player2_id INT NOT NULL REFERENCES users(user_id),
  session_status SESSION_STATUS DEFAULT 'ACTIVE',
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP,
  winner_id INT REFERENCES users(user_id),
);

CREATE TABLE rounds (
  round_id SERIAL PRIMARY KEY,
  session_id INT NOT NULL REFERENCES sessions(session_id),
  round_number INT
  category_played INT REFERENCES categories(category_id)
);

CREATE TABLE round_questions (
  round_question_id SERIAL PRIMARY KEY,
  round_id INT NOT NULL REFERENCES rounds(round_id),
  question_id INT NOT NULL REFERENCES questions(question_id),
  player1_answer CORRECT_ANSWER,
  player2_answer CORRECT_ANSWER,
  response_time INT
);

CREATE TABLE player_stats (
  user_id INT PRIMARY KEY REFERENCES users(user_id),
  total_games INT DEFAULT 0,
  games_won INT DEFAULT 0,
  average_accuracy DECIMAL(5,2) DEFAULT 0.00
);

CREATE TABLE roles (
  role_id SERIAL PRIMARY KEY,
  role_name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE user_roles (
  user_id INT NOT NULL,
  role_id INT NOT NULL,
  PRIMARY KEY (user_id, role_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (role_id) REFERENCES roles(role_id)
);
CREATE TYPE ACTION_TYPE AS ENUM('UNBLOCK' , 'BLOCK' , 'REJECT' , 'CONFIRM');
CREATE TABLE moderation_actions (
  action_id SERIAL PRIMARY KEY,
  moderator_id INT NOT NULL REFERENCES users(user_id),
  target_user_id INT REFERENCES users(user_id),
  target_question_id INT REFERENCES questions(question_id),
  action_type ACTION_TYPE NOT NULL,
  action_date TIMESTAMP NOT NULL,
  notes TEXT
);
CREATE TYPE PERIOD_TYPE AS ENUM ('ALWAYS' , 'MONTHLY' , 'WEEKLY');
CREATE TABLE leaderboard_history (
  entry_id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(user_id),
  period_type PERIOD_TYPE NOT NULL,
  start_time DATE NOT NULL,
  end_time DATE NOT NULL,
  rank INT NOT NULL,
  score DECIMAL(10,2) NOT NULL
);

CREATE TABLE messages (
  message_id SERIAL PRIMARY KEY,
  sender_id INT NOT NULL REFERENCES users(user_id),
  receiver_id INT NOT NULL REFERENCES users(user_id),
  message_body TEXT NOT NULL,
  time_stamp TIMESTAMP NOT NULL,
  is_edited BOOLEAN DEFAULT FALSE,
  is_deleted BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_questions_category ON questions(category_id);
CREATE INDEX idx_sessions_players ON sessions(player1_id, player2_id);
CREATE INDEX idx_questions_difficulty ON questions(difficulty);

CREATE OR REPLACE FUNCTION update_player_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.session_status = 'COMPLETED' AND OLD.session_status <> 'COMPLETED' THEN
    -- Increase total games for both players
    UPDATE player_stats
    SET total_games = total_games + 1
    WHERE user_id IN (NEW.player1_id, NEW.player2_id);
    -- Increase games won for the winner
    IF NEW.winner_id IS NOT NULL THEN
      UPDATE player_stats
      SET games_won = games_won + 1
      WHERE user_id = NEW.winner_id;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER update_stats
AFTER UPDATE ON sessions
FOR EACH ROW
EXECUTE FUNCTION update_player_stats();



CREATE VIEW global_leaderboard AS
SELECT u.username, ps.games_won, u.xp_level
FROM player_stats ps
JOIN users u ON ps.user_id = u.user_id
ORDER BY u.xp_level DESC, ps.games_won DESC
LIMIT 10;
