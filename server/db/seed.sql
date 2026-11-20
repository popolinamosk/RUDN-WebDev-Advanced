INSERT INTO users (email, display_name)
VALUES ('anna@example.com', 'Анна');

INSERT INTO cards (title, is_done, is_urgent, owner_id)
VALUES
  ('Спроектировать структуру доски', true, false, (SELECT id FROM users WHERE email = 'anna@example.com')),
  ('Подключить доску к серверу', false, true, (SELECT id FROM users WHERE email = 'anna@example.com')),
  ('Добавить фильтр выполненных карточек', false, false, (SELECT id FROM users WHERE email = 'anna@example.com'));
