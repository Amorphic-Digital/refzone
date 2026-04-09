-- Deduplicate quiz titles by appending a number to duplicates
-- Keeps the oldest quiz with the original title, renames newer ones

DO $$
DECLARE
  rec RECORD;
  dup_count INTEGER;
BEGIN
  FOR rec IN
    SELECT id, title, created_at,
           ROW_NUMBER() OVER (PARTITION BY title ORDER BY created_at ASC) AS rn
    FROM quizzes
  LOOP
    IF rec.rn > 1 THEN
      UPDATE quizzes
      SET title = rec.title || ' (#' || rec.rn || ')'
      WHERE id = rec.id;
    END IF;
  END LOOP;
END $$;
